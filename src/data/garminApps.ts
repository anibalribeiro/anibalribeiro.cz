export type GarminAppShot = {
  file: string;
  title: string;
  alt: string;
};

export type GarminAppSection = {
  heading: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type GarminApp = {
  slug: string;
  name: string;
  kind: 'Garmin watch face' | 'Garmin watch app';
  category: string;
  tagline: string;
  description: string;
  storeId: string;
  price: string;
  features: readonly string[];
  shotsHeading: string;
  shotsLede: string;
  shots: readonly GarminAppShot[];
  heroAlt: string;
  sections: readonly GarminAppSection[];
  refundNote?: string;
  privacyNote: string;
};

export const garminStoreUrl = (storeId: string) => `https://apps.garmin.com/apps/${storeId}`;

const refund = 'Purchases can be refunded within 48 hours under the Connect IQ Store’s return policy.';

export const garminApps: readonly GarminApp[] = [
  {
    slug: 'ridge',
    name: 'Ridge',
    kind: 'Garmin watch face',
    category: 'LifestyleApplication',
    tagline: 'Layered mountains under a setting sun, with your day along the ridges.',
    description:
      'Layered mountains under a setting sun and a starry sky, with a large time that fades from white to sunset. The weather, your day and your progress sit along the ridges, arranged from your phone.',
    storeId: 'e3617d06-8329-4dbb-936a-9565a0b3d72b',
    price: '2.99',
    features: [
      '3 themes: Dusk, Glacier and Canyon, plus an accent colour for the bezel gauges',
      'Weather with the day’s high and low, humidity and the next sunset',
      'Data row, 2 bezel gauges and a bottom line: pick from 17 metrics, including Body Battery, stress, sleep score, VO2 max and recovery time',
      'Seconds while the watch is awake',
      'Date and labels in 36 languages',
      'Always-on display mode with an optional metric',
    ],
    shotsHeading: 'Three themes, your numbers',
    shotsLede: 'Dusk, Glacier and Canyon, with the data row, bezel gauges and bottom line set from your phone.',
    shots: [
      { file: '01-dusk.png', title: 'Dusk', alt: 'Ridge watch face in the Dusk theme: purple mountains, large time, steps, heart rate and Body Battery' },
      { file: '02-glacier-activity.png', title: 'Glacier', alt: 'Ridge watch face in the Glacier theme showing activity metrics' },
      { file: '03-canyon-recovery.png', title: 'Canyon', alt: 'Ridge watch face in the Canyon theme showing Body Battery, sleep and stress' },
      { file: '04-dusk-amber-training.png', title: 'Amber gauges', alt: 'Ridge watch face in the Dusk theme with amber bezel gauges and training data' },
      { file: '05-glacier-white.png', title: 'White gauges', alt: 'Ridge watch face in the Glacier theme with white bezel gauges' },
      { file: '06-always-on.png', title: 'Always-on', alt: 'Ridge always-on view: a dim time and date' },
    ],
    heroAlt: 'Three Ridge watch faces: Glacier, Dusk and Canyon themes',
    sections: [],
    refundNote: refund,
    privacyNote: 'Ridge collects no personal data.',
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    kind: 'Garmin watch face',
    category: 'LifestyleApplication',
    tagline: 'Your whole day of heart rate in one ring.',
    description:
      'Your whole day of heart rate in one ring: 48 half-hour bars around the face, coloured by your heart-rate zones. A large time, the weather and your day sit inside it, arranged from your phone.',
    storeId: 'c8f95bf2-583f-4228-aac2-0c9b3b85c40b',
    price: '2.99',
    features: [
      '24-hour heart-rate ring: bar length follows each half hour’s average heart rate, colour follows your heart-rate zones',
      'Weather with the day’s high and low, and a three-day calendar',
      'Beside the time, 3 ring gauges and a bottom line: pick from 18 metrics, including Body Battery, stress, sleep score, VO2 max, training status and recovery time',
      '4 backgrounds (teal, ember or dusk contours, or plain), 5 time colours, plus data and accent colours',
      'Date and labels in 36 languages',
      'Always-on display mode with an optional metric',
    ],
    shotsHeading: 'Backgrounds and colours',
    shotsLede: 'Teal, ember or dusk contours, or a plain background, with time, data and accent colours of your choice.',
    shots: [
      { file: '01-teal.png', title: 'Teal contours', alt: 'Pulse watch face on the teal contour background with the 24-hour heart-rate ring' },
      { file: '02-ember-activity.png', title: 'Ember contours', alt: 'Pulse watch face on the ember contour background showing activity data' },
      { file: '03-dusk-recovery.png', title: 'Dusk contours', alt: 'Pulse watch face on the dusk contour background showing recovery data' },
      { file: '04-plain-red.png', title: 'Plain background', alt: 'Pulse watch face on a plain background with red accents' },
      { file: '05-after-the-run.png', title: 'After the run', alt: 'Pulse watch face showing the day’s heart-rate ring after a run' },
      { file: '06-always-on.png', title: 'Always-on', alt: 'Pulse always-on view: a dim time' },
    ],
    heroAlt: 'Three Pulse watch faces with a 24-hour heart-rate ring on contour backgrounds',
    sections: [],
    refundNote: refund,
    privacyNote: 'Pulse collects no personal data.',
  },
  {
    slug: 'daylight',
    name: 'Daylight',
    kind: 'Garmin watch face',
    category: 'LifestyleApplication',
    tagline: 'The sun travels its path across a sky that changes through the day.',
    description:
      'The sun travels its path across a sky that changes colour through the day, from dawn to golden hour to a starlit night. Your time, the weather and your day sit on the dark ground below, arranged from your phone.',
    storeId: 'c788e9e3-b158-4cb3-9d17-b444c687e861',
    price: '2.99',
    features: [
      'Sun path from sunrise to sunset for your location, with the daylight left (or the time until sunrise) and a moon marker at night',
      '7 skies that follow the sun: night, dawn, morning, midday, afternoon, golden hour and dusk',
      'Current weather with high, low and humidity, and a 5-hour forecast with rain chance',
      'Forecast area: hourly forecast, 24-hour chart of Body Battery, stress or heart rate, or a second data row',
      'Data rows and sky info line: pick from 16 metrics, including Body Battery, stress, sleep score, VO2 max and recovery time',
      '6 time colours, including one that follows the sky, plus data and accent colours',
      'Date and labels in 36 languages',
      'Always-on display mode with an optional metric',
    ],
    shotsHeading: 'A sky for every hour',
    shotsLede: 'Night, dawn, morning, midday, afternoon, golden hour and dusk, each with its own sky.',
    shots: [
      { file: '01-afternoon.png', title: 'Afternoon', alt: 'Daylight watch face in the afternoon sky with the sun path and forecast' },
      { file: '02-golden-hour.png', title: 'Golden hour', alt: 'Daylight watch face under the golden hour sky' },
      { file: '03-night.png', title: 'Night', alt: 'Daylight watch face at night with a moon marker on the sun path' },
      { file: '04-dawn-body-battery.png', title: 'Dawn', alt: 'Daylight watch face at dawn with a 24-hour Body Battery chart' },
      { file: '05-midday.png', title: 'Midday', alt: 'Daylight watch face at midday with the hourly forecast' },
      { file: '06-dusk-heart-rate.png', title: 'Dusk', alt: 'Daylight watch face at dusk with a 24-hour heart-rate chart' },
      { file: '07-morning-stress.png', title: 'Morning', alt: 'Daylight watch face in the morning with a 24-hour stress chart' },
      { file: '08-always-on.png', title: 'Always-on', alt: 'Daylight always-on view: a dim time' },
    ],
    heroAlt: 'Three Daylight watch faces: dawn, midday and night skies with the sun path',
    sections: [],
    refundNote: refund,
    privacyNote: 'Daylight collects no personal data.',
  },
  {
    slug: 'aurora',
    name: 'Aurora',
    kind: 'Garmin watch face',
    category: 'LifestyleApplication',
    tagline: 'Soft aurora ribbons over a starry sky, with your day underneath.',
    description:
      'Soft aurora ribbons over a starry sky, with a large, light time and your day underneath. Calm to look at, quick to read, and yours to arrange from your phone.',
    storeId: '2a9eb91a-6c1e-49bf-87d9-16df3e68afeb',
    price: '2.99',
    features: [
      '4 skies (Aurora, Arctic, Crimson, Black) and 6 time colours',
      'Info line, data row with progress bars and bottom line: pick from 17 metrics, including Body Battery, stress, sleep score, VO2 max, recovery time and next sunrise or sunset',
      '24-hour chart of Body Battery, stress or heart rate',
      'Date and labels in 36 languages',
      'Always-on display mode',
      'Battery-friendly: data refreshes on a slow cadence and the always-on view stays dim',
    ],
    shotsHeading: 'Four skies, six colours',
    shotsLede: 'Aurora, Arctic, Crimson and Black skies, with time colours and a 24-hour chart to match.',
    shots: [
      { file: '01-aurora.png', title: 'Aurora', alt: 'Aurora watch face with green and purple aurora ribbons' },
      { file: '02-arctic-activity.png', title: 'Arctic', alt: 'Aurora watch face with the Arctic sky showing activity data' },
      { file: '03-crimson-recovery.png', title: 'Crimson', alt: 'Aurora watch face with the Crimson sky showing recovery data' },
      { file: '04-aurora-training.png', title: 'Training data', alt: 'Aurora watch face showing training data under the Aurora sky' },
      { file: '05-black-amber.png', title: 'Black sky', alt: 'Aurora watch face on the Black sky with amber time' },
      { file: '06-arctic-violet.png', title: 'Violet time', alt: 'Aurora watch face with the Arctic sky and a violet time colour' },
      { file: '07-always-on.png', title: 'Always-on', alt: 'Aurora always-on view: a dim time' },
    ],
    heroAlt: 'Three Aurora watch faces with Arctic, Aurora and Crimson skies',
    sections: [],
    refundNote: refund,
    privacyNote: 'Aurora collects no personal data.',
  },
  {
    slug: 'football-live',
    name: 'Football Live',
    kind: 'Garmin watch app',
    category: 'SportsApplication',
    tagline: 'Live football scores and goal alerts on your wrist.',
    description:
      'Football Live shows today’s football scores on your watch and buzzes your wrist when your favourite teams score.',
    storeId: '275bac70-c30f-429e-a6ea-cadd9d53d5ee',
    price: '4.49',
    features: [
      'Live Scores: today’s matches grouped by competition, with score, minute or kick-off time, and the latest scorer for live matches',
      'Match detail: five pages per match: score and scorers, timeline (goals, cards, substitutions), stats, lineups and the league table',
      'Favourite teams: pick your teams and their matches are listed first and highlighted',
      'Glance: your favourite team’s live score, or its next kick-off, without opening the app',
      'Data field (separate download, “Football Live Field”): your favourite team’s score and minute on an activity page, in 1- to 4-field layouts',
    ],
    shotsHeading: 'Scores, detail and alerts',
    shotsLede: 'Today’s matches, five pages of detail per match, favourite teams and goal alerts. Screens show sample data from the Connect IQ simulator.',
    shots: [
      { file: 'list.png', title: 'Today’s matches', alt: 'Football Live match card for the Europa League: LYON versus CRY, kick-off 18:45' },
      { file: 'score.png', title: 'Score and scorers', alt: 'Football Live match score 2–1 at 53 minutes with the scorers listed' },
      { file: 'timeline.png', title: 'Timeline', alt: 'Football Live match timeline listing goals with minute and team' },
      { file: 'stats.png', title: 'Stats', alt: 'Football Live match stats: possession, shots, shots on target, corners and fouls' },
      { file: 'table.png', title: 'League table', alt: 'Football Live league table with position, played, goal difference and points' },
      { file: 'lineups.png', title: 'Lineups', alt: 'Football Live lineups for TOR and ORL, both 4-4-2' },
      { file: 'myteams-list.png', title: 'Favourite teams', alt: 'Football Live My Teams list with a favourite team’s full-time result highlighted' },
      { file: 'alert-goal.png', title: 'Goal alert', alt: 'Football Live goal alert: a green GOAL screen with the new score and scorer' },
    ],
    heroAlt: 'Football Live on a Garmin watch showing match stats and a 3–1 live score',
    sections: [
      {
        heading: 'Goal alerts',
        items: [
          'While the app or the data field is open, a goal by a favourite team buzzes your wrist within about 30 seconds of the score changing on the server.',
          'When the app is closed, a background check runs about every 5 minutes (the shortest interval Connect IQ allows), so a goal alert can take up to about 5 minutes and arrives as a watch notification (on older watches, a prompt to open the app).',
          'Optional alerts for red cards, kick-off, half-time and full-time can be turned on in settings. Goal alerts are on by default.',
        ],
      },
      {
        heading: 'Competitions',
        paragraphs: [
          'Champions League, Europa League, Premier League, LaLiga, Bundesliga, Serie A, Ligue 1, Copa Libertadores and the Brazilian Serie A. Favourite teams can be chosen from the Premier League, LaLiga, Bundesliga, Serie A, Ligue 1 and the Brazilian Serie A.',
        ],
      },
      {
        heading: 'Setting your favourite teams',
        paragraphs: [
          'On the watch, open Options, then Favourites, then Add team.',
          'Or in the Garmin Connect app, open the settings for Football Live and fill in Favourite teams: team codes separated by commas, for example ARS,RMA (up to 23 characters). The codes are the three- or four-letter abbreviations shown in the app. The data field has its own Favourite teams setting.',
        ],
      },
      {
        heading: 'Requirements and limitations',
        items: [
          'Needs a paired phone with the Garmin Connect app and an internet connection. Without a connection the app shows the last scores it received, marked with their age.',
          'Scores may be delayed. Data comes from a third-party source through the developer’s own server and can lag the real match or contain errors. Do not use it for betting.',
          'Shows text and team abbreviations; there is no video, audio or commentary.',
          'Uses a small amount of battery for web requests while open, and one short request about every 5 minutes in the background.',
        ],
      },
    ],
    privacyNote:
      'The watch sends only your favourite team codes, your time-zone offset and the match you open. No account, name, location or health data is collected.',
  },
];
