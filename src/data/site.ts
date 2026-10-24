export const origin = 'https://anibalribeiro.cz' as const;

export const legal = {
  effectiveDate: '2026-10-23',
  effectiveLabel: '23 October 2026',
} as const;

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  icon:
    | 'translate-pro'
    | 'winmice'
    | 'fenix-runner'
    | 'pokebattle'
    | 'ridge'
    | 'pulse'
    | 'daylight'
    | 'aurora'
    | 'football-live';
  tags: readonly string[];
  description: string;
  primary: ProjectLink;
  secondary?: ProjectLink;
};

export const site = {
  name: 'Aníbal Ribeiro',
  jobTitle: 'Software Engineering Manager',
  email: 'email@anibalribeiro.cz',
  bio: 'I’m a software engineering manager. Outside work I build small utility apps — the kind of tools I actually want to use. Recent ones: Translate Pro for Brave, a faster in-page translator for the browser; WinMice, a native macOS menu-bar app that brings Windows-style mouse scrolling and side buttons to Mac; and Fenix Runner, a customizable watch face for Garmin watches.',
  cvAvailable: true,
  photoAlt: 'Portrait of Aníbal Ribeiro',
  socials: {
    github: 'https://github.com/anibalribeiro',
    linkedin: 'https://www.linkedin.com/in/anibal-ribeiro/',
  },
  seo: {
    title: 'Aníbal Ribeiro — Software Engineering Manager',
    description:
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator; WinMice, a native macOS mouse utility; and Fenix Runner, a customizable watch face for Garmin watches.',
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
    {
      title: 'Football Live',
      icon: 'football-live',
      tags: ['Garmin', 'Watch app'],
      description: 'Live football scores and goal alerts on your wrist.',
      primary: { label: 'Product site', href: '/football-live/' },
      secondary: { label: 'Connect IQ Store', href: 'https://apps.garmin.com/apps/275bac70-c30f-429e-a6ea-cadd9d53d5ee' },
    },
    {
      title: 'Poke Battle',
      icon: 'pokebattle',
      tags: ['Garmin', 'Zepp OS', 'Apple Watch', 'Game'],
      description: 'Quick Pokémon battles on your wrist. All 151 originals, Game Boy sprites and offline play.',
      primary: { label: 'Product site', href: '/pokebattle/' },
      secondary: { label: 'Support', href: '/pokebattle/support/' },
    },
    {
      title: 'Fenix Runner',
      icon: 'fenix-runner',
      tags: ['Garmin', 'Connect IQ'],
      description: 'A customizable watch face for Garmin watches. Free 48-hour trial, then a one-time unlock.',
      primary: {
        label: 'Product site',
        href: '/FenixRunner/',
      },
      secondary: {
        label: 'Unlock',
        href: '/FenixRunner/buy/',
      },
    },
    {
      title: 'Ridge',
      icon: 'ridge',
      tags: ['Garmin', 'Watch face'],
      description: 'Layered mountains under a setting sun, with your day along the ridges.',
      primary: { label: 'Product site', href: '/ridge/' },
      secondary: { label: 'Connect IQ Store', href: 'https://apps.garmin.com/apps/e3617d06-8329-4dbb-936a-9565a0b3d72b' },
    },
    {
      title: 'Pulse',
      icon: 'pulse',
      tags: ['Garmin', 'Watch face'],
      description: 'Your whole day of heart rate in one ring.',
      primary: { label: 'Product site', href: '/pulse/' },
      secondary: { label: 'Connect IQ Store', href: 'https://apps.garmin.com/apps/c8f95bf2-583f-4228-aac2-0c9b3b85c40b' },
    },
    {
      title: 'Daylight',
      icon: 'daylight',
      tags: ['Garmin', 'Watch face'],
      description: 'A sun path across a sky that changes colour through the day.',
      primary: { label: 'Product site', href: '/daylight/' },
      secondary: { label: 'Connect IQ Store', href: 'https://apps.garmin.com/apps/c788e9e3-b158-4cb3-9d17-b444c687e861' },
    },
    {
      title: 'Aurora',
      icon: 'aurora',
      tags: ['Garmin', 'Watch face'],
      description: 'Soft aurora ribbons over a starry sky, with your day underneath.',
      primary: { label: 'Product site', href: '/aurora/' },
      secondary: { label: 'Connect IQ Store', href: 'https://apps.garmin.com/apps/2a9eb91a-6c1e-49bf-87d9-16df3e68afeb' },
    },
  ] satisfies readonly Project[],
};
