# anibalribeiro.cz

[![Astro](https://img.shields.io/badge/Astro-5.x-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18.svg?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D22-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

Personal portfolio, project showcase, and engineering management CV for **Aníbal Ribeiro** — Software Engineering Manager based in Prague, Czech Republic.

🌐 **Live Website**: [https://anibalribeiro.cz](https://anibalribeiro.cz)  
📄 **Interactive CV**: [https://anibalribeiro.cz/cv/](https://anibalribeiro.cz/cv/)  
🐭 **WinMice App**: [https://anibalribeiro.cz/Winmice/](https://anibalribeiro.cz/Winmice/)

---

## 🚀 Overview

This repository powers [anibalribeiro.cz](https://anibalribeiro.cz), designed with an emphasis on minimalist performance, clean typography, accessibility, and zero unnecessary client overhead.

- **Zero Client-Side JavaScript**: The main portfolio and project landing pages ship **0 bytes** of client-side runtime JavaScript.
- **Rich SEO & Social Sharing**: Complete Open Graph, Twitter Cards, canonical URLs, and Schema.org JSON-LD structured data (`ProfilePage`, `Person`, `SoftwareApplication`, `FAQPage`) across all routes.
- **Dedicated CV Experience**: An interactive web CV with a tailored print stylesheet designed to produce a clean 2-page PDF, alongside raw Markdown and downloadable PDF formats.
- **Automated Deployment**: Custom FTPS deployment engine with diff-based remote synchronization and strict TLS verification.
- **Fully Tested**: Strict unit and integration test suite using Vitest and LinkeDOM ensuring zero regression across builds, SEO tags, and data integrity.

---

## 🛠️ Featured Projects

### 🐭 [WinMice](https://github.com/anibalribeiro/WinMice)
> **Native macOS utility bringing Windows-style vector middle-click autoscroll and side button navigation to Mac.**

- Middle-click mouse vector scrolling (click and drag in any direction to smoothly scroll).
- Native support for mouse side buttons 4 & 5 (Back and Forward) in Safari, Finder, Chrome, and system-wide apps.
- Lightweight menu-bar application built natively in Swift with a clean SwiftUI interface.
- Product showcase live at [/Winmice/](https://anibalribeiro.cz/Winmice/).

### 🌐 [Translate Pro for Brave](https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb)
> **Fast, private in-page browser translation extension.**

- Inline and tooltip page translations with zero telemetry and instant hotkey activations.
- Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb).

---

## 📁 Project Structure

```text
├── astro.config.mjs         # Astro configuration & sitemap integration
├── cv/                      # Standalone interactive CV assets
│   ├── index.html           # Full interactive CV page with print stylesheet
│   └── anibal-ribeiro-em.md # Plain-text / Markdown CV
├── public/                  # Static assets served at root
│   ├── .htaccess            # Apache redirection and casing rules
│   ├── cv/                  # Synced CV assets and PDFs
│   ├── favicon.svg          # Vector favicon
│   ├── og.png               # Social share preview image (1200x630)
│   ├── robots.txt           # Crawler instructions and sitemap link
│   └── winmice-*.png        # WinMice iconography and preview assets
├── scripts/
│   └── deploy.mjs           # FTPS incremental deployment script
├── src/
│   ├── assets/              # Optimized image assets (photo, screenshots)
│   ├── components/          # Reusable Astro UI components (Hero, Work, Cv, Contact, etc.)
│   ├── data/                # Typed project data and site constants (site.ts, winmice.ts)
│   ├── layouts/             # Base HTML shell with SEO & JSON-LD injection
│   ├── lib/                 # SEO URL normalizer & JSON-LD schema generators
│   ├── pages/               # File-based routing (/, /Winmice/)
│   └── styles/              # Global CSS design tokens and component styling
└── tests/                   # Vitest unit and DOM integration test suite
```

---

## 💻 Development

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 22` (see [`.nvmrc`](.nvmrc))
- npm

### Installation

```bash
npm install
```

### Local Development

Start the Astro local development server with Hot Module Replacement:

```bash
npm run dev
```

Visit `http://localhost:4321` in your browser.

---

## 🧪 Testing & Quality Gates

Run the test suite and typechecks before committing:

```bash
# Run all Vitest unit and integration tests
npm test

# Run Astro TypeScript and template diagnostics
npm run check

# Create production build in dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Deployment

The site is hosted on a secure static server and deployed via FTPS using `basic-ftp`:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate the required credentials:
   ```env
   FTP_HOST=your-ftp-host.com
   FTP_USER=your-ftp-user
   FTP_PASS=your-ftp-password
   FTP_DIR=public_html
   ```
3. Run the automated build and deployment pipeline:
   ```bash
   npm run deploy
   ```

*Note: `.env` is ignored by Git and must never be committed.*

---

## 📄 License

Content, text, and personal branding &copy; [Aníbal Ribeiro](https://anibalribeiro.cz). All rights reserved.  
Source code structure available for reference under the MIT License.
