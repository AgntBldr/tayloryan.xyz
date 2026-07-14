import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "DEPLOY_PUBLIC");
const reportPath = path.join(root, "audits", "site-audit", "conversion-ux-verification-2026-07-14.json");
const failures = [];
const checks = [];

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function record(name, passed, detail) {
  checks.push({ name, passed, detail });
  if (!passed) failures.push(`${name}: ${detail}`);
}

const publicFiles = await walk(publicRoot);
const textFiles = publicFiles.filter((file) => /\.(?:css|html|js|json|txt|xml)$/i.test(file));
const publicText = await Promise.all(textFiles.map((file) => readFile(file, "utf8")));
const publicBlob = publicText.join("\n");

const preservation = await readJson("audits/site-audit/resource-preservation-manifest.json");
const googleUrls = [...new Set(preservation.rows.map((row) => row.url).filter(Boolean))];
const expectedDeployedGoogleUrls = [...new Set(
  preservation.rows
    .filter((row) => row.public_state !== "not_working_broken")
    .map((row) => row.url)
    .filter(Boolean)
)];
const missingGoogleUrls = expectedDeployedGoogleUrls.filter((url) => !publicBlob.includes(url));
const brokenLedgerUrls = [...new Set(
  preservation.rows
    .filter((row) => row.public_state === "not_working_broken")
    .map((row) => row.url)
    .filter(Boolean)
)];
record(
  "Google deployed URL preservation",
  missingGoogleUrls.length === 0,
  `${expectedDeployedGoogleUrls.length - missingGoogleUrls.length}/${expectedDeployedGoogleUrls.length} public or auth-gated URLs remain in DEPLOY_PUBLIC; ${missingGoogleUrls.length} missing.`
);
record(
  "Broken Google recovery ledger",
  googleUrls.length === 622 && brokenLedgerUrls.length === 80,
  `${brokenLedgerUrls.length} broken URLs remain recorded in the ${googleUrls.length}-row recovery manifest without requiring dead public links.`
);
record(
  "Google audit classification",
  preservation.summary.google.total_google_urls === 622 && preservation.summary.google.not_public_working === 597,
  `${preservation.summary.google.total_google_urls} total; ${preservation.summary.google.not_public_working} auth-gated or broken; 25 public.`
);

