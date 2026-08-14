import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const css = readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');

describe('sticky header scroll offset', () => {
  it('sets scroll-padding-top on html so in-page jumps clear the sticky header', () => {
    expect(css).toMatch(/html\s*\{[^}]*scroll-padding-top\s*:/s);
  });
});

describe('CV download control styles', () => {
  it('styles enabled a.download differently from button.download[disabled]', () => {
    const enabledLink = css.match(/a\.download\s*\{([^}]*)\}/s);
    const disabledButton = css.match(
      /(?:button\.download\[disabled\]|\.download\[disabled\])\s*\{([^}]*)\}/s,
    );

    expect(enabledLink?.[1]).toBeTruthy();
    expect(disabledButton?.[1]).toBeTruthy();

    const enabledBlock = enabledLink![1];
    const disabledBlock = disabledButton![1];

    expect(enabledBlock).toMatch(/background\s*:/);
    expect(enabledBlock).toMatch(/cursor\s*:\s*pointer/);
    expect(disabledBlock).toMatch(/cursor\s*:\s*not-allowed/);

    // Enabled link must not share the muted/line disabled look as its only colors
    expect(enabledBlock).not.toMatch(/background\s*:\s*var\(--line\)/);
    expect(enabledBlock).toMatch(/background\s*:\s*var\(--accent\)/);
  });
});
