export const fenixRunner = {
  name: 'Fenix Runner',
  tagline: 'Your data, where you look first',
  seo: {
    title: 'Fenix Runner — a customizable watch face for Garmin (Connect IQ)',
    description:
      'Fenix Runner is a bold, glanceable watch face for Garmin watches: 3 time styles (digital, analog, hybrid), configurable data slots and arc gauges, an on-watch editor and a battery-friendly always-on mode. Try it free for 48 hours, then unlock it once for $3.00.',
  },
  lede:
    'A bold, glanceable watch face for Garmin watches — a fiery accent, your data where you look first, and everything configurable on the watch itself. Try it free, then unlock it once.',
  supportUrl: 'mailto:email@anibalribeiro.cz',
  // Trial builds are unlocked through the licence Worker, which creates a
  // device-bound creem checkout. The site only ever forwards a device code to it.
  unlock: {
    price: '$3.00',
    trial: '48 hours',
    workerOrigin: 'https://er.anibalcatheringer.workers.dev',
    buyPath: '/FenixRunner/buy/',
  },
  // Set to the Connect IQ Store URL once the trial listing is live; the page
  // shows the store button only when this is a string.
  storeUrl: null as string | null,
  legal: {
    effectiveDate: '2026-10-23',
    effectiveLabel: '23 October 2026',
  },
  faqs: [
    {
      question: 'What is Fenix Runner?',
      answer:
        'Fenix Runner is a watch face for Garmin watches, built with the Connect IQ SDK. It puts the time, date, battery, weather, altitude and step data where you look first, with an accent colour you can restyle.',
    },
    {
      question: 'How does the trial work?',
      answer:
        'Install it and use it fully for 48 hours. After that the face locks and shows a QR code and a Device Code. Scan the QR code, or enter the code on the unlock page, pay $3.00 once, and the watch unlocks by itself within about 5 minutes.',
    },
    {
      question: 'Do I need to pay again after an update or reinstall?',
      answer:
        'No. The unlock is tied to your watch through its Device Code and is checked on the watch, so it survives updates and reinstalls on the same watch. A different watch needs its own unlock.',
    },
    {
      question: 'Can I customize it without my phone?',
      answer:
        'Yes. The on-watch editor changes the time style, data slots, gauge style, background and colours directly on the watch. The phone app offers the same controls on a larger screen.',
    },
    {
      question: 'Will it drain the battery?',
      answer:
        'It is built not to. Data refreshes on a slow cadence and the always-on view stays dim, so battery life stays close to a stock face.',
    },
    {
      question: 'What data does it collect?',
      answer:
        'The face reads data from your watch and keeps it there. The unlock service only sees a Device Code derived from a one-way hash. See the privacy policy for the details.',
    },
  ],
} as const;
