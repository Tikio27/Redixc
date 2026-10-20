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

test("every file in public/ is used by the site", () => {
  const unused = walk(join(root, "public"))
    .map((f) => relative(join(root, "public"), f))
    .filter((f) => !basename(f).startsWith("."))
    .filter((f) => !dynamic.has(f) && !sources.includes(basename(f)));
  assert.deepEqual(unused, [], `unused public files (move them to archive/): ${unused.join(", ")}`);
});

test("templated public files exist", () => {
  const files = new Set(walk(join(root, "public")).map((f) => relative(join(root, "public"), f)));
  for (const f of dynamic) assert.ok(files.has(f), `missing public/${f}`);
});
