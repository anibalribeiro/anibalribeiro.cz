import { describe, expect, it } from 'vitest';
import { origin, site } from './site';

describe('site data', () => {
  it('uses the canonical origin without www', () => {
    expect(origin).toBe('https://anibalribeiro.cz');
  });

  it('identifies Aníbal as an engineering manager', () => {
    expect(site.name).toBe('Aníbal Ribeiro');
    expect(site.jobTitle).toBe('Software Engineering Manager');
    expect(site.email).toBe('email@anibalribeiro.cz');
    expect(site.cvAvailable).toBe(false);
    expect(site.photoAlt).toBe('Portrait of Aníbal Ribeiro');
  });

  it('includes the agreed bio mentioning both projects', () => {
    expect(site.bio).toContain('software engineering manager');
    expect(site.bio).toContain('Translate Pro for Brave');
    expect(site.bio).toContain('WinMice');
  });

  it('exposes SEO title and description', () => {
    expect(site.seo.title).toBe('Aníbal Ribeiro — Software Engineering Manager');
    expect(site.seo.description).toBe(
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.',
    );
  });

  it('lists GitHub and LinkedIn', () => {
    expect(site.socials.github).toBe('https://github.com/anibalribeiro');
    expect(site.socials.linkedin).toBe('https://www.linkedin.com/in/anibal-ribeiro/');
  });

  it('defines Translate Pro and WinMice with the agreed links', () => {
    expect(site.projects).toHaveLength(2);

    const translate = site.projects[0];
    expect(translate.title).toBe('Translate Pro for Brave');
    expect(translate.tags).toEqual(['Extension', 'Brave']);
    expect(translate.description).toBe(
      'Faster, customizable in-page translation for Brave.',
    );
    expect(translate.primary).toEqual({
      label: 'Chrome Web Store',
      href: 'https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb',
    });
    expect(translate.secondary).toBeUndefined();

    const winmice = site.projects[1];
    expect(winmice.title).toBe('WinMice');
    expect(winmice.tags).toEqual(['macOS', 'Swift']);
    expect(winmice.description).toBe(
      'Windows-style mouse scrolling and side buttons on Mac.',
    );
    expect(winmice.primary).toEqual({
      label: 'GitHub',
      href: 'https://github.com/anibalribeiro/WinMice',
    });
    expect(winmice.secondary).toEqual({
      label: 'Product site',
      href: 'https://anibalribeiro.github.io/WinMice/',
    });
  });
});
