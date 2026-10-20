import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../scripts/serve.mjs';

const root = fileURLToPath(new URL('../public/', import.meta.url));
let server, base;
before(async () => {
  server = createServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => new Promise((resolve) => server.close(resolve)));
test('homepage and entry module are served with correct MIME types', async () => {
  const html = await fetch(base);
  assert.equal(html.status, 200);
  assert.match(html.headers.get('content-type'), /text\/html/);
  const content = await html.text();
  const entry = content.match(/<script[^>]+src="([^"]+)"/)[1];
  const js = await fetch(new URL(entry, base + '/'));
  assert.equal(js.status, 200);
  assert.match(js.headers.get('content-type'), /javascript/);
});
test('all captured assets and new local modules are present and served', async () => {
  const manifest = JSON.parse(await fs.readFile(new URL('../docs/source-manifest.json', import.meta.url)));
  for (const asset of [...manifest.assets, { path: 'replica/answers.js' }]) {
    const response = await fetch(`${base}/${asset.path}`);
    assert.equal(response.status, 200, asset.path);
    assert.ok((await response.arrayBuffer()).byteLength > 0, asset.path);
  }
});
test('all application screenshot paths and CSS font URLs resolve locally', async () => {
  const app = await fs.readFile(path.join(root, 'assets/index-BOZmZBNH.js'), 'utf8');
  const css = await fs.readFile(path.join(root, 'assets/index-DdzneKvl.css'), 'utf8');
  const images = [...new Set([...app.matchAll(/\.\/landing\/[\w.-]+/g)].map((m) => m[0]))];
  assert.equal(images.length, 5);
  for (const image of images) assert.equal((await fetch(new URL(image, base + '/'))).status, 200);
  for (const match of css.matchAll(/url\((\.\/[^)]+)\)/g)) {
    assert.equal((await fetch(new URL(match[1], base + '/assets/'))).status, 200, match[1]);
  }
});
test('replica has no original analytics, private API call, or absolute asset paths', async () => {
  const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const app = await fs.readFile(path.join(root, 'assets/index-BOZmZBNH.js'), 'utf8');
  const css = await fs.readFile(path.join(root, 'assets/index-DdzneKvl.css'), 'utf8');
  assert.doesNotMatch(html, /cloudflareinsights|cdn-cgi|data-cf-beacon/);
  assert.doesNotMatch(app, /\/api\/ask|https:\/\/res\.cloudinary/);
  assert.doesNotMatch(app, /`\/landing\//);
  assert.doesNotMatch(css, /url\(\/assets\//);
});
test('missing assets return 404; unsupported methods and dotfiles are rejected', async () => {
  assert.equal((await fetch(`${base}/missing.js`)).status, 404);
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${base}/.git/config`)).status, 403);
  assert.equal((await fetch(`${base}/%5c..%5cpackage.json`)).status, 403);
});
test('HEAD returns asset metadata without a body', async () => {
  const response = await fetch(`${base}/favicon.svg`, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/svg/);
  assert.equal(await response.text(), '');
});
