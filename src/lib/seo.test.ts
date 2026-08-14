import { describe, expect, it } from 'vitest';
import { canonicalUrl, jsonLdGraph } from './seo';

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
});
