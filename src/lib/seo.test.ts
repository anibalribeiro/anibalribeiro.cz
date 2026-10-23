import { describe, expect, it } from 'vitest';
import { canonicalUrl, fenixRunnerJsonLd, jsonLdGraph, winmiceJsonLd } from './seo';

describe('seo helpers', () => {
  it('canonicalizes to the apex origin with a trailing slash', () => {
    expect(canonicalUrl()).toBe('https://anibalribeiro.cz/');
  });

  it('builds WebSite and Person JSON-LD with sameAs links', () => {
    const graph = jsonLdGraph();
    expect(graph['@context']).toBe('https://schema.org');

    const website = graph['@graph'].find((node) => node['@type'] === 'WebSite');
    expect(website).toMatchObject({
      name: 'Aníbal Ribeiro',
      url: 'https://anibalribeiro.cz/',
    });

    const person = graph['@graph'].find((node) => node['@type'] === 'Person');
    expect(person).toMatchObject({
      name: 'Aníbal Ribeiro',
      jobTitle: 'Software Engineering Manager',
      url: 'https://anibalribeiro.cz/',
      email: 'mailto:email@anibalribeiro.cz',
      image: 'https://anibalribeiro.cz/photo.jpg',
      sameAs: [
        'https://github.com/anibalribeiro',
        'https://www.linkedin.com/in/anibal-ribeiro/',
      ],
    });
  });

  it('canonicalizes nested product paths with a trailing slash', () => {
    expect(canonicalUrl('/Winmice')).toBe('https://anibalribeiro.cz/Winmice/');
    expect(canonicalUrl('/Winmice/')).toBe('https://anibalribeiro.cz/Winmice/');
    expect(canonicalUrl('/FenixRunner')).toBe('https://anibalribeiro.cz/FenixRunner/');
    expect(canonicalUrl('/FenixRunner/')).toBe('https://anibalribeiro.cz/FenixRunner/');
  });

  it('builds WinMice SoftwareApplication JSON-LD', () => {
    const graph = winmiceJsonLd();
    const app = graph['@graph'].find((node) => node['@type'] === 'SoftwareApplication');
    expect(app).toMatchObject({
      name: 'WinMice',
      operatingSystem: 'macOS',
      url: 'https://anibalribeiro.cz/Winmice/',
    });
  });

  it('builds Fenix Runner SoftwareApplication JSON-LD', () => {
    const graph = fenixRunnerJsonLd();
    const app = graph['@graph'].find((node) => node['@type'] === 'SoftwareApplication');
    expect(app).toMatchObject({
      name: 'Fenix Runner',
      operatingSystem: 'Garmin Connect IQ',
      url: 'https://anibalribeiro.cz/FenixRunner/',
    });
  });
});
