import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "execution", "vibecoding_projects.json");
const SEO_PATH = path.join(ROOT, "execution", "seo_metadata.json");
const INDEX_PATH = path.join(ROOT, "work_vibecoding.html");
const CASE_ROOT = path.join(ROOT, "work_vibecoding");
const CASE_ROUTE_PREFIX = "/work_vibecoding/";

const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
const projects = manifest.projects;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeExternalUrl(value) {
  const parsed = new URL(value);
  if (!['https:', 'http:'].includes(parsed.protocol)) {
    throw new Error(`Unsupported external URL protocol: ${value}`);
  }
  return parsed.href;
}

function validateProjects() {
  if (!Array.isArray(projects) || projects.length === 0) {
    throw new Error("The vibecoding manifest must contain at least one project.");
  }

  const slugs = new Set();
  for (const project of projects) {
    const requiredStrings = [
      "slug", "name", "category", "categoryLabel", "status", "year", "accent",
      "environment", "role", "tagline", "description", "problem", "solution", "privacy"
    ];
    for (const field of requiredStrings) {
      if (!project[field] || typeof project[field] !== "string") {
        throw new Error(`${project.slug ?? "Unknown project"}: missing ${field}.`);
      }
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      throw new Error(`${project.slug}: slug must be lowercase kebab-case.`);
    }
    if (slugs.has(project.slug)) throw new Error(`Duplicate project slug: ${project.slug}`);
    slugs.add(project.slug);

    if (!project.cover?.src || !project.cover?.alt || !project.cover?.width || !project.cover?.height) {
      throw new Error(`${project.slug}: cover needs src, alt, width, and height.`);
    }
    if (!Array.isArray(project.metrics) || project.metrics.length !== 3) {
      throw new Error(`${project.slug}: exactly three metrics are required.`);
    }
    if (!Array.isArray(project.workflow) || project.workflow.length !== 3) {
      throw new Error(`${project.slug}: exactly three workflow steps are required.`);
    }
    if (!Array.isArray(project.decisions) || project.decisions.length < 3) {
      throw new Error(`${project.slug}: at least three decisions are required.`);
    }
    if (!Array.isArray(project.proves) || project.proves.length < 3) {
      throw new Error(`${project.slug}: at least three proof points are required.`);
    }
    if (!Array.isArray(project.stack) || project.stack.length < 2) {
      throw new Error(`${project.slug}: at least two stack items are required.`);
    }
    if (project.github || JSON.stringify(project).match(/github\.com\/(?:AgntBldr|KlintMarketing)/i)) {
      throw new Error(`${project.slug}: public project data must not expose private or old-account GitHub links.`);
    }
    if (project.liveDemo) safeExternalUrl(project.liveDemo.url);
  }
}

async function validateImages() {
  const checked = new Set();
  for (const project of projects) {
    const images = [project.cover, ...(project.gallery ?? [])];
    for (const image of images) {
      if (!image.src.startsWith("/assets/")) {
        throw new Error(`${project.slug}: images must use root-relative /assets paths.`);
      }
      if (checked.has(image.src)) continue;
      checked.add(image.src);
      const localPath = path.join(ROOT, image.src.slice(1).split("/").join(path.sep));
      const stat = await fs.stat(localPath);
      if (!stat.isFile()) throw new Error(`${project.slug}: image is not a file: ${image.src}`);
      if (stat.size > 300_000) {
        throw new Error(`${project.slug}: image exceeds the 300 KB portfolio budget: ${image.src}`);
      }
    }
  }
}

