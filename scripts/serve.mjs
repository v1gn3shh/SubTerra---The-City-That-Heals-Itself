import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
};

export function createServer(directory = path.join(projectRoot, 'public')) {
  const root = path.resolve(directory);
  return http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some((p) => p.startsWith('.'))) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(root + path.sep)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const stat = await fs.stat(file);
      if (!stat.isFile()) {
        response.writeHead(404).end('Not found');
        return;
      }
      const body = await fs.readFile(file);
      response.writeHead(200, {
        'Content-Type': types[path.extname(file)] ?? 'application/octet-stream',
        'Content-Length': body.length,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : error instanceof URIError ? 400 : 500);
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Unable to serve this request');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = path.resolve(projectRoot, process.argv[2] ?? 'public');
  const port = Number(process.env.PORT ?? 4173);
  const host = process.env.HOST ?? '127.0.0.1';
  const server = createServer(directory);
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log(`UnderGrid: http://${host}:${port}/#twin\nServing ${directory}`));
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
