import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

let built = false;

export function buildSite(): void {
  if (built) return;
  execSync('npx astro build', { cwd: root, stdio: 'pipe' });
  built = true;
}

export function readDist(rel: string): string {
  buildSite();
  return readFileSync(path.join(root, 'dist', rel), 'utf8');
}

export function parseIndex() {
  const html = readDist('index.html');
  const { document } = parseHTML(html);
  return { html, document };
}
