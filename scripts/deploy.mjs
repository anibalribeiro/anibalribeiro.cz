#!/usr/bin/env node
/**
 * Publish `dist/` to the web host over FTPS.
 *
 * Credentials come from the environment, or from a local `.env` file that is
 * never committed:
 *
 *   FTP_HOST=ftp.example.com
 *   FTP_USER=user
 *   FTP_PASS=password
 *   FTP_DIR=public_html   # optional
 *
 * Usage: npm run deploy
 */
import { Client } from 'basic-ftp';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');

/**
 * Directories whose contents are produced entirely by the build, so anything
 * there that is not in `dist/` is a leftover and safe to delete. Shared hosting
 * keeps unrelated files next to the site, so pruning is deliberately confined
 * to this list.
 */
const PRUNABLE = ['_astro', 'Winmice'];

const IGNORED = new Set(['.DS_Store']);

/** Read `.env` into a plain object. Missing file is not an error. */
export function readEnvFile(path) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return {};
  }
  const out = {};
  for (const line of raw.split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
    if (!match) continue;
    out[match[1]] = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

export function loadConfig(env) {
  const missing = ['FTP_HOST', 'FTP_USER', 'FTP_PASS'].filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing credentials: ${missing.join(', ')}\n` +
        'Set them in the environment or in a .env file at the repo root. ' +
        'See .env.example.',
    );
  }
  return {
    host: env.FTP_HOST,
    user: env.FTP_USER,
    password: env.FTP_PASS,
    remoteDir: env.FTP_DIR || 'public_html',
  };
}

/** Map of posix-relative path to byte size for every publishable file. */
export function collectFiles(dir, base = dir, out = new Map()) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, base, out);
    } else if (entry.isFile()) {
      const rel = full.slice(base.length + 1).split(/[\\/]/).join('/');
      out.set(rel, statSync(full).size);
    }
  }
  return out;
}

/** Remote files inside `prunable` directories that the build no longer emits. */
export function stalePaths(remoteFiles, localFiles, prunable = PRUNABLE) {
  return remoteFiles.filter(
    (path) =>
      prunable.some((dir) => path.startsWith(`${dir}/`)) &&
      !localFiles.has(path),
  );
}

async function listRecursive(client, dir) {
  const found = [];
  let entries;
  try {
    entries = await client.list(dir);
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.name === '.' || entry.name === '..') continue;
    const child = `${dir}/${entry.name}`;
    if (entry.isDirectory) {
      found.push(...(await listRecursive(client, child)));
    } else if (entry.isFile) {
      found.push(child);
    }
  }
  return found;
}

async function main() {
  const config = loadConfig({
    ...readEnvFile(join(root, '.env')),
    ...process.env,
  });

  const files = collectFiles(DIST);
  if (files.size === 0) {
    throw new Error('dist/ is empty — run `npm run build` first.');
  }
  const totalKb = [...files.values()].reduce((a, b) => a + b, 0) / 1024;
  console.log(`local:    ${files.size} files, ${totalKb.toFixed(0)} KB`);

  const client = new Client(60_000);
  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: true,
    });
    await client.ensureDir(config.remoteDir);
    console.log(`connected: ${await client.pwd()}`);

    // uploadFromDir mirrors the tree and creates directories as needed.
    await client.uploadFromDir(DIST);
    console.log(`uploaded:  ${files.size} files`);

    // A single client runs one task at a time, so these must not be parallel.
    const remote = [];
    for (const dir of PRUNABLE) {
      remote.push(...(await listRecursive(client, dir)));
    }
    const stale = stalePaths(remote, files);
    for (const path of stale) {
      await client.remove(path);
      console.log(`  - pruned ${path}`);
    }
    console.log(`pruned:    ${stale.length} stale file(s)`);

    const mismatches = [];
    for (const [rel, size] of [...files].sort()) {
      const remoteSize = await client.size(rel).catch((e) => `error ${e}`);
      if (remoteSize !== size) mismatches.push([rel, size, remoteSize]);
    }
    if (mismatches.length > 0) {
      for (const [rel, want, got] of mismatches) {
        console.error(`  ! ${rel}: local ${want}, remote ${got}`);
      }
      throw new Error(`${mismatches.length} file(s) did not match after upload`);
    }
    console.log(`verified:  all ${files.size} files match local size`);
  } finally {
    client.close();
  }
}

// Only run when invoked directly, so tests can import the helpers above.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`\n${error.message}`);
    process.exit(1);
  });
}
