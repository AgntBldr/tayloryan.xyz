import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DEPLOY_ROOT = path.join(ROOT, "DEPLOY_PUBLIC");
const manifest = JSON.parse(await fs.readFile(path.join(ROOT, "execution", "vibecoding_projects.json"), "utf8"));
const seo = JSON.parse(await fs.readFile(path.join(ROOT, "execution", "seo_metadata.json"), "utf8"));
const projects = manifest.projects;
const findings = [];

function record(name, passed, detail) {
  findings.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} ${name}: ${detail}`);
}

async function exists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

const sourceIndex = await fs.readFile(path.join(ROOT, "work_vibecoding.html"), "utf8");
const deployIndexPath = path.join(DEPLOY_ROOT, "work_vibecoding", "index.html");
const deployIndex = await fs.readFile(deployIndexPath, "utf8");
const sourceProjectLinks = [...sourceIndex.matchAll(/href="\/work_vibecoding\/([a-z0-9-]+)\/"/g)].map((match) => match[1]);

record(
  "manifest project count",
  projects.length === 13 && new Set(projects.map((project) => project.slug)).size === projects.length,
  `${projects.length} unique projects are defined.`
);
record(
  "modal removal",
  !/project-modal|openModal|modal-overlay/i.test(sourceIndex),
  "The Vibecoding index uses permanent links and contains no project modal implementation."
);
record(
  "index project links",
  projects.every((project) => sourceProjectLinks.includes(project.slug)),
  `${new Set(sourceProjectLinks).size}/${projects.length} project routes are linked from the source index.`
);
record(
  "filter controls",
  ["all", "systems", "product", "creative-ai"].every((filter) => sourceIndex.includes(`data-project-filter="${filter}"`)),
  "All, Systems, Products, and Creative AI filters are present."
);
record(
  "side navigation preserved",
  sourceIndex.includes("renderWorkSidebar('vibecoding')") && deployIndex.includes("renderWorkSidebar('vibecoding')"),
  "The existing Work sidebar is initialized on source and deployed indexes."
);

const requiredRecentProjects = [
  "application-agent",
  "hypnoapp",
  "resource-summarizer",
  "ecommerce-intelligence",
  "project-second-brain"
];
record(
  "recent project additions",
  requiredRecentProjects.every((slug) => projects.some((project) => project.slug === slug)),
  `${requiredRecentProjects.length}/${requiredRecentProjects.length} selected recent projects are in the manifest.`
);

const forbiddenRepoPattern = /github\.com\/(?:AgntBldr|KlintMarketing)/i;
const manifestText = JSON.stringify(manifest);
const legacyData = await fs.readFile(path.join(ROOT, "assets", "js", "projects_data.js"), "utf8");
record(
  "private repository boundary",
  !forbiddenRepoPattern.test(manifestText) && !forbiddenRepoPattern.test(sourceIndex) && !forbiddenRepoPattern.test(deployIndex),
  "No private AgntBldr or old KlintMarketing GitHub URL is exposed by the new portfolio surfaces."
);
record(
  "old account links removed",
  !/github\.com\/KlintMarketing/i.test(legacyData),
  "Legacy project data no longer links visitors to the old GitHub account."
);

const seoRoutes = new Map(seo.pages.map((page) => [page.route, page]));
const missingSeo = [];
const missingSourcePages = [];
const missingDeployPages = [];
const brokenCaseContent = [];
const imageProblems = [];

for (const project of projects) {
  const route = `/work_vibecoding/${project.slug}/`;
  const sourcePath = path.join(ROOT, "work_vibecoding", project.slug, "index.html");
  const deployPath = path.join(DEPLOY_ROOT, "work_vibecoding", project.slug, "index.html");
  if (!seoRoutes.has(route)) missingSeo.push(route);
  if (!await exists(sourcePath)) missingSourcePages.push(project.slug);
  if (!await exists(deployPath)) missingDeployPages.push(project.slug);

  if (await exists(sourcePath)) {
    const html = await fs.readFile(sourcePath, "utf8");
    if (!html.includes(project.name) || !html.includes("From problem to working product") || !html.includes("renderWorkSidebar('vibecoding')")) {
      brokenCaseContent.push(`${project.slug}: source structure`);
    }
    if (forbiddenRepoPattern.test(html)) brokenCaseContent.push(`${project.slug}: repository leak`);
  }

  if (await exists(deployPath)) {
    const html = await fs.readFile(deployPath, "utf8");
    if (!html.includes(`rel="canonical" href="https://taylorryan.xyz${route}"`) || !html.includes(project.cover.src)) {
      brokenCaseContent.push(`${project.slug}: deployed metadata`);
    }
    if (/name="robots" content="noindex/i.test(html)) brokenCaseContent.push(`${project.slug}: noindex`);
  }

  for (const image of [project.cover, ...(project.gallery ?? [])]) {
    const imagePath = path.join(ROOT, image.src.slice(1).split("/").join(path.sep));
    if (!await exists(imagePath)) {
      imageProblems.push(`${project.slug}: missing ${image.src}`);
      continue;
    }
    const stat = await fs.stat(imagePath);
    if (stat.size > 300_000) imageProblems.push(`${project.slug}: ${image.src} is ${stat.size} bytes`);
  }
}

record("case-study source routes", missingSourcePages.length === 0, `${projects.length - missingSourcePages.length}/${projects.length} source pages exist.`);
record("case-study deploy routes", missingDeployPages.length === 0, `${projects.length - missingDeployPages.length}/${projects.length} deployed pages exist.`);
record("case-study SEO coverage", missingSeo.length === 0, `${projects.length - missingSeo.length}/${projects.length} project routes have canonical metadata configuration.`);
record("case-study page structure", brokenCaseContent.length === 0, brokenCaseContent.length ? brokenCaseContent.join("; ") : "All source and deployed pages contain the expected case-study and metadata structure.");
record("portfolio image budget", imageProblems.length === 0, imageProblems.length ? imageProblems.join("; ") : "Every referenced project image exists and is at or below 300 KB.");

const report = {
  generatedAt: new Date().toISOString(),
  branchIntent: "reversible-vibecoding-case-studies",
  projectCount: projects.length,
  recentProjectCount: requiredRecentProjects.length,
  findings,
  passed: findings.every((finding) => finding.passed)
};
const reportPath = path.join(ROOT, "audits", "site-audit", "vibecoding-portfolio-verification-2026-07-15.json");
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

if (!report.passed) process.exitCode = 1;
