# REDIXC · Responsive design QA · 2026-10-16

final result: passed

## Visual truth and intentional changes
Source: approved fusion generated_images/exec-ef0781e9-449d-45b3-8911-ee282c82fdaf.png and user mobile screenshot upload/image(3).png. Latest user instructions supersede the framed mock: no outer radius/top strip; positive hero gap; icon themes after WhatsApp; centered mobile copy; family imagery in rural communities.
Comparisons inspected together: qa/desktop-comparison.png and qa/mobile-comparison.png. Reference mobile is 550 px wide, normalized to 390 px; implementation cropped from the 390 px iframe. Different content height is intentional because mobile typography and alignment changed. Desktop board and real full-page render normalized to 650 px width; this is a structural comparison, not a pixel-identical claim.

## Browser evidence
Cloud Chrome at terminal.local:4173. All six routes inspected in light and dark using real iframe viewports 390, 768, 1366 px. Classic scrollbars leave content widths 375, 753, and 1351/1366 px. Gallery tablet/desktop previews scaled only for inspection; CSS viewport widths remain real.
Additional home checks at 320 and 1024 px (content 305 and 1009). No horizontal document overflow or header controls beyond viewport. All final hero images loaded.
Screenshots: /workspace/scratch/redixc-v4-desktop-light.png, redixc-v4-desktop-dark.png, redixc-v4-inicio-light.png, redixc-v4-inicio-dark.png, redixc-v4-planes-light.png, redixc-v4-planes-dark.png, redixc-v4-cobertura-light.png, redixc-v4-nosotros-light.png, redixc-v4-ayuda-light.png, redixc-v4-legal-light.png, redixc-v4-legal-dark.png, redixc-v4-narrow.png. Evidence images remain in this review environment, not in the source checkout.

## Findings and iteration history
- P2: framed app left an upper strip and ambiguous outer corner. Fixed width:100%, margin:0, radius:0. Final desktop screenshot confirms continuous canvas.
- P2: recommender overlapped hero. Replaced negative margin with 32 px desktop / 24 px mobile gap; DOM geometry confirmed both.
- P2: theme selector dominated navigation. Moved after WhatsApp, reduced to accessible icon buttons. Mobile menu and theme controls remain visible at 320 px.
- P2: dark short pages exposed white below content. Root background now follows --bg; coverage/legal screenshots confirm correction.
- P2: 320 px crop cut a parent out of family photo. Picture source now uses an alternate crop of the same family for mobile, without transform scaling. Re-captured narrow screenshot confirms all three faces visible.
- User rejected office imagery before handoff. Replaced all five secondary hero photos with rural family scenes; preserved main approved family hero and original text.

## Required fidelity surfaces
Typography: supplied Cerebri bold for display, Arial body; headings wrap without truncation. Body text stays readable in actual mobile frame.
Spacing: continuous canvas, explicit hero gap, responsive single-column mobile heroes and full-width controls; footer retains responsive columns.
Colors: official #0151FD, white, navy backgrounds, theme-aware muted text and original SVG logos.
Images: consistent warm natural light, contemporary rural family homes, no corporate staff imagery. WebP assets and meaningful alt text. Main mobile alternative uses same family.
Copy: existing page hero text preserved; no invented testimonials, coverage guarantees or network figures.

## Interactions and checks
Mobile menu opens and closes. Theme light/dark switches. Empty recommender shows validation; activity selection yields a plan. Coverage locality prepares correct modal/message; dialog closes. FAQ expands. Five legal document links rendered. No external message sent.
Console inspected: only browser-extension metadata errors with chrome-extension:// source; no application console errors observed in final review.
Clean npm ci in repository demo, npm run build:demo PASS, existing test:sites 4/4 PASS. No deployment or main modification.

## Limits
Chrome emulation via real-width iframes; not physical iOS/Safari testing. Coverage and contact are demonstration flows; plan facts require provider confirmation. Optional polish: tune fine typography after user review on their own device.
