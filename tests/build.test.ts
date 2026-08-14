import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, parseIndex, readDist } from './helpers/build';

describe('built homepage SEO', () => {
  beforeAll(() => {
    buildSite();
  });

  it('sets lang, title, description, canonical, and robots', () => {
    const { document } = parseIndex();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.querySelector('title')?.textContent).toBe(
      'Aníbal Ribeiro — Software Engineering Manager',
    );
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.',
    );
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://anibalribeiro.cz/');
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('index, follow');
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
    ).toBe('#f4f6f8');
  });

  it('emits Open Graph and Twitter tags', () => {
    const { document } = parseIndex();
    const prop = (p: string) =>
      document.querySelector(`meta[property="${p}"]`)?.getAttribute('content');
    const name = (n: string) =>
      document.querySelector(`meta[name="${n}"]`)?.getAttribute('content');

    expect(prop('og:type')).toBe('website');
    expect(prop('og:title')).toBe('Aníbal Ribeiro — Software Engineering Manager');
    expect(prop('og:description'))?.toContain('Translate Pro for Brave');
    expect(prop('og:url')).toBe('https://anibalribeiro.cz/');
    expect(prop('og:image')).toBe('https://anibalribeiro.cz/og.png');
    expect(prop('og:image:width')).toBe('1200');
    expect(prop('og:image:height')).toBe('630');
    expect(prop('og:locale')).toBe('en_US');
    expect(prop('og:site_name')).toBe('Aníbal Ribeiro');
    expect(name('twitter:card')).toBe('summary_large_image');
    expect(name('twitter:title')).toBe(
      'Aníbal Ribeiro — Software Engineering Manager',
    );
    expect(name('twitter:description'))?.toContain('WinMice');
    expect(name('twitter:image')).toBe('https://anibalribeiro.cz/og.png');
  });

  it('embeds Person JSON-LD with GitHub and LinkedIn sameAs', () => {
    const { document } = parseIndex();
    const raw = document.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);
    const person = data['@graph'].find(
      (node: { '@type': string }) => node['@type'] === 'Person',
    );
    expect(person.sameAs).toEqual([
      'https://github.com/anibalribeiro',
      'https://www.linkedin.com/in/anibal-ribeiro/',
    ]);
  });

  it('has a skip link targeting main and a single h1', () => {
    const { document } = parseIndex();
    const skip = document.querySelector('a[href="#main"]');
    expect(skip?.textContent?.toLowerCase()).toContain('skip');
    expect(document.querySelector('#main')).toBeTruthy();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('h1')?.textContent).toBe('Aníbal Ribeiro');
  });
});

describe('crawl files', () => {
  it('ships robots.txt that allows indexing and points at the sitemap', () => {
    const robots = readDist('robots.txt');
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toContain('Sitemap: https://anibalribeiro.cz/sitemap-index.xml');
  });

  it('includes the homepage in the generated sitemap', () => {
    const indexXml = readDist('sitemap-index.xml');
    expect(indexXml).toContain('sitemap');
    const childName =
      indexXml.match(/https:\/\/anibalribeiro\.cz\/(sitemap-0\.xml)/)?.[1] ??
      'sitemap-0.xml';
    const child = readDist(childName);
    const locs = [...child.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(['https://anibalribeiro.cz/']);
  });
});

describe('header', () => {
  it('exposes Work, CV, and Contact jump links', () => {
    const { document } = parseIndex();
    const header = document.querySelector('header');
    expect(header).toBeTruthy();
    expect(header?.querySelector('nav')).toBeTruthy();
    expect(header?.querySelector('a[href="#work"]')?.textContent).toBe('Work');
    expect(header?.querySelector('a[href="#cv"]')?.textContent).toBe('CV');
    expect(header?.querySelector('a[href="#contact"]')?.textContent).toBe(
      'Contact',
    );
    expect(header?.querySelector('a[href="#top"]')?.textContent).toBe('AR');
  });
});

describe('hero', () => {
  it('shows the role as a badge, not a second h1, plus the bio', () => {
    const { document } = parseIndex();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.body.textContent).toContain('Software Engineering Manager');
    expect(document.body.textContent).toContain('small utility apps');
  });

  it('renders the headshot with the agreed alt text', () => {
    const { document } = parseIndex();
    const img = document.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Portrait of Aníbal Ribeiro');
    expect(img?.getAttribute('width')).toBeTruthy();
    expect(img?.getAttribute('height')).toBeTruthy();
  });

  it('preloads the hero image', () => {
    const { document } = parseIndex();
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    expect(preload).toBeTruthy();
    expect(preload?.getAttribute('href')).toBeTruthy();
  });
});

describe('work', () => {
  it('renders both projects as h3s under #work', () => {
    const { document } = parseIndex();
    const work = document.querySelector('#work');
    expect(work).toBeTruthy();
    expect(work?.querySelector('h2')?.textContent).toBe('Work');
    const titles = [...work!.querySelectorAll('h3')].map((el) => el.textContent);
    expect(titles).toEqual(['Translate Pro for Brave', 'WinMice']);
  });

  it('uses named external links with noopener', () => {
    const { document } = parseIndex();
    const store = document.querySelector(
      'a[href="https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb"]',
    );
    expect(store?.textContent).toBe('Chrome Web Store');
    expect(store?.getAttribute('target')).toBe('_blank');
    expect(store?.getAttribute('rel')).toContain('noopener');

    const github = document.querySelector(
      'a[href="https://github.com/anibalribeiro/WinMice"]',
    );
    expect(github?.textContent).toBe('GitHub');

    const product = document.querySelector(
      'a[href="https://anibalribeiro.github.io/WinMice/"]',
    );
    expect(product?.textContent).toBe('Product site');
  });
});


