# Verification

Verified locally on 20 October 2026 in the Codex Chromium browser on Windows,
using the production `dist/` output served over HTTP.

## Automated checks

- `npm run check`: passed for 10 JavaScript files.
- `npm test`: 13 passed, 0 failed.
- `npm run build`: passed.

The tests cover:

1. Normal-state explanations.
2. Cost explanations in English and Arabic.
3. Crew explanations before and after dispatch.
4. No invented completed hospital-protection action.
5. No approval or mutation through the answer engine.
6. Latest-event explanations.
7. Arabic responses.
8. HTML and JavaScript HTTP responses and MIME types.
9. All 22 captured assets and the local answer module.
10. All five homepage images and the relative font URLs.
11. Removal of original analytics, private API calls, and absolute asset paths.
12. Missing-file, unsupported-method, and dotfile handling.
13. HTTP HEAD behavior.

The first sandboxed HTTP test attempt was blocked by the environment's loopback
restriction. The complete suite passed with loopback access enabled, including a
final run after the viewport fix.

## Browser walkthrough

| Flow | Observed result |
| --- | --- |
| Homepage | Headings, navigation, dropdown, and all five images loaded |
| City startup | Map introduction transitions into the rendered 3D city |
| Camera presets | City, Sector, Underground, Failure, and Impact all selected correctly |
| Layers | Water hidden/restored and emphasized; Show all resets emphasis |
| X-ray / Exploded | Both toggle and visibly change the scene |
| Play / Skip / Pause / Reset | Scenario progresses, skips to the incident, pauses, and resets |
| Forecast | +48H changes the scene to the burst forecast; Back to now restores present readings |
| Default limits scenario | Completed all 15 steps; showed “Fixed before it broke,” 12,400 residents, and AED 5.94M saved |
| Ask me scenario | Stopped at all three decisions; selected repair, one-lane closure, and hospital notification; completed with choices marked “you” |
| Spend limit | AED 400K pauses the AED 660K repair and explicitly requests approval |
| Full auto | Switching from the budget gate to Full auto resolves the pending choice and resumes the timeline |
| Outcome comparison | Opens the no-intervention and guided-intervention comparison |
| English question | “Why Crew 07?” reports the recorded crew decision and alternatives |
| Arabic question | “كم تكلفة الإصلاح؟” reports AED 660K, AED 6.6M, and AED 5.94M in an Arabic explanation |
| Responsive layout | Checked desktop, the app's intermediate viewport, and 390 × 844 mobile layout |
| Mobile navigation | Menu opens/closes; homepage opens the twin; sensor and agent drawers respond |
| Mobile overflow | Document width and scroll width both measured 390 px |
| Console | No browser errors observed during the walkthrough |

Screenshots are in [`screenshots/`](screenshots/).

## Issue fixed during verification

The captured application's fixed `.app` used `overflow: hidden`, which still
allows programmatic scrolling. Focusing controls low in a panel could shift the
whole scene upward and clip the header. The replica uses `overflow: clip` on the
outer scene while preserving panel scrolling. After focusing and submitting the
lower question box, the scene remained at top 0 with scrollTop 0 and computed
overflow `clip`.

## Limits

- This is a test of the simulated experience, not a validation of real municipal
  services, engineering models, predicted costs, or operational safety.
- The original Qwen backend is unavailable in this export. The local deterministic
  answer engine is tested; open-ended LLM conversation is not included.
- The original deployed frontend is preserved as production bundles. The original
  component source, dependency lockfile, and backend cannot be recovered from the
  supplied page.
- Chromium desktop and an emulated mobile viewport were checked. Physical iOS/
  Android devices and Safari/Firefox were not tested.
- Three.js emits inherited deprecation/shader warnings on this graphics driver
  (`Clock`, shadow-map fallback, and shader precision). Rendering and interaction
  continued successfully.
- Tests exercised representative interactions and both automatic and manually
  approved completion paths, not every possible sequence of clicks.
- No public hosting deployment is part of this GitHub export.
