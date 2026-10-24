export const pokeBattle = {
  name: 'Poke Battle',
  description: 'Quick one-on-one battles with the original 151 Pokémon on your Garmin, Zepp OS or Apple Watch. Game Boy sprites, four moves, battle history and a Pokédex, all offline.',
  price: '4.00',
  supportUrl: 'mailto:email@anibalribeiro.cz',
  // `url: null` renders a disabled "coming soon" button. Never use the Fenix Runner Worker.
  stores: [
    { id: 'garmin', icon: 'garmin' as const, platform: 'Garmin', label: 'Garmin Store', url: 'https://apps-developer.garmin.com/apps/2170cdb5-233a-4f64-9ee7-8b17967438c2' as string | null },
    { id: 'zepp', icon: 'zepp' as const, platform: 'Zepp OS', label: 'Zepp OS', url: null as string | null },
    { id: 'apple', icon: 'appstore' as const, platform: 'Apple Watch', label: 'App Store', url: null as string | null },
  ],
  effectiveDate: '2026-10-23',
  effectiveLabel: '23 October 2026',
} as const;
