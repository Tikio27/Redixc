# REDIXC V5 · Selected homepage QA

final result: passed

## Source and evidence
Exact selected visual truth: upload/image(4).png, third displayed ideation output exec-5edf5765-a389-45e8-9a57-2e81060e4dda.png. Source image 803×1960 px. Actual full-page light screenshot: /workspace/scratch/redixc-v5-light.png (1348 px wide), dark: /workspace/scratch/redixc-v5-dark.png. Comparison inspected side by side in qa/v5-comparison.png; both normalized to 650 px wide. Supporting focused screenshots: redixc-v5-responsive-top.png, redixc-v5-responsive-steps.png, redixc-v5-responsive-help.png, redixc-v5-responsive-dark.png, redixc-v5-dark-detail.png in /workspace/scratch. Captures are review evidence in the session environment, not committed images.

## Scope and browser verification
Implemented selected sequence: full-width family hero, three benefits, recommender, three plans, connection steps, clarity photograph/links, support and FAQ, footer. Other routes preserved.
Cloud Chrome, real iframe widths 390/768/1366 px in light and dark; classic scrollbars leave 375/753/1351 px content widths. Gallery scales tablet and desktop presentation only; real CSS viewport remains unchanged. No horizontal document overflow. Mobile hero copy remains centered, steps become a vertical list, clarity and support stack in reading order. All generated images loaded. The clarity image lazy-loads on scroll; initial top-only full-page capture was refreshed after scrolling to it.

## Required fidelity surfaces
- Typography: supplied Cerebri bold display and Arial body, current heading hierarchy and line wraps retained. Content remains editable HTML.
- Layout: edge-to-edge hero/photo; consistent inner text alignment; benefit strip and new sections follow selected mock. Main container has no outer radius. Mobile avoids overlay text on faces.
- Color: official #0151FD and white; navy dark theme with matched image variants; subtle tinted surfaces. WhatsApp uses darker green for white text legibility.
- Imagery: rural family mother/father/daughter at laptop, same campaign girl studying; generated individual raster assets from the selected reference, optimized WebP. Separate mobile hero crop preserves all faces.
- Copy: exact selected main headings and section order. Small wording changed to describe month-to-month service and information clearly without unsupported guarantees; installation remains conditional on review.

## Findings/history
No actionable P0/P1/P2 differences after final comparison. Initial full-page capture showed an unloaded lazy study image outside the viewport; scrolling loaded it, refreshed captures confirm correct placement. No missing asset or product defect remained.
Expected adaptations: independent white header preserves nav contrast instead of placing navigation on the photograph; line icon family matches the existing app; body spacing is tuned for real responsive text. Generated photo poses differ slightly from the mock but retain composition, family, setting and focal points.

## Functional checks
FAQ opens and displays support answer. New Consultar documentos navigates to Legal; brand link returns home. New support WhatsApp button opens message preview modal, which closes correctly. No messages sent. Existing recommender, plan and coverage flows inherited from V4 validation.
Console checked: browser-extension metadata messages only (chrome-extension:// source); no application errors observed.
Build npm run build:demo PASS. Existing test:sites 4/4 PASS. No deployment. Only design/redixc-landing-demos may be committed; main untouched.

## Limits / follow-up
Chrome review with real-width iframes, not physical-device Safari testing. No additional backend or coverage database. Optional P3: tune fine text spacing after local device review.
