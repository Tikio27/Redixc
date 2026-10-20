# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Redixc demo brief
- Two selected visual targets: upload/image.png is fiber technology; upload/image(1).png is family.
- Official palette #0151FD / white, supplied SVG logos and Cerebri Sans Bold; slogan La fibra que te une al mundo.
- Local-only demos; never modify/delete user repository or production files and never deploy unless separately requested.
- Working light/dark/system controls, responsive pages, WhatsApp message preview, no automated lead submission.
- No invented coverage, testimonials, schedules, promises, or metrics. Prices refer to current site.

## V2 — 2026-10-16 feedback
User requires maximum fidelity to the selected concept boards: match hero image composition, section order, layout, typography scale and spacing. Remove additional marketing sections from the landing pages. Keep v1 intact. Continue local-only; no commit or publication until review.

## V3 approved fusion
User approved generated_images/exec-ef0781e9-449d-45b3-8911-ee282c82fdaf.png as visual truth. Family hero with laptop and headline, technology layout below: recommender, three plan cards, multicolumn footer. Preserve both themes. No locality bar or installation steps on the landing. Maintain dedicated routes. No commits or publishing before user review.

## V4 user feedback
Use edge-to-edge canvas without outer border radius or top strip. Separate hero and recommender with positive spacing. Theme selector is icon-only after WhatsApp. Every secondary page has its own coherent lifestyle hero, retaining existing text. User authorized commit and push only to design/redixc-landing-demos, never main; no deployment.

Mobile: center hero heading, description and CTAs; retain separate photo so faces and text remain readable.

Image direction: user rejected corporate-office scenes. Use contemporary families in modest rural community homes around Santiago Ixcuintla. Natural warm daylight, dignified everyday settings, consistent with main family/laptop image. Avoid corporate uniforms/headsets and luxury interiors.

## V5 selected homepage
User selected upload/image(4).png, exactly third displayed ideation image (exec-5edf5765-a389-45e8-9a57-2e81060e4dda.png). Full-width rural family hero, same left text position; benefits strip, recommender, plans, three installation steps, clarity photo section, FAQ/support, footer. Use rural family campaign throughout. Preserve light/dark, centered mobile text, and other pages. Validate locally before commit. Only branch design/redixc-landing-demos; never main or deploy.

V6: User requests solid non-white hero background, clearly separated from header and benefits. Light #e8efff, dark #16243e, photo on right without white fade; centered stacked mobile retained.

V6 steps: aligned equal-height cards, numbered top row with icon, short titles, concrete explanations and clear CTA for each step. Stack as full cards on mobile; no detached numbers or chevrons.

V7: Header is sticky at top on every route, with opaque theme background, visible separation, anchor offset and independently scrollable mobile dropdown. Validate scroll on desktop and mobile before committing only to design/redixc-landing-demos.

Homepage hero: use 70% width for text and 30% for the photo above the mobile breakpoint. Allow the copy container to use that space without the old width cap; retain centered, stacked text and photo on mobile.

Navigation: keep a compact header (56px on desktop, tablet and mobile) with a 112px desktop logo. Keep sticky anchor offsets synchronized with the header height.

Header logo: use the slogan-free logo-mark SVG variants in both themes. Display “La fibra que te une al mundo.” in the homepage hero instead of the previous fiber/local-service description.

Navigation content matches the main container: centered, maximum 1280px wide with 40px side gutters on desktop. Align the logo at its left edge and theme controls at its right edge; retain the distributed layout. User feedback concerns height and vertical centering, not a narrower horizontal group. Trim blank space in the header SVG viewBox to center the visible logo vertically. Homepage headline wraps naturally, with the blue phrase on its own line; allow hero height to grow with its content to prevent clipping.

Footer: omit the duplicate logo because branding stays visible in the sticky header. User rejected the tall stacked mobile footer and full-width WhatsApp button. Use a compact two-column layout: navigation on the left, contact and a simple WhatsApp link on the right; no separate Hablemos heading on mobile.

Footer structure: exactly two blocks on desktop and mobile: Navegación with all page links on the left, Contáctanos with phone, email, location and WhatsApp on the right.

Mobile footer density: user requests less height; use 28px link rows, 14px section padding, 6px heading gap and compact 10px legal copy. Preserve the two-column structure.

Footer desktop revision: preserve the latest compact mobile layout. Above 600px use a full-width theme-aware footer surface, horizontal navigation links, organized contact grid and a distinct legal bottom row. Do not commit or push any further changes until the user explicitly approves them.

Nosotros values section: use three theme-aware bordered cards with icon tiles on desktop, compact stacked cards with icons beside the text on mobile. Preserve the existing Cercanía, Claridad and Conexión copy. Changes remain local pending approval.

Values cards: align the icon and title horizontally in one row on desktop as well as mobile; put the desktop description beneath that row.

Apply the horizontal icon/title card heading consistently to help options (Quiero contratar, Ya soy cliente) and the coverage query panel, with descriptions and actions below. Keep all edits local pending approval.

Card motion: subtle hover elevation and border/shadow feedback for values, help, plans and connection steps; keyboard focus feedback for actionable cards. Honor prefers-reduced-motion and limit hover transforms to fine pointers. Keep changes local until approval.

Scroll animation: sections enter once with a gentle fade and 24px vertical drift, with staggered card entrances. Keep initial viewport visible, reveal focused content immediately, clean up on route changes and respect live reduced-motion preferences. No continuous scroll handlers or forced parallax. Keep edits local pending approval.

Mobile footer preview: user prefers the desktop grouping adapted into two stacked rows: horizontal wrapping navigation above a two-column contact grid. Match the desktop theme-aware background and compact spacing. Keep changes local pending approval.
