export const winmice = {
  name: 'WinMice',
  tagline: 'Windows-style mouse on Mac',
  seo: {
    title: 'WinMice for Mac — Windows-style autoscroll and mouse side buttons',
    description:
      'WinMice is a tiny native macOS menu-bar app for Windows-style middle-click vector scrolling (autoscroll) and configurable back/forward mouse side buttons. Swift and AppKit, a 1.7 MB download, no Electron. Developer ID signed and notarized.',
  },
  lede: 'A tiny native menu-bar utility for middle-click vector scrolling and configurable back/forward side buttons. A 1.7 MB download. No Electron.',
  downloadUrl: 'https://github.com/anibalribeiro/WinMice/releases/latest',
  githubUrl: 'https://github.com/anibalribeiro/WinMice',
  releasesUrl: 'https://github.com/anibalribeiro/WinMice/releases',
  supportUrl: 'https://paypal.me/anibalccribeiro',
  brew: `brew tap anibalribeiro/winmice
brew trust anibalribeiro/winmice
brew install --cask winmice`,
  faqs: [
    {
      question: 'What is WinMice?',
      answer:
        'WinMice is a native macOS utility that brings Windows-style mouse behavior to Mac: middle-click vector scrolling (autoscroll) and configurable back/forward side buttons. It lives in the menu bar and uses Swift and AppKit, not Electron.',
    },
    {
      question: 'How do I install WinMice on Mac?',
      answer:
        'Download the latest DMG from GitHub Releases, drag WinMice.app to /Applications, then open it and grant Accessibility when prompted — Settings → Permissions shows the current state. You can also install with Homebrew: brew tap anibalribeiro/winmice && brew trust anibalribeiro/winmice && brew install --cask winmice.',
    },
    {
      question: 'Does macOS have Windows-style autoscroll built in?',
      answer:
        'No. macOS has no middle-click autoscroll at any level, and the middle button is left to whatever app is under the pointer. WinMice adds the behavior system-wide.',
    },
    {
      question:
        'Do my mouse back and forward buttons work on a Mac without extra software?',
      answer:
        'Only inside apps that choose to handle buttons 4 and 5 themselves. Most browsers do; Finder, Preview, and the majority of native apps do not. WinMice makes those buttons navigate everywhere.',
    },
    {
      question: 'Why does WinMice need Accessibility permission?',
      answer:
        'macOS requires Accessibility access for an app that reads mouse buttons and generates scroll or navigation events. WinMice uses that permission only for scrolling and side-button navigation. Release builds are Developer ID signed and notarized by Apple.',
    },
    {
      question: 'Is WinMice an AutoScroll or Sensible Side Buttons alternative?',
      answer:
        'Yes. WinMice combines Windows-style autoscroll (middle-click vector scrolling) and system-wide mouse back/forward buttons in one lightweight macOS app, similar in spirit to AutoScroll and Sensible Side Buttons, but native and maintained. If you already run one of them, WinMice replaces it rather than sitting alongside it — two apps grabbing the same mouse button will fight.',
    },
    {
      question: 'Does WinMice update itself?',
      answer:
        'Yes, if you let it. Shortly after first run WinMice asks whether it may check for updates. If you agree it checks once a day, shows you what changed, and installs only when you say so. Change your mind any time in Settings → General → Updates, or use Check for Updates… in the menu bar. Homebrew users can keep running brew upgrade --cask winmice instead.',
    },
    {
      question: 'Is WinMice a Windows program?',
      answer:
        'No. WinMice is a macOS app; the name refers to the Windows mouse behavior it reproduces. It is unrelated to WinMICE, the old statistics tool for multiple imputation of missing data.',
    },
  ],
} as const;
