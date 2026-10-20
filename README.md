# UnderGrid replica

A standalone copy of the interactive UnderGrid Abu Dhabi city demo, captured from
[undergrid.kanbanstudios.ae](https://undergrid.kanbanstudios.ae/#twin) on 20 October 2026.

It includes the landing page, real-map 3D city, five underground utility networks,
sensor simulation, camera presets, X-ray and exploded views, failure prediction,
agent decision timeline, approval modes, repair crews, and outcome summaries.

**Live website:** https://v1gn3shh.github.io/undergrid-replica/

**Interactive twin:** https://v1gn3shh.github.io/undergrid-replica/#twin

## Run

Install **Node.js 20 or newer**, then:

```sh
npm start
```

Open **http://127.0.0.1:4173/#twin**. The homepage is at `/`; `/#demo` starts the
guided scenario. No dependency installation, API key, or account is needed.
Use a modern browser with WebGL and hardware acceleration for the 3D scene.

```sh
npm run check     # JavaScript syntax checks
npm test          # Answer-engine and HTTP/asset integration tests
npm run build    # Produce the deployable dist directory
npm run preview  # Serve dist at http://127.0.0.1:4173
```

`PORT` changes the server port. `HOST` defaults to `127.0.0.1`; set it to `0.0.0.0`
only when you intend to make the development server accessible on your network.

## Use the demo

- Click **Play the demo** for the complete sequence or **Skip to the problem** to
  jump to the water-pipe incident.
- Use **Layers** to hide or emphasize electricity, telecom, water, district cooling,
  and sewage.
- Toggle **X-ray** or **Exploded** to inspect infrastructure below the streets.
- Try the five camera presets: City, Sector, Underground, Failure, and Impact.
- After prediction, **+48H** previews the consequences of inaction.
- Choose **Full auto**, **With limits**, or **Ask me**. In the latter two modes,
  respond to pending decisions in the agents panel to continue.
- Ask a question about cost, the crew, the road, the plan, or nearby facilities.
  Answers use the current simulation facts. They cannot approve actions.

Keyboard shortcuts retained from the reference: `0` resets the view; `1`–`5`
select cameras; `L` opens layers; `X` toggles X-ray; `E` toggles exploded view;
`F` toggles the future preview when available; `Space` pauses/resumes; `R` resets
the demo. Controls are also available through buttons.

## What was replicated

The public website serves production JavaScript bundles. **This repository
preserves those deployed bundles; it is not the original authoring repository.**
The original React/TypeScript components, source maps, backend source, and build
configuration were not available from the provided website.

The exported application is functional and self-contained. The application
bundles still contain their bundled libraries and embedded map geometry.
`npm run build` packages the files; it does not recompile the original React app.

Changes made for portability:

- Downloaded all five landing screenshots and eleven external font files.
- Made application image paths and font URLs relative for static subdirectory hosting.
- Removed host-specific Cloudflare analytics and injected challenge scripts.
- Replaced the private `/api/ask` request with a readable, local answer engine.
- Updated question-box labels and homepage text to describe the local engine.
- Replaced an unused starter-template image URL with a local screenshot.
- Fixed viewport shifting when focusing controls near the bottom of the city UI.
- Added a dependency-free server, tests, build command, and GitHub Actions checks.

## Questions and simulated data

The original site's private Qwen backend is **not included**. The replica uses a
deterministic, offline answer engine in [`public/replica/answers.js`](public/replica/answers.js).
It recognizes English and Arabic questions about supported simulation topics.
Arabic explanations may quote the underlying English event records verbatim.
It does not provide open-ended LLM conversation.

The streets and buildings are based on map data; utility networks, readings,
failures, costs, crews, and decisions are demonstration data. No live city
systems, real dispatch service, or external AI agent is connected.

## Files

| Path | Purpose |
| --- | --- |
| `public/index.html` | Clean page shell |
| `public/assets/` | Captured production JavaScript, styles, and fonts |
| `public/landing/` | Local screenshots used on the homepage |
| `public/replica/answers.js` | Editable local question-answering behavior |
| `public/replica/overrides.css` | Viewport containment and bidirectional answer text |
| `scripts/serve.mjs` | Development and preview server |
| `scripts/build.mjs` | Static output packaging |
| `test/` | Automated tests |
| `docs/source-manifest.json` | Original asset URLs, sizes, and SHA-256 hashes |
| `docs/VERIFICATION.md` | Verification evidence and limits |
| `THIRD_PARTY_NOTICES.md` | Attribution and provenance |

## Deploy

Run `npm run build` and upload the **contents of `dist/`** to a static web host.
Both root hosting and a path such as `/undergrid-replica/` are supported through
relative assets and hash routes. Serve over HTTP(S), not by opening the HTML as a
`file://` URL. No server API or SPA rewrite rule is necessary.

GitHub Actions runs the checks and uploads a `undergrid-static-site` build artifact.
Successful pushes to `main` also deploy the `dist/` output to GitHub Pages. Pull
requests run verification without publishing. The repository's Pages source
must be **GitHub Actions**, because the website is built from `public/` into
`dist/`; the repository root is not the website's document root.

## Attribution

The UnderGrid design, content, branding, and captured frontend belong to their
respective owners. Map attribution to OpenStreetMap contributors and Natural
Earth is retained in the interface. This export does not assert ownership of or
grant a new license for the captured materials. See
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