function renderHead(title) {
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/assets/fonts/outfit.css">
    <link rel="stylesheet" href="/assets/css/tailwind.generated.css">
    <script src="/assets/vendor/lucide-1.24.0.min.js" defer></script>
    <style>
        :root { color-scheme: dark; }
        * { box-sizing: border-box; letter-spacing: 0; }
        html { background: #050505; scroll-behavior: smooth; }
        body { margin: 0; background: #050505; color: #f5f5f5; font-family: 'Outfit', sans-serif; }
        a { color: inherit; }
        .vibe-shell { min-height: 100vh; padding: 7rem 1.5rem 5rem; }
        .vibe-wrap { width: min(100%, 1180px); margin: 0 auto; }
        .vibe-eyebrow { margin: 0 0 .8rem; color: #fb923c; font-size: .78rem; font-weight: 800; text-transform: uppercase; }
        .vibe-title { margin: 0; color: #fff; font-size: 4rem; line-height: 1; font-weight: 800; }
        .vibe-lede { max-width: 760px; margin: 1.5rem 0 0; color: #b8b8b8; font-size: 1.22rem; line-height: 1.65; }
        .vibe-rule { border-top: 1px solid #262626; }
        .vibe-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 3rem; border-top: 1px solid #2b2b2b; border-bottom: 1px solid #2b2b2b; }
        .vibe-stat { min-width: 0; padding: 1.25rem 1.5rem 1.25rem 0; }
        .vibe-stat + .vibe-stat { padding-left: 1.5rem; border-left: 1px solid #2b2b2b; }
        .vibe-stat strong { display: block; color: #fff; font-size: 1.45rem; line-height: 1.1; overflow-wrap: anywhere; }
        .vibe-stat span { display: block; margin-top: .4rem; color: #8f8f8f; font-size: .8rem; line-height: 1.35; }
        .vibe-section { padding: 4.5rem 0; }
        .vibe-section-head { display: flex; align-items: end; justify-content: space-between; gap: 2rem; margin-bottom: 1.8rem; }
        .vibe-section h2 { margin: 0; color: #fff; font-size: 2rem; line-height: 1.15; font-weight: 800; }
        .vibe-section-copy { max-width: 650px; margin: .8rem 0 0; color: #a3a3a3; line-height: 1.7; }
        .vibe-filter { display: inline-flex; flex-wrap: wrap; gap: .35rem; padding: .3rem; border: 1px solid #303030; border-radius: 8px; background: #0d0d0d; }
        .vibe-filter button { min-height: 2.5rem; padding: .55rem .9rem; border: 0; border-radius: 6px; background: transparent; color: #9f9f9f; font: inherit; font-size: .82rem; font-weight: 700; cursor: pointer; }
        .vibe-filter button[aria-pressed="true"] { background: #f5f5f5; color: #050505; }
        .vibe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
        .vibe-card { --project-accent: #fb923c; min-width: 0; overflow: hidden; border: 1px solid #292929; border-radius: 8px; background: #0b0b0b; transition: transform .2s ease, border-color .2s ease; }
        .vibe-card:hover { transform: translateY(-3px); border-color: var(--project-accent); }
        .vibe-card[hidden] { display: none; }
        .vibe-card-link { display: flex; min-height: 100%; flex-direction: column; color: inherit; text-decoration: none; }
        .vibe-card-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-bottom: 1px solid #242424; background: #111; }
        .vibe-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .35s ease; }
        .vibe-card:hover .vibe-card-media img { transform: scale(1.025); }
        .vibe-card-status { position: absolute; top: .85rem; right: .85rem; max-width: calc(100% - 1.7rem); padding: .35rem .55rem; border: 1px solid #383838; border-radius: 6px; background: rgba(5, 5, 5, .9); color: #eee; font-size: .7rem; font-weight: 700; }
        .vibe-card-body { display: flex; flex: 1; flex-direction: column; padding: 1.35rem; }
        .vibe-card-meta { margin: 0 0 .65rem; color: var(--project-accent); font-size: .74rem; font-weight: 800; text-transform: uppercase; }
        .vibe-card h3 { margin: 0; color: #fff; font-size: 1.55rem; line-height: 1.15; font-weight: 800; overflow-wrap: anywhere; }
        .vibe-card p { margin: .8rem 0 1.2rem; color: #a8a8a8; font-size: .95rem; line-height: 1.6; }
        .vibe-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: auto; padding-top: 1rem; border-top: 1px solid #222; color: #d7d7d7; font-size: .8rem; font-weight: 700; }
        .vibe-card-footer span { min-width: 0; overflow-wrap: anywhere; }
        .vibe-card-footer i { width: 1rem; height: 1rem; flex: 0 0 auto; color: var(--project-accent); }
        .vibe-back { display: inline-flex; align-items: center; gap: .5rem; margin-bottom: 2.75rem; color: #b8b8b8; font-size: .9rem; font-weight: 700; text-decoration: none; }
        .vibe-back:hover { color: #fff; }
        .vibe-back i { width: 1rem; height: 1rem; }
        .vibe-case-header { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(250px, .65fr); gap: 4rem; align-items: end; }
        .vibe-case-header .vibe-title { font-size: 4.5rem; overflow-wrap: anywhere; }
        .vibe-case-meta { border-top: 1px solid #2c2c2c; }
        .vibe-case-meta-row { display: grid; grid-template-columns: 90px minmax(0, 1fr); gap: 1rem; padding: .9rem 0; border-bottom: 1px solid #252525; }
        .vibe-case-meta-row dt { color: #777; font-size: .76rem; text-transform: uppercase; }
        .vibe-case-meta-row dd { min-width: 0; margin: 0; color: #ddd; line-height: 1.35; overflow-wrap: anywhere; }
        .vibe-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.4rem; }
        .vibe-action { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .55rem; padding: .7rem 1rem; border: 1px solid #3c3c3c; border-radius: 6px; color: #fff; font-size: .85rem; font-weight: 800; text-decoration: none; }
        .vibe-action-primary { border-color: var(--project-accent); background: var(--project-accent); color: #050505; }
        .vibe-action i { width: 1rem; height: 1rem; }
        .vibe-hero-media { margin: 3.5rem 0 0; overflow: hidden; border-top: 1px solid #292929; border-bottom: 1px solid #292929; background: #0b0b0b; aspect-ratio: 16 / 9; }
        .vibe-hero-media img { width: 100%; height: 100%; object-fit: var(--cover-fit, cover); }
        .vibe-two-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4rem; }
        .vibe-two-col > * + * { padding-left: 4rem; border-left: 1px solid #292929; }
        .vibe-copy h3 { margin: 0 0 .75rem; color: #fff; font-size: 1.35rem; }
        .vibe-copy p { margin: 0; color: #aaa; font-size: 1.02rem; line-height: 1.75; }
        .vibe-workflow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid #292929; border-bottom: 1px solid #292929; }
        .vibe-step { min-width: 0; padding: 1.5rem 1.5rem 1.5rem 0; }
        .vibe-step + .vibe-step { padding-left: 1.5rem; border-left: 1px solid #292929; }
        .vibe-step-number { color: var(--project-accent); font-size: .75rem; font-weight: 800; }
        .vibe-step h3 { margin: .6rem 0 .45rem; color: #fff; font-size: 1.12rem; }
        .vibe-step p { margin: 0; color: #999; line-height: 1.6; }
        .vibe-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
        .vibe-gallery figure { margin: 0; min-width: 0; }
        .vibe-gallery-media { aspect-ratio: 16 / 10; overflow: hidden; border: 1px solid #292929; border-radius: 8px; background: #0a0a0a; }
        .vibe-gallery img { width: 100%; height: 100%; object-fit: contain; }
        .vibe-gallery figcaption { margin-top: .7rem; color: #8d8d8d; font-size: .82rem; line-height: 1.5; }
        .vibe-list { margin: 0; padding: 0; list-style: none; border-top: 1px solid #2b2b2b; }
        .vibe-list li { position: relative; padding: 1rem 0 1rem 1.5rem; border-bottom: 1px solid #242424; color: #b4b4b4; line-height: 1.6; }
        .vibe-list li::before { content: ''; position: absolute; top: 1.55rem; left: 0; width: .5rem; height: .5rem; background: var(--project-accent); }
        .vibe-stack { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem; }
        .vibe-stack span { padding: .45rem .65rem; border: 1px solid #303030; border-radius: 6px; background: #0d0d0d; color: #c8c8c8; font-size: .78rem; }
        .vibe-privacy { padding: 1.2rem 0 1.2rem 1.2rem; border-left: 3px solid var(--project-accent); color: #aaa; line-height: 1.65; }
        .vibe-next { display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding: 2rem 0; border-top: 1px solid #2b2b2b; border-bottom: 1px solid #2b2b2b; color: inherit; text-decoration: none; }
        .vibe-next small { display: block; margin-bottom: .35rem; color: #777; text-transform: uppercase; }
        .vibe-next strong { color: #fff; font-size: 1.35rem; overflow-wrap: anywhere; }
        .vibe-next i { width: 1.4rem; height: 1.4rem; flex: 0 0 auto; color: var(--project-accent); }
        @media (min-width: 768px) { .vibe-shell { margin-left: 18rem; } }
        @media (max-width: 900px) {
            .vibe-title, .vibe-case-header .vibe-title { font-size: 3.25rem; }
            .vibe-case-header { grid-template-columns: 1fr; gap: 2.5rem; }
            .vibe-two-col { gap: 2rem; }
            .vibe-two-col > * + * { padding-left: 2rem; }
        }
        @media (max-width: 700px) {
            .vibe-shell { padding: 6.5rem 1rem 4rem; }
            .vibe-title { font-size: 2.75rem; }
            .vibe-case-header .vibe-title { font-size: 2.2rem; line-height: 1.05; overflow-wrap: normal; word-break: normal; }
            .vibe-lede { font-size: 1.05rem; }
            .vibe-stats, .vibe-workflow { grid-template-columns: 1fr; }
            .vibe-stat, .vibe-stat + .vibe-stat, .vibe-step, .vibe-step + .vibe-step { padding: 1rem 0; border-left: 0; }
            .vibe-stat + .vibe-stat, .vibe-step + .vibe-step { border-top: 1px solid #292929; }
            .vibe-section-head { display: block; padding-right: 4.25rem; }
            .vibe-filter { display: flex; margin-top: 1.25rem; }
            .vibe-grid, .vibe-two-col, .vibe-gallery { grid-template-columns: 1fr; }
            .vibe-two-col { gap: 2.25rem; }
            .vibe-two-col > * + * { padding: 2.25rem 0 0; border-top: 1px solid #292929; border-left: 0; }
            .vibe-hero-media { aspect-ratio: 4 / 3; }
        }
    </style>`;
}

function renderScripts(includeFilters = false) {
  const filterScript = includeFilters ? `
        const buttons = [...document.querySelectorAll('[data-project-filter]')];
        const cards = [...document.querySelectorAll('[data-project-category]')];
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.dataset.projectFilter;
                buttons.forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
                cards.forEach((card) => { card.hidden = filter !== 'all' && card.dataset.projectCategory !== filter; });
            });
        });` : "";

  return `
    <script src="/assets/js/layout.js"></script>
    <script src="/assets/js/work_sidebar.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            renderWorkSidebar('vibecoding');
            if (window.lucide) lucide.createIcons();${filterScript}
        });
    </script>`;
}

function renderIndexCard(project, index) {
  return `
                <article class="vibe-card" data-project-category="${escapeHtml(project.category)}" style="--project-accent:${escapeHtml(project.accent)}">
                    <a class="vibe-card-link" href="/work_vibecoding/${escapeHtml(project.slug)}/" aria-label="Open ${escapeHtml(project.name)} case study">
                        <div class="vibe-card-media">
                            <img src="${escapeHtml(project.cover.src)}" alt="${escapeHtml(project.cover.alt)}" width="${project.cover.width}" height="${project.cover.height}" loading="${index < 2 ? "eager" : "lazy"}">
                            <span class="vibe-card-status">${escapeHtml(project.status)}</span>
                        </div>
                        <div class="vibe-card-body">
                            <p class="vibe-card-meta">${escapeHtml(project.categoryLabel)} / ${escapeHtml(project.year)}</p>
                            <h3>${escapeHtml(project.name)}</h3>
                            <p>${escapeHtml(project.tagline)}</p>
                            <div class="vibe-card-footer">
                                <span>${escapeHtml(project.environment)}</span>
                                <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                            </div>
                        </div>
                    </a>
                </article>`;
}

function renderIndex() {
  const featuredCount = projects.filter((project) => project.featured).length;
  const privateCount = projects.filter((project) => /private/i.test(project.status)).length;
  const cards = projects.map(renderIndexCard).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>${renderHead("Vibecoding Projects | Taylor Ryan")}
</head>
<body>
    <!-- Generated from execution/vibecoding_projects.json. -->
    <div id="sidebar-container"></div>
    <main class="vibe-shell">
        <div class="vibe-wrap">
            <header>
                <p class="vibe-eyebrow">Work portfolio</p>
                <h1 class="vibe-title">Vibecoding</h1>
                <p class="vibe-lede">Products, agentic systems, data workflows, and creative tools built by pairing product judgment with AI-assisted execution. Each project now has a permanent case study with the problem, workflow, decisions, and evidence behind the interface.</p>
                <div class="vibe-stats" aria-label="Vibecoding portfolio overview">
                    <div class="vibe-stat"><strong>${projects.length}</strong><span>Documented builds</span></div>
                    <div class="vibe-stat"><strong>${featuredCount}</strong><span>Recent systems added</span></div>
                    <div class="vibe-stat"><strong>${privateCount}</strong><span>Private-source products shown safely</span></div>
                </div>
            </header>

            <section class="vibe-section" aria-labelledby="project-library-title">
                <div class="vibe-section-head">
                    <div>
                        <p class="vibe-eyebrow">Project library</p>
                        <h2 id="project-library-title">Builds with context</h2>
                        <p class="vibe-section-copy">Browse the full collection or narrow it by the kind of problem being solved.</p>
                    </div>
                    <div class="vibe-filter" role="group" aria-label="Filter vibecoding projects">
                        <button type="button" data-project-filter="all" aria-pressed="true">All</button>
                        <button type="button" data-project-filter="systems" aria-pressed="false">Systems</button>
                        <button type="button" data-project-filter="product" aria-pressed="false">Products</button>
                        <button type="button" data-project-filter="creative-ai" aria-pressed="false">Creative AI</button>
                    </div>
                </div>
                <div class="vibe-grid">
${cards}
                </div>
            </section>

            <section class="vibe-section vibe-rule" aria-labelledby="collaboration-title">
                <p class="vibe-eyebrow">Build with me</p>
                <h2 id="collaboration-title">Have a useful system hiding in a messy workflow?</h2>
                <p class="vibe-section-copy">I am most interested in products where automation, judgment, data, and a real operator experience have to work together.</p>
                <div class="vibe-actions">
                    <a class="vibe-action" href="/contact/"><i data-lucide="message-square" aria-hidden="true"></i>Start a conversation</a>
                </div>
            </section>
        </div>
    </main>${renderScripts(true)}
</body>
</html>
`;
}

function renderMetric(metric) {
  return `<div class="vibe-stat"><strong>${escapeHtml(metric.value)}</strong><span>${escapeHtml(metric.label)}</span></div>`;
}

function renderWorkflowStep(step, index) {
  return `<div class="vibe-step"><span class="vibe-step-number">0${index + 1}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></div>`;
}

function renderList(items) {
  return `<ul class="vibe-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderGallery(project) {
  if (!project.gallery?.length) return "";
  return `
            <section class="vibe-section vibe-rule" aria-labelledby="gallery-title">
                <p class="vibe-eyebrow">Interface</p>
                <h2 id="gallery-title">Product views</h2>
                <div class="vibe-gallery" style="margin-top:1.75rem">
${project.gallery.map((image) => `
                    <figure>
                        <div class="vibe-gallery-media"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy"></div>
                        <figcaption>${escapeHtml(image.caption)}</figcaption>
                    </figure>`).join("")}
                </div>
            </section>`;
}

function renderCaseStudy(project, nextProject) {
  const liveDemo = project.liveDemo ? `
                    <a class="vibe-action vibe-action-primary" href="${escapeHtml(safeExternalUrl(project.liveDemo.url))}" target="_blank" rel="noopener noreferrer">
                        <i data-lucide="external-link" aria-hidden="true"></i>${escapeHtml(project.liveDemo.label)}
                    </a>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>${renderHead(`${project.name} | Vibecoding | Taylor Ryan`)}
</head>
<body style="--project-accent:${escapeHtml(project.accent)}">
    <!-- Generated from execution/vibecoding_projects.json. -->
    <div id="sidebar-container"></div>
    <main class="vibe-shell">
        <div class="vibe-wrap">
            <a class="vibe-back" href="/work_vibecoding/"><i data-lucide="arrow-left" aria-hidden="true"></i>All vibecoding projects</a>
            <header class="vibe-case-header">
                <div>
                    <p class="vibe-eyebrow">${escapeHtml(project.categoryLabel)} / ${escapeHtml(project.year)}</p>
                    <h1 class="vibe-title">${escapeHtml(project.name)}</h1>
                    <p class="vibe-lede">${escapeHtml(project.tagline)}</p>
                    <div class="vibe-actions">${liveDemo}
                        <a class="vibe-action" href="#case-study"><i data-lucide="arrow-down" aria-hidden="true"></i>Read case study</a>
                    </div>
                </div>
                <dl class="vibe-case-meta">
                    <div class="vibe-case-meta-row"><dt>Status</dt><dd>${escapeHtml(project.status)}</dd></div>
                    <div class="vibe-case-meta-row"><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
                    <div class="vibe-case-meta-row"><dt>Surface</dt><dd>${escapeHtml(project.environment)}</dd></div>
                    <div class="vibe-case-meta-row"><dt>Source</dt><dd>Private unless a public demo is linked</dd></div>
                </dl>
            </header>

            <figure class="vibe-hero-media" style="--cover-fit:${escapeHtml(project.cover.fit ?? "cover")}">
                <img src="${escapeHtml(project.cover.src)}" alt="${escapeHtml(project.cover.alt)}" width="${project.cover.width}" height="${project.cover.height}" fetchpriority="high">
            </figure>

            <div class="vibe-stats" aria-label="${escapeHtml(project.name)} project highlights">
                ${project.metrics.map(renderMetric).join("")}
            </div>

            <section id="case-study" class="vibe-section" aria-labelledby="case-study-title">
                <p class="vibe-eyebrow">Case study</p>
                <h2 id="case-study-title">From problem to working product</h2>
                <p class="vibe-section-copy">${escapeHtml(project.description)}</p>
                <div class="vibe-two-col" style="margin-top:2.5rem">
                    <div class="vibe-copy"><h3>The problem</h3><p>${escapeHtml(project.problem)}</p></div>
                    <div class="vibe-copy"><h3>The response</h3><p>${escapeHtml(project.solution)}</p></div>
                </div>
            </section>

            <section class="vibe-section vibe-rule" aria-labelledby="workflow-title">
                <p class="vibe-eyebrow">Workflow</p>
                <h2 id="workflow-title">How the system moves</h2>
                <div class="vibe-workflow" style="margin-top:1.75rem">${project.workflow.map(renderWorkflowStep).join("")}</div>
            </section>${renderGallery(project)}

            <section class="vibe-section vibe-rule" aria-labelledby="decisions-title">
                <div class="vibe-two-col">
                    <div>
                        <p class="vibe-eyebrow">Build decisions</p>
                        <h2 id="decisions-title">Choices that shaped the product</h2>
                        <div style="margin-top:1.5rem">${renderList(project.decisions)}</div>
                    </div>
                    <div>
                        <p class="vibe-eyebrow">What it demonstrates</p>
                        <h2>Proof beyond the interface</h2>
                        <div style="margin-top:1.5rem">${renderList(project.proves)}</div>
                    </div>
                </div>
            </section>

            <section class="vibe-section vibe-rule" aria-labelledby="stack-title">
                <div class="vibe-two-col">
                    <div>
                        <p class="vibe-eyebrow">Build stack</p>
                        <h2 id="stack-title">Tools and architecture</h2>
                        <div class="vibe-stack">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
                    </div>
                    <div>
                        <p class="vibe-eyebrow">Private by design</p>
                        <h2>Showing the work without opening the repo</h2>
                        <p class="vibe-privacy" style="margin-top:1.5rem">${escapeHtml(project.privacy)}</p>
                    </div>
                </div>
            </section>

            <a class="vibe-next" href="/work_vibecoding/${escapeHtml(nextProject.slug)}/" aria-label="Next case study: ${escapeHtml(nextProject.name)}">
                <span><small>Next case study</small><strong>${escapeHtml(nextProject.name)}</strong></span>
                <i data-lucide="arrow-right" aria-hidden="true"></i>
            </a>
        </div>
    </main>${renderScripts(false)}
</body>
</html>
`;
}

async function syncSeoMetadata() {
  const seo = JSON.parse(await fs.readFile(SEO_PATH, "utf8"));
  const indexPage = seo.pages.find((page) => page.route === CASE_ROUTE_PREFIX);
  if (!indexPage) throw new Error("SEO metadata is missing the /work_vibecoding/ index route.");

  indexPage.title = "Vibecoding Projects | Taylor Ryan";
  indexPage.description = "Explore Taylor Ryan's AI-assisted products, agentic systems, data workflows, and creative tools through permanent project case studies.";
  indexPage.image = projects[0].cover.src;
  indexPage.imageAlt = projects[0].cover.alt;
  indexPage.imageWidth = projects[0].cover.width;
  indexPage.imageHeight = projects[0].cover.height;

  const retained = seo.pages.filter((page) => page.route === CASE_ROUTE_PREFIX || !page.route.startsWith(CASE_ROUTE_PREFIX));
  const indexPosition = retained.findIndex((page) => page.route === CASE_ROUTE_PREFIX);
  const projectPages = projects.map((project) => ({
    route: `${CASE_ROUTE_PREFIX}${project.slug}/`,
    title: `${project.name} | Vibecoding | Taylor Ryan`,
    description: `${project.tagline} See the workflow, build decisions, and evidence.`,
    image: project.cover.src,
    imageAlt: project.cover.alt,
    imageWidth: project.cover.width,
    imageHeight: project.cover.height,
    index: true
  }));

  seo.pages = [
    ...retained.slice(0, indexPosition + 1),
    ...projectPages,
    ...retained.slice(indexPosition + 1)
  ];
  seo.site.lastmod = manifest.updated;
  await fs.writeFile(SEO_PATH, `${JSON.stringify(seo, null, 2)}\n`, "utf8");
}

validateProjects();
await validateImages();
await fs.mkdir(CASE_ROOT, { recursive: true });
await fs.writeFile(INDEX_PATH, renderIndex(), "utf8");

for (let index = 0; index < projects.length; index += 1) {
  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];
  const destination = path.join(CASE_ROOT, project.slug);
  await fs.mkdir(destination, { recursive: true });
  await fs.writeFile(path.join(destination, "index.html"), renderCaseStudy(project, nextProject), "utf8");
}

await syncSeoMetadata();
console.log(`Generated vibecoding index and ${projects.length} project case studies.`);
