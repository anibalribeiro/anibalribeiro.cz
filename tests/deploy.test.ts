import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { collectFiles, loadConfig, stalePaths } from '../scripts/deploy.mjs';

describe('loadConfig', () => {
  const full = {
    FTP_HOST: 'ftp.example.com',
    FTP_USER: 'someone',
    FTP_PASS: 'secret',
  };

  it('reads host, user and password from the environment', () => {
    const config = loadConfig(full);
    expect(config.host).toBe('ftp.example.com');
    expect(config.user).toBe('someone');
    expect(config.password).toBe('secret');
  });

  it('defaults the remote directory to public_html', () => {
    expect(loadConfig(full).remoteDir).toBe('public_html');
    expect(loadConfig({ ...full, FTP_DIR: 'www' }).remoteDir).toBe('www');
  });

  it('names every missing variable at once instead of failing one at a time', () => {
    expect(() => loadConfig({})).toThrowError(
      /FTP_HOST[\s\S]*FTP_USER[\s\S]*FTP_PASS/,
    );
  });

  it('never puts the password in the error message', () => {
    try {
      loadConfig({ FTP_PASS: 'secret' });
      expect.unreachable('should have thrown');
    } catch (error) {
      expect((error as Error).message).not.toContain('secret');
    }
  });
});

describe('collectFiles', () => {
  const dir = mkdtempSync(join(tmpdir(), 'deploy-test-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it('walks nested files and reports posix paths with sizes', () => {
    mkdirSync(join(dir, '_astro'), { recursive: true });
    writeFileSync(join(dir, 'index.html'), 'abc');
    writeFileSync(join(dir, '_astro', 'app.css'), 'body{}');
    writeFileSync(join(dir, '.DS_Store'), 'junk');

    const files = collectFiles(dir);
    expect(files.get('index.html')).toBe(3);
    expect(files.get('_astro/app.css')).toBe(6);
    // macOS metadata must not be published.
    expect(files.has('.DS_Store')).toBe(false);
  });
});

describe('stalePaths', () => {
  const local = new Map([
    ['index.html', 1],
    ['_astro/new.css', 1],
  ]);

  it('finds hashed assets that are no longer part of the build', () => {
    const remote = ['_astro/new.css', '_astro/old.css'];
    expect(stalePaths(remote, local, ['_astro'])).toEqual(['_astro/old.css']);
  });

  it('refuses to delete anything outside a build-managed directory', () => {
    const remote = [
      'cgi-bin/script.pl',
      'uploads/invoice.pdf',
      'webmail/config.php',
      '.htpasswd',
      '_astro/old.css',
    ];
    // Only the managed directory may be pruned, whatever else is on the host.
    expect(stalePaths(remote, local, ['_astro'])).toEqual(['_astro/old.css']);
  });

  it('is not fooled by a directory that merely shares a prefix', () => {
    const remote = ['_astrophotography/keep.jpg'];
    expect(stalePaths(remote, local, ['_astro'])).toEqual([]);
  });
});
