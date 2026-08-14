import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, parseIndex, readDist } from './helpers/build';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

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
