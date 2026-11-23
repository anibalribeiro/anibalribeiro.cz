export const miniGolf = {
  name: 'MiniGolf Pro',
  description:
    'Eight themed nine-hole mini golf courses on your Garmin or Amazfit watch. Drag back and release to putt, or use the buttons, bank shots around hazards and try to beat par.',
  price: '2.99',
  garminStoreUrl: 'https://apps.garmin.com/apps/fe9be422-47a8-4e22-b877-29f502741bc5',
  garminPrice: '2.99',
  // The licence Worker creates a fresh Creem checkout for the live product on each visit.
  checkoutUrl: 'https://minigolf-pro-zepp.anibalcatheringer.workers.dev/buy',
  supportUrl: 'https://minigolf-pro-zepp.anibalcatheringer.workers.dev/support',
  privacyUrl: 'https://minigolf-pro-zepp.anibalcatheringer.workers.dev/privacy',
} as const;
