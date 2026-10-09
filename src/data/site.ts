export const origin = 'https://anibalribeiro.cz' as const;

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  icon: 'translate-pro' | 'winmice';
  tags: readonly string[];
  description: string;
  primary: ProjectLink;
  secondary?: ProjectLink;
};

export const site = {
  name: 'Aníbal Ribeiro',
  jobTitle: 'Software Engineering Manager',
  email: 'email@anibalribeiro.cz',
  bio: 'I’m a software engineering manager. Outside work I build small utility apps — the kind of tools I actually want to use. Recent ones: Translate Pro for Brave, a faster in-page translator for the browser, and WinMice, a native macOS menu-bar app that brings Windows-style mouse scrolling and side buttons to Mac.',
  cvAvailable: true,
  photoAlt: 'Portrait of Aníbal Ribeiro',
  socials: {
    github: 'https://github.com/anibalribeiro',
    linkedin: 'https://www.linkedin.com/in/anibal-ribeiro/',
  },
  seo: {
    title: 'Aníbal Ribeiro — Software Engineering Manager',
    description:
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.',
  },
  projects: [
    {
      title: 'Translate Pro for Brave',
      icon: 'translate-pro',
      tags: ['Extension', 'Brave'],
      description: 'Faster, customizable in-page translation for Brave.',
      primary: {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb',
      },
    },
    {
      title: 'WinMice',
      icon: 'winmice',
      tags: ['macOS', 'Swift'],
      description: 'Windows-style mouse scrolling and side buttons on Mac.',
      primary: {
        label: 'GitHub',
        href: 'https://github.com/anibalribeiro/WinMice',
      },
      secondary: {
        label: 'Product site',
        href: '/Winmice/',
      },
    },
  ] satisfies readonly Project[],
};
