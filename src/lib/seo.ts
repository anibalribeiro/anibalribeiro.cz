import { origin, site } from '../data/site';
import { winmice } from '../data/winmice';

export function canonicalUrl(pathname = '/'): string {
  if (pathname === '/') {
    return `${origin}/`;
  }
  const trimmed = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutSlash = trimmed.replace(/\/+$/, '');
  return `${origin}${withoutSlash}/`;
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

export function winmiceJsonLd() {
  const url = canonicalUrl('/Winmice');
  return {
    '@context': 'https://schema.org' as const,
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: winmice.name,
        url,
        image: `${origin}/winmice-icon.png`,
        screenshot: `${origin}/winmice-og.jpg`,
        description: winmice.seo.description,
        operatingSystem: 'macOS',
        applicationCategory: 'UtilitiesApplication',
        featureList: [
          'Windows-style middle-click vector scrolling (autoscroll)',
          'Configurable back and forward mouse side buttons',
        ],
        downloadUrl: winmice.downloadUrl,
        softwareRequirements: 'macOS, Accessibility permission',
        author: {
          '@type': 'Person',
          name: site.name,
          url: canonicalUrl(),
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: winmice.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: canonicalUrl(),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'WinMice',
            item: url,
          },
        ],
      },
    ],
  };
}
