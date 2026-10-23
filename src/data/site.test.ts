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
    expect(site.cvAvailable).toBe(true);
    expect(site.photoAlt).toBe('Portrait of Aníbal Ribeiro');
  });

  it('includes the agreed bio mentioning the side projects', () => {
    expect(site.bio).toContain('software engineering manager');
    expect(site.bio).toContain('Translate Pro for Brave');
    expect(site.bio).toContain('WinMice');
    expect(site.bio).toContain('Fenix Runner');
  });

  it('exposes SEO title and description', () => {
    expect(site.seo.title).toBe('Aníbal Ribeiro — Software Engineering Manager');
    expect(site.seo.description).toBe(
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator; WinMice, a native macOS mouse utility; and Fenix Runner, a customizable watch face for Garmin watches.',
    );
  });

  it('lists GitHub and LinkedIn', () => {
    expect(site.socials.github).toBe('https://github.com/anibalribeiro');
    expect(site.socials.linkedin).toBe('https://www.linkedin.com/in/anibal-ribeiro/');
  });

  it('defines the four projects with their product links', () => {
    expect(site.projects).toHaveLength(4);

    const translate = site.projects[0];
    expect(translate.title).toBe('Translate Pro for Brave');
    expect(translate.icon).toBe('translate-pro');
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
    expect(winmice.icon).toBe('winmice');
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
      href: '/Winmice/',
    });

    const fenixRunner = site.projects[2];
    expect(fenixRunner.title).toBe('Fenix Runner');
    expect(fenixRunner.icon).toBe('fenix-runner');
    expect(fenixRunner.tags).toEqual(['Garmin', 'Connect IQ']);
    expect(fenixRunner.description).toBe(
      'A customizable watch face for Garmin watches. Free 48-hour trial, then a one-time unlock.',
    );
    expect(fenixRunner.primary).toEqual({
      label: 'Product site',
      href: '/FenixRunner/',
    });
    expect(fenixRunner.secondary).toEqual({
      label: 'Unlock',
      href: '/FenixRunner/buy/',
    });
  });
});