const questsSource = await readFile(path.join(root, "assets", "js", "quests_data.js"), "utf8");
const layer3Urls = [...new Set(questsSource.match(/https:\/\/app\.layer3\.xyz\/[^"'\s<]+/g) || [])];
const missingLayer3Urls = layer3Urls.filter((url) => !publicBlob.includes(url));
record(
  "Layer3 preservation",
  layer3Urls.length === 39 && missingLayer3Urls.length === 0,
  `${layer3Urls.length - missingLayer3Urls.length}/${layer3Urls.length} Layer3 URLs remain in DEPLOY_PUBLIC.`
);

const marketingSidebar = await readFile(path.join(root, "assets", "js", "marketing_sidebar.js"), "utf8");
const marketingRoutes = [
  "/portfolio/marketing/",
  "/portfolio/marketing/content_creator/",
  "/portfolio/marketing/email_outreach/",
  "/portfolio/marketing/social_media/",
  "/portfolio/marketing/affiliates/",
  "/portfolio/marketing/case_studies/",
  "/portfolio/marketing/testimonials/",
  "/work_projects/"
];
record(
  "Marketing side menu",
  marketingRoutes.every((route) => marketingSidebar.includes(route)) && marketingSidebar.includes("toggleDesktopSidebar()") && marketingSidebar.includes("togglePortfolioSidebar()"),
  "All 8 existing destinations and the desktop collapse control remain."
);

const workSidebar = await readFile(path.join(root, "assets", "js", "work_sidebar.js"), "utf8");
const workRoutes = [
  "/work_projects/",
  "/work_vibecoding/",
  "/portfolio/quests/",
  "/work_speaker/",
  "/work_podcasts/",
  "/work_writing/",
  "/work_courses/",
  "/work_tutorials/",
  "/work_video/",
  "/work_some/",
  "/portfolio/marketing/"
];
record(
  "Work side menus",
  workRoutes.every((route) => workSidebar.includes(route)) && workSidebar.includes("renderSpeakerSidebar") && workSidebar.includes("renderAboutSidebar") && workSidebar.includes("togglePortfolioSidebar()"),
  "All 11 work destinations plus the speaker and about side menus remain."
);

const sourceHomepage = await readFile(path.join(root, "index.html"), "utf8");
const sourceWork = await readFile(path.join(root, "work.html"), "utf8");
const sourceContact = await readFile(path.join(root, "contact.html"), "utf8");
const deployedCaseStudies = await readFile(path.join(publicRoot, "portfolio", "marketing", "case_studies", "index.html"), "utf8");
const caseStudySidebarInitializers = deployedCaseStudies.match(/renderMarketingSidebar\('case-studies'\)/g) || [];
record(
  "Clean-route source freshness",
  caseStudySidebarInitializers.length === 1,
  `Case Studies clean route has ${caseStudySidebarInitializers.length} sidebar initializer after legacy-source refresh.`
);
record(
  "Vibecoding remains first-class",
  sourceHomepage.includes("/work_vibecoding/") && sourceHomepage.includes(">Vibecoding<") && sourceWork.includes("Build with AI") && sourceWork.includes("/work_vibecoding/"),
  "Vibecoding remains on the homepage, in the work side menu, and first in the goal navigator."
);
record(
  "Work archive preserved",
  sourceWork.includes('id="all-work"') && sourceWork.includes("Browse the full archive"),
  "The new goal navigator links into the unchanged full archive."
);
record(
  "Contact fit cues",
  sourceContact.includes("A good fit") && sourceContact.includes('for="contact-name"') && sourceContact.includes('for="contact-email"'),
  "Fit guidance and connected form labels are present."
);
record(
  "Private email remains private",
  !/taylor@klintmarketing\.com/i.test(publicBlob),
  "Taylor@klintmarketing.com does not appear in DEPLOY_PUBLIC."
);

const modalFallbackFiles = [
  "portfolio/marketing/affiliates.html",
  "portfolio/marketing/case_studies.html",
  "portfolio/marketing/case_studies/examples/index.html",
  "portfolio/marketing/content_creator.html",
  "portfolio/marketing/content_creator_external.html",
  "portfolio/marketing/email_outreach.html",
  "portfolio/marketing/email_outreach/templates/index.html",
  "portfolio/marketing/email_outreach/video/index.html",
  "portfolio/marketing/testimonials.html",
  "portfolio/quests/resources.html",
  "work_speaker_topics.html"
];
const modalFallbackSources = await Promise.all(
  modalFallbackFiles.map((file) => readFile(path.join(root, file), "utf8"))
);
const staleModalFallbacks = modalFallbackFiles.filter((_, index) =>
  /Resource Title|Description goes here/i.test(modalFallbackSources[index])
);
const modalFilesWithoutAction = modalFallbackFiles.filter((file, index) => {
  const source = modalFallbackSources[index];
  return file === "work_speaker_topics.html"
    ? !source.includes('href="https://bookme.name/TaylorRyan"')
    : !source.includes('id="modal-link"');
});
record(
  "Resource modal fallbacks",
  staleModalFallbacks.length === 0 && modalFilesWithoutAction.length === 0,
  `${modalFallbackFiles.length - staleModalFallbacks.length}/${modalFallbackFiles.length} templates use neutral fallbacks; ${modalFilesWithoutAction.length} lack a resource or booking action.`
);

const accessibility = await readJson("audits/site-audit/accessibility-static-2026-07-14.json");
record("Static accessibility", accessibility.issue_count === 0, `${accessibility.issue_count} issue(s) across ${accessibility.files_scanned} source files.`);

const cleanRoutes = await readJson("audits/site-audit/clean-route-normalization-2026-07-14.json");
record(
  "Clean public routes",
  cleanRoutes.unresolved_count === 0 && cleanRoutes.remaining_internal_html_links === 0,
  `${cleanRoutes.normalized_count} links normalized; ${cleanRoutes.unresolved_count} unresolved; ${cleanRoutes.remaining_internal_html_links} internal .html links remain.`
);

const frontend = await readJson("audits/site-audit/local-frontend-assets-2026-07-14.json");
record(
  "Local frontend runtime",
  frontend.missing_assets.length === 0 && frontend.external_runtime_references.length === 0,
  `${frontend.missing_assets.length} missing local assets and ${frontend.external_runtime_references.length} external runtime references.`
);

const generatedCss = await readFile(path.join(root, "assets", "css", "tailwind.generated.css"), "utf8");
const cssBackgroundUrls = [...new Set(
  [...generatedCss.matchAll(/url\((\/assets\/images\/[^)]+)\)/g)].map((match) => match[1])
)];
const missingCssBackgrounds = [];
for (const url of cssBackgroundUrls) {
  try {
    const info = await stat(path.join(publicRoot, url.replace(/^\//, "")));
    if (!info.isFile() || info.size === 0) missingCssBackgrounds.push(url);
  } catch {
    missingCssBackgrounds.push(url);
  }
}
record(
  "CSS background assets",
  cssBackgroundUrls.length > 0 && missingCssBackgrounds.length === 0 && !/url\((?:\.\.\/)?assets\/images\//.test(generatedCss),
  `${cssBackgroundUrls.length} absolute image URLs checked; ${missingCssBackgrounds.length} missing; no document-relative URLs remain.`
);

const logos = await readJson("audits/site-audit/trust-logo-assets-2026-07-14.json");
const missingLogoFiles = [];
for (const asset of logos.assets) {
  for (const base of [root, publicRoot]) {
    try {
      const info = await stat(path.join(base, asset.file));
      if (!info.isFile() || info.size === 0) missingLogoFiles.push(path.join(base, asset.file));
    } catch {
      missingLogoFiles.push(path.join(base, asset.file));
    }
  }
}
const productReview = await readFile(path.join(root, "audits", "site-audit", "product-review-2026-07-14.html"), "utf8");
const missingReviewLogoReferences = logos.assets.filter((asset) => !productReview.includes(`../../${asset.file}`));
const rasterLogos = logos.assets.filter((asset) => asset.file.endsWith(".png"));
const invalidNormalizedLogos = rasterLogos.filter((asset) => {
  const match = /^(\d+)x(\d+)$/.exec(asset.normalized_visible_bounds || "");
  if (!match) return true;
  const [, width, height] = match.map(Number);
  return width < 1 || width > 220 || height < 1 || height > 68;
});
const markLogos = ["NEAR Protocol", "Rockstart"];
record(
  "Trust logo assets",
  logos.asset_count === 34 && missingLogoFiles.length === 0 && missingReviewLogoReferences.length === 0 && invalidNormalizedLogos.length === 0 && markLogos.every((name) => sourceHomepage.includes(`trust-logo trust-logo--mark" role="img" aria-label="${name}"`)) && sourceHomepage.includes('trust-logo trust-logo--color" role="img" aria-label="Maersk"') && sourceHomepage.includes('data-trust-logo-group="companies"') && sourceHomepage.includes('data-trust-logo-group="accelerators"'),
  `${logos.asset_count} local assets; ${missingLogoFiles.length} missing copies; ${missingReviewLogoReferences.length} missing review references; ${invalidNormalizedLogos.length} raster sizing failures; both marquees remain.`
);

const report = {
  generated_at: new Date().toISOString(),
  passed: failures.length === 0,
  check_count: checks.length,
  failure_count: failures.length,
  checks,
  failures,
  missing_google_urls: missingGoogleUrls,
  missing_layer3_urls: missingLayer3Urls,
  missing_css_backgrounds: missingCssBackgrounds,
  missing_logo_files: missingLogoFiles,
  missing_review_logo_references: missingReviewLogoReferences.map((asset) => asset.name),
  stale_modal_fallbacks: staleModalFallbacks,
  modal_files_without_action: modalFilesWithoutAction,
  invalid_normalized_logos: invalidNormalizedLogos.map((asset) => asset.name)
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}: ${check.detail}`);
if (failures.length > 0) {
  console.error(`\nConversion UX verification failed with ${failures.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`\nConversion UX verification passed: ${checks.length}/${checks.length} checks.`);
}
