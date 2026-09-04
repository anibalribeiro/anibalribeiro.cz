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

describe('WinMice screenshot legibility', () => {
  // The Settings window is 640pt wide. Rendering it at that width keeps its UI
  // text at the size macOS drew it, while the 2x source keeps it sharp.
  it('renders a screenshot at the 640pt width of the window it shows', () => {
    const img = css.match(/\.feature-grid img\s*\{([^}]*)\}/s);
    expect(img?.[1]).toMatch(/max-width\s*:\s*640px/);
  });

  it('stacks the feature grid so screenshots have room for native width', () => {
    const grid = css.match(/\.feature-grid\s*\{([^}]*)\}/s);
    expect(grid?.[1]).not.toMatch(/1fr 1fr/);
  });
});
