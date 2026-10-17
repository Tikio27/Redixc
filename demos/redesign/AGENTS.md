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
