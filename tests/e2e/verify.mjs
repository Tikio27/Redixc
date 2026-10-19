// Browser checks for the Redixc site. Uses an existing playwright-core install
// (nothing is installed): override with PLAYWRIGHT_CORE=/path/to/playwright-core.
// Usage: npm run dev, then node tests/e2e/verify.mjs [--only=base,datos,...]
// BASE_URL defaults to the Vite dev server (http://127.0.0.1:5173).
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE ||
    "/Users/tiquiorodriguez/projects/negora/node_modules/playwright-core",
);
const BASE = process.env.BASE_URL || "http://127.0.0.1:5173";
const ROUTES = ["/", "/planes", "/cobertura", "/nosotros", "/ayuda", "/legal"];
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true };

const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
const groups = [];
const group = (name, fn) => groups.push({ name, fn });
let failures = 0,
  passes = 0;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function open(browser, path, viewport = DESKTOP, options = {}) {
  const { isMobile, hasTouch, ...size } = viewport;
  const { noViewTransitions, ...contextOptions } = options;
  const context = await browser.newContext({
    viewport: size,
    isMobile: !!isMobile,
    hasTouch: !!hasTouch,
    ...contextOptions,
  });
  // The site reads its theme from localStorage; ?tema= sets it before boot.
  const tema = new URL(BASE + path).searchParams.get("tema");
  if (tema)
    await context.addInitScript((t) => localStorage.setItem("redixc-theme", t), tema);
  if (options.noViewTransitions)
    await context.addInitScript(() => delete Document.prototype.startViewTransition);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  return { page, context, errors };
}

async function check(name, fn) {
  try {
    await fn();
    passes++;
    console.log(`PASS ${name}`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${name}\n     ${error.message.split("\n")[0]}`);
  }
}

group("base", async (browser) => {
  for (const [label, viewport] of [["1440", DESKTOP], ["390", MOBILE]])
    for (const route of ROUTES)
      await check(`base ${route} @${label}`, async () => {
        const { page, context, errors } = await open(browser, `${route}?tema=light`, viewport);
        const h1 = await page.locator("h1").count();
        // isMobile contexts grow innerWidth to fit overflowing content, so
        // compare against the configured viewport width instead.
        const overflow = await page.evaluate(
          (w) => document.documentElement.scrollWidth - w,
          viewport.width,
        );
        await context.close();
        assert(h1 === 1, `expected one h1, found ${h1}`);
        assert(overflow === 0, `horizontal overflow ${overflow}px`);
        assert(!errors.length, `page errors: ${errors[0]}`);
      });
});

// Task-specific groups (datos, recomendador, planes, …) live in checks.mjs.
const { registerChecks } = await import("./checks.mjs");
registerChecks?.({ group, check, open, assert, ROUTES, BASE, DESKTOP, MOBILE });

const browser = await chromium.launch();
for (const { name, fn } of groups)
  if (!only || only.includes(name)) await fn(browser);
await browser.close();
console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
