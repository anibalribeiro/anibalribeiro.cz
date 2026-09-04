import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const css = readFileSync(path.join(root, 'src/styles/product.css'), 'utf8');

describe('WinMice product hero layout', () => {
  it('aligns the icon and badge on one flex row', () => {
    const brand = css.match(/\.product-brand\s*\{([^}]*)\}/s);
    expect(brand?.[1]).toMatch(/display\s*:\s*flex/);
    expect(brand?.[1]).toMatch(/align-items\s*:\s*center/);
  });
});

describe('WinMice screenshot density', () => {
  it('lays the feature grid out in two columns', () => {
    const grid = css.match(/\.feature-grid\s*\{([^}]*)\}/s);
    expect(grid?.[1]).toMatch(/grid-template-columns\s*:\s*1fr 1fr/);
  });

  it('caps screenshot width so a 630px capture renders under half size', () => {
    const img = css.match(/\.feature-grid img\s*\{([^}]*)\}/s);
    expect(img?.[1]).toMatch(/max-width\s*:\s*360px/);
  });

  it('collapses the feature grid to one column on narrow viewports', () => {
    const query = css.match(/@media \(max-width: 700px\)\s*\{([\s\S]*)\}/);
    expect(query?.[1]).toMatch(/\.feature-grid\s*\{[^}]*grid-template-columns\s*:\s*1fr/);
  });
});
