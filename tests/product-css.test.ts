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
  it('renders an expanded screenshot at the 640pt width of the window it shows', () => {
    const img = css.match(/\.feature-grid img\s*\{([^}]*)\}/s);
    expect(img?.[1]).toMatch(/max-width\s*:\s*640px/);
  });

  it('shows the collapsed screenshot as a 280px thumbnail', () => {
    // Must outrank `.feature-grid img`, hence the three-part selector.
    const thumb = css.match(/\.feature-grid summary img\s*\{([^}]*)\}/s);
    expect(thumb?.[1]).toMatch(/max-width\s*:\s*280px/);
  });
});

describe('WinMice screenshot gallery layout', () => {
  it('pairs the thumbnails two to a row', () => {
    const grid = css.match(/\.feature-grid\s*\{([^}]*)\}/s);
    expect(grid?.[1]).toMatch(/grid-template-columns\s*:\s*1fr 1fr/);
  });

  it('widens a card to the whole row once its screenshot is expanded', () => {
    // A 640px image cannot fit a 386px column, so the open card takes the row.
    expect(css).toMatch(/:has\(details\[open\]\)[^{]*\{[^}]*grid-column\s*:\s*1\s*\/\s*-1/);
  });

  it('shows exactly one of the two summary hints per open state', () => {
    expect(css).toMatch(/\.hint-collapse\s*\{[^}]*display\s*:\s*none/);
    expect(css).toMatch(/\.shot\[open\][^{]*\.hint-expand\s*\{[^}]*display\s*:\s*none/);
    expect(css).toMatch(/\.shot\[open\][^{]*\.hint-collapse\s*\{[^}]*display\s*:\s*(inline|block)/);
  });

  it('drops to a single column on narrow viewports', () => {
    const query = css.match(/@media \(max-width: 700px\)\s*\{([\s\S]*)\}/);
    expect(query?.[1]).toMatch(/grid-template-columns\s*:\s*1fr/);
  });
});
