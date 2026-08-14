import { origin, site } from '../data/site';

export function canonicalUrl(): string {
  return `${origin}/`;
}

export function jsonLdGraph() {
  return {
    '@context': 'https://schema.org' as const,
    '@graph': [
      {
        '@type': 'WebSite',
        name: site.name,
        url: canonicalUrl(),
      },
      {
        '@type': 'Person',
        name: site.name,
        jobTitle: site.jobTitle,
        url: canonicalUrl(),
        email: `mailto:${site.email}`,
        image: `${origin}/photo.jpg`,
        sameAs: [site.socials.github, site.socials.linkedin],
      },
    ],
  };
}
