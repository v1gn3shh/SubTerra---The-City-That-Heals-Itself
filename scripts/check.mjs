import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
let checked = 0;
for (const folder of ['public', 'scripts', 'test']) {
  const entries = await fs.readdir(path.join(root, folder), { recursive: true });
  for (const entry of entries.filter((f) => /\.(m?js)$/.test(f))) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, folder, entry)], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status ?? 1);
    checked++;
  }
}
console.log(`Syntax checked ${checked} JavaScript files.`);
