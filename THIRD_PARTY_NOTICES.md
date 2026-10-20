# Attribution and provenance

This repository was prepared as a user-requested standalone replica of
https://undergrid.kanbanstudios.ae/#twin on 2026-10-20.

## Captured application

The UnderGrid application, design, branding, text, city geometry, screenshots,
and production frontend bundles were retrieved from the public website.
The export does not grant a license or claim ownership of those materials.
No license for the original application was supplied with the public page.

The unmodified download hashes are recorded in `docs/source-manifest.json`.
The entry JavaScript and CSS were subsequently patched for local paths and the
local answer engine as described in the README. Those two files therefore
intentionally differ from their original hashes.

## Map data

- © OpenStreetMap contributors: https://www.openstreetmap.org/copyright
- Natural Earth: https://www.naturalearthdata.com/about/terms-of-use/

The reference application's attribution remains visible in the replica.

## Bundled third-party software and fonts

The deployed bundles include code from React, Three.js, React Three Fiber,
React Three Drei, Redux/Redux Toolkit, and other frontend dependencies. Existing
notices in the captured files are preserved. The capture did not include the
original dependency lockfile, so this is not a complete package inventory.

Local font assets retain their original filenames: Geist, Instrument Sans,
and Fragment Mono. Their respective owners' licensing terms continue to apply.

No private backend, access credential, Cloudflare analytics identifier, or live
city service is part of the export.
