// Everything in public/ is published as a URL, so each file must be used by
// the site. Unused files go to archive/ instead (see REDESIGN.md, «Limpieza»).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { plans, formatoUrl } from "./plans.js";

const root = fileURLToPath(new URL("../..", import.meta.url));
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const sources = [
  ...walk(join(root, "src/site")).filter((f) => /\.(jsx?|css)$/.test(f)),
  join(root, "src/index.css"),
  join(root, "index.html"),
]
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

// Files the site builds from a template instead of naming them literally.
const dynamic = new Set([
  // PageIntro: `/assets/hero-${page}.webp` (Planes uses hero-planes-eleccion).
  ...["cobertura", "nosotros", "ayuda", "legal"].map((p) => `assets/hero-${p}.webp`),
  // Header logo and Inicio hero by theme.
  "assets/logo-mark-white.svg",
  "assets/logo-mark-blue.svg",
  "assets/fiber-faithful-dark.webp",
  "assets/fiber-faithful-light.webp",
  // One simplified-information PDF per plan.
  ...plans.map((p) => formatoUrl(p).slice(1)),
]);

// Read by crawlers, not linked from the site.
const crawlerFiles = new Set(["robots.txt", "sitemap.xml"]);

test("every file in public/ is used by the site", () => {
  const unused = walk(join(root, "public"))
    .map((f) => relative(join(root, "public"), f))
    .filter((f) => !basename(f).startsWith("."))
    .filter((f) => !crawlerFiles.has(f) && !dynamic.has(f) && !sources.includes(basename(f)));
  assert.deepEqual(unused, [], `unused public files (move them to archive/): ${unused.join(", ")}`);
});

test("templated public files exist", () => {
  const files = new Set(walk(join(root, "public")).map((f) => relative(join(root, "public"), f)));
  for (const f of dynamic) assert.ok(files.has(f), `missing public/${f}`);
});

test("sitemap lists exactly the site's pages", () => {
  const app = readFileSync(join(root, "src/site/App.jsx"), "utf8");
  const pathsBlock = app.match(/const paths = \{([^}]*)\}/)[1];
  const pages = [...pathsBlock.matchAll(/"([^"]+)"/g)].map(([, p]) => `https://redixc.net${p}`);
  const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => l);
  assert.deepEqual([...locs].sort(), [...pages].sort());
});

test("robots.txt allows the site and points to the sitemap", () => {
  const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*$/m);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
  assert.match(robots, /^Sitemap: https:\/\/redixc\.net\/sitemap\.xml$/m);
});
