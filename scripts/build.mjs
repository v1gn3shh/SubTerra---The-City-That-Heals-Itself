import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.resolve(root, 'dist');
if (path.dirname(destination) !== path.resolve(root) || path.basename(destination) !== 'dist') {
  throw new Error('Build output must be this project’s dist directory.');
}
await fs.rm(destination, { recursive: true, force: true });
await fs.cp(path.join(root, 'public'), destination, { recursive: true });
await fs.writeFile(path.join(destination, '.nojekyll'), '');
console.log('Built dist/ — upload its contents to any static host.');
