# Personal Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a hiring-first Astro static site at anibalribeiro.cz with two project cards, a CV placeholder, contact links, and full SEO.

**Architecture:** One `/` route assembled from small Astro components. All copy and links come from `src/data/site.ts` at build time. SEO tags and JSON-LD are built by `src/lib/seo.ts` and emitted in `Layout.astro`. No client-side JavaScript, no CMS, no backend.

**Tech Stack:** Astro 7.2.2, `@astrojs/sitemap` 3.7.3, TypeScript, Vitest, linkedom (HTML assertions on `dist/`). Node.js 22+.

## Global Constraints

- Display name is `Aníbal Ribeiro` (í accent). Domain, email, and URLs stay unaccented.
- Headline is exactly `Software Engineering Manager`.
- English only. Light theme only (`#f4f6f8` page, `#1e3a5f` accent). No dark mode.
- Canonical origin is `https://anibalribeiro.cz/` (no `www`).
- Zero client JS in v1 (no Astro islands, no `client:*` directives). Sticky nav and smooth scroll are CSS.
- CV download is disabled while `site.cvAvailable === false`. Never link to a missing `/cv.pdf`.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- No blog, skills grid, timeline, analytics, or CMS.
- Spec: `docs/superpowers/specs/2026-08-14-personal-portfolio-design.md`.

## File map

| File | Responsibility |
|------|----------------|
| `package.json` | Scripts: `dev`, `build`, `check`, `preview`, `test` |
| `astro.config.mjs` | `site: 'https://anibalribeiro.cz'`, sitemap integration |
| `tsconfig.json` | Extends `astro/tsconfigs/strict` |
| `vitest.config.ts` | Test include globs |
| `src/data/site.ts` | Person, bio, SEO strings, projects, `cvAvailable` |
| `src/lib/seo.ts` | Canonical URL + JSON-LD `@graph` |
| `src/styles/global.css` | Product-craft layout and theme |
| `src/layouts/Layout.astro` | `html lang`, title, meta, OG, JSON-LD, skip link slot |
| `src/components/Header.astro` | Sticky `AR` + Work / CV / Contact |
| `src/components/Hero.astro` | Photo, h1, role badge, bio |
| `src/components/ProjectCard.astro` | One project card |
| `src/components/Work.astro` | `#work` section, two cards |
| `src/components/Cv.astro` | `#cv` section, disabled/enabled download |
| `src/components/Contact.astro` | `#contact` email, GitHub, LinkedIn |
| `src/components/Footer.astro` | Name + year |
| `src/pages/index.astro` | Composes the page |
| `public/robots.txt` | Allow all, sitemap URL |
| `public/photo.jpg` | Stable Person `image` URL |
| `src/assets/photo.jpg` | Optimized hero via `astro:assets` |
| `public/og.png` | 1200×630 social card |
| `public/favicon.svg` | `AR` mark |
| `public/apple-touch-icon.png` | 180×180 |
| `tests/helpers/build.ts` | Run `astro build` once per Vitest run |
| `src/data/site.test.ts` | Data-shape tests |
| `src/lib/seo.test.ts` | JSON-LD tests |
| `tests/build.test.ts` | Built HTML, SEO, CV, links, no module JS |

---

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/env.d.ts`, `src/pages/index.astro`, `.gitignore`, `.nvmrc`
- Test: none yet (tooling/config exception)

**Interfaces:**
- Consumes: nothing
- Produces: a project that can `npm test` (empty) and `npx astro build`

- [ ] **Step 1: Initialize git and ignore build artifacts**

```bash
cd /Users/ribeiro/anibalribeiro.cz
git init
```

Write `.gitignore`:

```
node_modules/
dist/
.astro/
.superpowers/
```

Write `.nvmrc`:

```
22
```

- [ ] **Step 2: Write package manifest and configs**

`package.json`:

```json
{
  "name": "anibalribeiro.cz",
  "type": "module",
  "private": true,
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "preview": "astro preview",
    "test": "vitest run"
  }
}
```

`astro.config.mjs`:

```js
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://anibalribeiro.cz',
  integrations: [sitemap()],
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
});
```

`src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

`src/pages/index.astro`:

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Aníbal Ribeiro</title>
  </head>
  <body>
    <p>Aníbal Ribeiro</p>
  </body>
</html>
```

- [ ] **Step 3: Install dependencies**

```bash
npm install astro@7.2.2 @astrojs/sitemap@3.7.3
npm install -D vitest typescript @astrojs/check linkedom @types/node
```

- [ ] **Step 4: Verify the empty site builds**

```bash
npx astro build
```

Expected: `dist/index.html` exists and process exits 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/env.d.ts src/pages/index.astro .gitignore .nvmrc
git commit -m "$(cat <<'EOF'
chore: scaffold Astro 7 static site with Vitest

EOF
)"
```

---

### Task 2: Site data module

**Files:**
- Create: `src/data/site.ts`, `src/data/site.test.ts`
- Test: `src/data/site.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:

```ts
export const origin: 'https://anibalribeiro.cz';

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  tags: readonly string[];
  description: string;
  primary: ProjectLink;
  secondary?: ProjectLink;
};

export const site: {
  name: string;
  jobTitle: string;
  email: string;
  bio: string;
  cvAvailable: boolean;
  photoAlt: string;
  socials: { github: string; linkedin: string };
  seo: { title: string; description: string };
  projects: readonly Project[];
};
```

- [ ] **Step 1: Write the failing test**

`src/data/site.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { origin, site } from './site';

describe('site data', () => {
  it('uses the canonical origin without www', () => {
    expect(origin).toBe('https://anibalribeiro.cz');
  });

  it('identifies Aníbal as an engineering manager', () => {
    expect(site.name).toBe('Aníbal Ribeiro');
    expect(site.jobTitle).toBe('Software Engineering Manager');
    expect(site.email).toBe('email@anibalribeiro.cz');
    expect(site.cvAvailable).toBe(false);
    expect(site.photoAlt).toBe('Portrait of Aníbal Ribeiro');
  });

  it('includes the agreed bio mentioning both projects', () => {
    expect(site.bio).toContain('software engineering manager');
    expect(site.bio).toContain('Translate Pro for Brave');
    expect(site.bio).toContain('WinMice');
  });

  it('exposes SEO title and description', () => {
    expect(site.seo.title).toBe('Aníbal Ribeiro — Software Engineering Manager');
    expect(site.seo.description).toBe(
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.',
    );
  });

  it('lists GitHub and LinkedIn', () => {
    expect(site.socials.github).toBe('https://github.com/anibalribeiro');
    expect(site.socials.linkedin).toBe('https://www.linkedin.com/in/anibal-ribeiro/');
  });

  it('defines Translate Pro and WinMice with the agreed links', () => {
    expect(site.projects).toHaveLength(2);

    const translate = site.projects[0];
    expect(translate.title).toBe('Translate Pro for Brave');
    expect(translate.tags).toEqual(['Extension', 'Brave']);
    expect(translate.description).toBe(
      'Faster, customizable in-page translation for Brave.',
    );
    expect(translate.primary).toEqual({
      label: 'Chrome Web Store',
      href: 'https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb',
    });
    expect(translate.secondary).toBeUndefined();

    const winmice = site.projects[1];
    expect(winmice.title).toBe('WinMice');
    expect(winmice.tags).toEqual(['macOS', 'Swift']);
    expect(winmice.description).toBe(
      'Windows-style mouse scrolling and side buttons on Mac.',
    );
    expect(winmice.primary).toEqual({
      label: 'GitHub',
      href: 'https://github.com/anibalribeiro/WinMice',
    });
    expect(winmice.secondary).toEqual({
      label: 'Product site',
      href: 'https://anibalribeiro.github.io/WinMice/',
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/data/site.test.ts
```

Expected: FAIL — `Cannot find module './site'` (or `site` is not exported).

- [ ] **Step 3: Write minimal implementation**

`src/data/site.ts`:

```ts
export const origin = 'https://anibalribeiro.cz' as const;

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
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
  cvAvailable: false,
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
      tags: ['Extension', 'Brave'],
      description: 'Faster, customizable in-page translation for Brave.',
      primary: {
        label: 'Chrome Web Store',
        href: 'https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb',
      },
    },
    {
      title: 'WinMice',
      tags: ['macOS', 'Swift'],
      description: 'Windows-style mouse scrolling and side buttons on Mac.',
      primary: {
        label: 'GitHub',
        href: 'https://github.com/anibalribeiro/WinMice',
      },
      secondary: {
        label: 'Product site',
        href: 'https://anibalribeiro.github.io/WinMice/',
      },
    },
  ] satisfies readonly Project[],
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/data/site.test.ts
```

Expected: PASS (all tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts src/data/site.test.ts
git commit -m "$(cat <<'EOF'
feat: add site content data for person, SEO, and projects

EOF
)"
```

---

### Task 3: SEO helper (canonical + JSON-LD)

**Files:**
- Create: `src/lib/seo.ts`, `src/lib/seo.test.ts`
- Test: `src/lib/seo.test.ts`

**Interfaces:**
- Consumes: `origin` and `site` from `src/data/site.ts`
- Produces:

```ts
export function canonicalUrl(): string;
export function jsonLdGraph(): {
  '@context': 'https://schema.org';
  '@graph': Array<Record<string, unknown>>;
};
```

- [ ] **Step 1: Write the failing test**

`src/lib/seo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { canonicalUrl, jsonLdGraph } from './seo';

describe('seo helpers', () => {
  it('canonicalizes to the apex origin with a trailing slash', () => {
    expect(canonicalUrl()).toBe('https://anibalribeiro.cz/');
  });

  it('builds WebSite and Person JSON-LD with sameAs links', () => {
    const graph = jsonLdGraph();
    expect(graph['@context']).toBe('https://schema.org');

    const website = graph['@graph'].find((node) => node['@type'] === 'WebSite');
    expect(website).toMatchObject({
      name: 'Aníbal Ribeiro',
      url: 'https://anibalribeiro.cz/',
    });

    const person = graph['@graph'].find((node) => node['@type'] === 'Person');
    expect(person).toMatchObject({
      name: 'Aníbal Ribeiro',
      jobTitle: 'Software Engineering Manager',
      url: 'https://anibalribeiro.cz/',
      email: 'mailto:email@anibalribeiro.cz',
      image: 'https://anibalribeiro.cz/photo.jpg',
      sameAs: [
        'https://github.com/anibalribeiro',
        'https://www.linkedin.com/in/anibal-ribeiro/',
      ],
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/lib/seo.test.ts
```

Expected: FAIL — `Cannot find module './seo'`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/seo.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/lib/seo.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts
git commit -m "$(cat <<'EOF'
feat: add canonical URL and Person/WebSite JSON-LD helpers

EOF
)"
```

---

### Task 4: Layout SEO tags in the built HTML

**Files:**
- Create: `src/layouts/Layout.astro`, `tests/helpers/build.ts`, `tests/build.test.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site`, `canonicalUrl()`, `jsonLdGraph()`
- Produces: `Layout.astro` wrapping `<slot />` inside `<main id="main">`, with all document metadata from the spec

- [ ] **Step 1: Write the failing build tests**

`tests/helpers/build.ts`:

```ts
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));

let built = false;

export function buildSite(): void {
  if (built) return;
  execSync('npx astro build', { cwd: root, stdio: 'pipe' });
  built = true;
}

export function readDist(rel: string): string {
  buildSite();
  return readFileSync(path.join(root, 'dist', rel), 'utf8');
}

export function parseIndex() {
  const html = readDist('index.html');
  const { document } = parseHTML(html);
  return { html, document };
}
```

`tests/build.test.ts` (SEO cases only in this task; more cases are added in later tasks):

```ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, parseIndex, readDist } from './helpers/build';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

describe('built homepage SEO', () => {
  beforeAll(() => {
    buildSite();
  });

  it('sets lang, title, description, canonical, and robots', () => {
    const { document } = parseIndex();
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.querySelector('title')?.textContent).toBe(
      'Aníbal Ribeiro — Software Engineering Manager',
    );
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.',
    );
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://anibalribeiro.cz/');
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content'),
    ).toBe('index, follow');
    expect(
      document.querySelector('meta[name="theme-color"]')?.getAttribute('content'),
    ).toBe('#f4f6f8');
  });

  it('emits Open Graph and Twitter tags', () => {
    const { document } = parseIndex();
    const prop = (p: string) =>
      document.querySelector(`meta[property="${p}"]`)?.getAttribute('content');
    const name = (n: string) =>
      document.querySelector(`meta[name="${n}"]`)?.getAttribute('content');

    expect(prop('og:type')).toBe('website');
    expect(prop('og:title')).toBe('Aníbal Ribeiro — Software Engineering Manager');
    expect(prop('og:description'))?.toContain('Translate Pro for Brave');
    expect(prop('og:url')).toBe('https://anibalribeiro.cz/');
    expect(prop('og:image')).toBe('https://anibalribeiro.cz/og.png');
    expect(prop('og:image:width')).toBe('1200');
    expect(prop('og:image:height')).toBe('630');
    expect(prop('og:locale')).toBe('en_US');
    expect(prop('og:site_name')).toBe('Aníbal Ribeiro');
    expect(name('twitter:card')).toBe('summary_large_image');
    expect(name('twitter:title')).toBe(
      'Aníbal Ribeiro — Software Engineering Manager',
    );
    expect(name('twitter:description'))?.toContain('WinMice');
    expect(name('twitter:image')).toBe('https://anibalribeiro.cz/og.png');
  });

  it('embeds Person JSON-LD with GitHub and LinkedIn sameAs', () => {
    const { document } = parseIndex();
    const raw = document.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);
    const person = data['@graph'].find(
      (node: { '@type': string }) => node['@type'] === 'Person',
    );
    expect(person.sameAs).toEqual([
      'https://github.com/anibalribeiro',
      'https://www.linkedin.com/in/anibal-ribeiro/',
    ]);
  });

  it('has a skip link targeting main and a single h1', () => {
    const { document } = parseIndex();
    const skip = document.querySelector('a[href="#main"]');
    expect(skip?.textContent?.toLowerCase()).toContain('skip');
    expect(document.querySelector('#main')).toBeTruthy();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('h1')?.textContent).toBe('Aníbal Ribeiro');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — title/description/canonical/JSON-LD assertions do not match the stub page.

- [ ] **Step 3: Write Layout and use it from index**

`src/layouts/Layout.astro`:

```astro
---
import { origin, site } from '../data/site';
import { canonicalUrl, jsonLdGraph } from '../lib/seo';
import '../styles/global.css';

const jsonLd = JSON.stringify(jsonLdGraph());
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{site.seo.title}</title>
    <meta name="description" content={site.seo.description} />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#f4f6f8" />
    <link rel="canonical" href={canonicalUrl()} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={site.seo.title} />
    <meta property="og:description" content={site.seo.description} />
    <meta property="og:url" content={canonicalUrl()} />
    <meta property="og:image" content={`${origin}/og.png`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content={site.name} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={site.seo.title} />
    <meta name="twitter:description" content={site.seo.description} />
    <meta name="twitter:image" content={`${origin}/og.png`} />
    <script type="application/ld+json" set:html={jsonLd} />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <slot name="header" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

Create a stub `src/styles/global.css` so the import resolves (real styles in Task 11):

```css
.skip-link {
  position: absolute;
  left: -999px;
  top: 0;
}
.skip-link:focus {
  left: 1rem;
  z-index: 2;
}
```

`src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { site } from '../data/site';
---
<Layout>
  <h1>{site.name}</h1>
</Layout>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS. If `set:html` on the JSON-LD script is rejected by this Astro version, switch to:

```astro
<script type="application/ld+json" is:inline>
{jsonLd}
</script>
```

is invalid (must be static). Use:

```astro
<Fragment set:html={`<script type="application/ld+json">${jsonLd}</script>`} />
```

instead, then re-run the test.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/pages/index.astro src/styles/global.css tests/helpers/build.ts tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: emit document SEO tags, Open Graph, and JSON-LD

EOF
)"
```

---

### Task 5: robots.txt and sitemap

**Files:**
- Create: `public/robots.txt`
- Modify: `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: Astro `site` config and `@astrojs/sitemap`
- Produces: `dist/robots.txt` and a sitemap that lists `https://anibalribeiro.cz/`

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('crawl files', () => {
  it('ships robots.txt that allows indexing and points at the sitemap', () => {
    const robots = readDist('robots.txt');
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\//i);
    expect(robots).toContain('Sitemap: https://anibalribeiro.cz/sitemap-index.xml');
  });

  it('includes the homepage in the generated sitemap', () => {
    const indexXml = readDist('sitemap-index.xml');
    expect(indexXml).toContain('sitemap');
    const childName =
      indexXml.match(/https:\/\/anibalribeiro\.cz\/(sitemap-0\.xml)/)?.[1] ??
      'sitemap-0.xml';
    const child = readDist(childName);
    expect(child).toContain('https://anibalribeiro.cz/');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — `robots.txt` missing (sitemap may already exist from Task 1).

- [ ] **Step 3: Add robots.txt**

`public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://anibalribeiro.cz/sitemap-index.xml
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS. If the child sitemap filename differs, read it from `sitemap-index.xml` as the test already does. If Astro emits a single `sitemap-0.xml` only, assert on that file.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add robots.txt and verify the homepage sitemap entry

EOF
)"
```

---

### Task 6: Header navigation

**Files:**
- Create: `src/components/Header.astro`
- Modify: `src/pages/index.astro`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: nothing from site data except visual mark `AR`
- Produces: `<header>` with `<nav>` links to `#work`, `#cv`, `#contact`; `AR` links to `#top`

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('header', () => {
  it('exposes Work, CV, and Contact jump links', () => {
    const { document } = parseIndex();
    const header = document.querySelector('header');
    expect(header).toBeTruthy();
    expect(header?.querySelector('nav')).toBeTruthy();
    expect(header?.querySelector('a[href="#work"]')?.textContent).toBe('Work');
    expect(header?.querySelector('a[href="#cv"]')?.textContent).toBe('CV');
    expect(header?.querySelector('a[href="#contact"]')?.textContent).toBe(
      'Contact',
    );
    expect(header?.querySelector('a[href="#top"]')?.textContent).toBe('AR');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — no `header` / jump links.

- [ ] **Step 3: Implement Header and mount it**

`src/components/Header.astro`:

```astro
---
---
<header id="top">
  <a class="mark" href="#top">AR</a>
  <nav aria-label="Page">
    <a href="#work">Work</a>
    <a href="#cv">CV</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```

`src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import { site } from '../data/site';
---
<Layout>
  <Header slot="header" />
  <h1>{site.name}</h1>
</Layout>
```

Confirm skip-link remains the first focusable control in the DOM (it is in `Layout.astro` before the header slot).

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/pages/index.astro tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add sticky-page header with in-page section links

EOF
)"
```

---

### Task 7: Hero

**Files:**
- Create: `src/components/Hero.astro`, `src/assets/photo.jpg`, `public/photo.jpg`
- Modify: `src/pages/index.astro`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site.name`, `site.jobTitle`, `site.bio`, `site.photoAlt`; `src/assets/photo.jpg` via `astro:assets` `Image`
- Produces: hero with one `h1` (the name), a non-heading role badge, bio paragraph, circular image with the spec alt text

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('hero', () => {
  it('shows the role as a badge, not a second h1, plus the bio', () => {
    const { document } = parseIndex();
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.body.textContent).toContain('Software Engineering Manager');
    expect(document.body.textContent).toContain('small utility apps');
  });

  it('renders the headshot with the agreed alt text', () => {
    const { document } = parseIndex();
    const img = document.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Portrait of Aníbal Ribeiro');
    expect(img?.getAttribute('width')).toBeTruthy();
    expect(img?.getAttribute('height')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — no `img`, bio may be missing.

- [ ] **Step 3: Generate placeholder photos, then implement Hero**

Write `scripts/generate-placeholders.mjs` and run it (also used in Task 12 for `og.png` and the apple-touch icon). For this task, generate the two JPEGs:

```js
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function writePpm(file, width, height, r, g, b) {
  const pixels = Buffer.alloc(width * height * 3, 0);
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
  writeFileSync(file, Buffer.concat([Buffer.from(`P6\n${width} ${height}\n255\n`), pixels]));
}

mkdirSync('src/assets', { recursive: true });
mkdirSync('public', { recursive: true });
writePpm('/tmp/photo.ppm', 400, 400, 197, 208, 220);
execFileSync('sips', ['-s', 'format', 'jpeg', '/tmp/photo.ppm', '--out', 'src/assets/photo.jpg']);
execFileSync('cp', ['src/assets/photo.jpg', 'public/photo.jpg']);
```

Run:

```bash
node scripts/generate-placeholders.mjs
```

`src/components/Hero.astro`:

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
import { site } from '../data/site';
---
<section class="hero" aria-labelledby="name">
  <Image
    src={photo}
    alt={site.photoAlt}
    width={160}
    height={160}
    densities={[1, 2]}
    format="webp"
    priority
  />
  <div>
    <h1 id="name">{site.name}</h1>
    <p class="badge">{site.jobTitle}</p>
    <p class="bio">{site.bio}</p>
  </div>
</section>
```

Update `src/pages/index.astro` to render `<Hero />` instead of a raw `<h1>`.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS. Confirm `astro:assets` emitted a WebP (or JPEG fallback) and that `priority` added a preload link in `<head>`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/assets/photo.jpg public/photo.jpg src/pages/index.astro tests/build.test.ts scripts/generate-placeholders.mjs
git commit -m "$(cat <<'EOF'
feat: add hero with name, role badge, bio, and optimized photo

EOF
)"
```

---

### Task 8: Work section and project cards

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/Work.astro`
- Modify: `src/pages/index.astro`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site.projects` (`Project` type from Task 2)
- Produces: `<section id="work">` with `h2` “Work”, two cards, each `h3` + tags + description + primary link (and secondary when present)

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('work', () => {
  it('renders both projects as h3s under #work', () => {
    const { document } = parseIndex();
    const work = document.querySelector('#work');
    expect(work).toBeTruthy();
    expect(work?.querySelector('h2')?.textContent).toBe('Work');
    const titles = [...work!.querySelectorAll('h3')].map((el) => el.textContent);
    expect(titles).toEqual(['Translate Pro for Brave', 'WinMice']);
  });

  it('uses named external links with noopener', () => {
    const { document } = parseIndex();
    const store = document.querySelector(
      'a[href="https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb"]',
    );
    expect(store?.textContent).toBe('Chrome Web Store');
    expect(store?.getAttribute('target')).toBe('_blank');
    expect(store?.getAttribute('rel')).toContain('noopener');

    const github = document.querySelector(
      'a[href="https://github.com/anibalribeiro/WinMice"]',
    );
    expect(github?.textContent).toBe('GitHub');

    const product = document.querySelector(
      'a[href="https://anibalribeiro.github.io/WinMice/"]',
    );
    expect(product?.textContent).toBe('Product site');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — `#work` missing.

- [ ] **Step 3: Implement the components**

`src/components/ProjectCard.astro`:

```astro
---
import type { Project } from '../data/site';

interface Props {
  project: Project;
}

const { project } = Astro.props;
---
<article>
  <h3>{project.title}</h3>
  <p class="tags">{project.tags.join(' · ')}</p>
  <p>{project.description}</p>
  <p class="links">
    <a href={project.primary.href} target="_blank" rel="noopener noreferrer">
      {project.primary.label}
    </a>
    {
      project.secondary && (
        <a href={project.secondary.href} target="_blank" rel="noopener noreferrer">
          {project.secondary.label}
        </a>
      )
    }
  </p>
</article>
```

`src/components/Work.astro`:

```astro
---
import { site } from '../data/site';
import ProjectCard from './ProjectCard.astro';
---
<section id="work" aria-labelledby="work-heading">
  <h2 id="work-heading">Work</h2>
  <div class="project-grid">
    {site.projects.map((project) => <ProjectCard project={project} />)}
  </div>
</section>
```

Mount `<Work />` from `src/pages/index.astro` after `<Hero />`.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.astro src/components/Work.astro src/pages/index.astro tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add work section with Translate Pro and WinMice cards

EOF
)"
```

---

### Task 9: CV section

**Files:**
- Create: `src/components/Cv.astro`
- Modify: `src/pages/index.astro`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site.cvAvailable` (boolean)
- Produces: `<section id="cv">` with `h2` “CV”, copy “CV coming soon.” when unavailable, and a **disabled** control that is not an `href` to `/cv.pdf`. When `cvAvailable` is true, an enabled `<a href="/cv.pdf">Download PDF</a>`.

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('cv', () => {
  it('shows coming soon and does not link to a missing PDF', () => {
    const { document, html } = parseIndex();
    const cv = document.querySelector('#cv');
    expect(cv?.querySelector('h2')?.textContent).toBe('CV');
    expect(cv?.textContent).toContain('CV coming soon.');
    expect(cv?.querySelector('a[href="/cv.pdf"]')).toBeNull();
    expect(html).not.toContain('href="/cv.pdf"');
    const download = cv?.querySelector('button, a, [aria-disabled]');
    expect(download?.textContent).toContain('Download PDF');
    const disabled =
      download?.hasAttribute('disabled') ||
      download?.getAttribute('aria-disabled') === 'true';
    expect(disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — `#cv` missing.

- [ ] **Step 3: Implement Cv**

`src/components/Cv.astro`:

```astro
---
import { site } from '../data/site';
---
<section id="cv" aria-labelledby="cv-heading">
  <h2 id="cv-heading">CV</h2>
  {
    site.cvAvailable ? (
      <a class="download" href="/cv.pdf">Download PDF</a>
    ) : (
      <>
        <p>CV coming soon.</p>
        <button class="download" type="button" disabled>
          Download PDF
        </button>
      </>
    )
  }
</section>
```

Mount `<Cv />` after `<Work />` in `src/pages/index.astro`.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Cv.astro src/pages/index.astro tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add CV section with disabled download until the PDF exists

EOF
)"
```

---

### Task 10: Contact and footer

**Files:**
- Create: `src/components/Contact.astro`, `src/components/Footer.astro`
- Modify: `src/pages/index.astro`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site.email`, `site.socials.github`, `site.socials.linkedin`, `site.name`
- Produces: `<section id="contact">` with `h2` “Contact”, `mailto:` link, GitHub and LinkedIn (new tab); `<footer>` with name and the build year

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('contact and footer', () => {
  it('exposes mailto, GitHub, and LinkedIn', () => {
    const { document } = parseIndex();
    const contact = document.querySelector('#contact');
    expect(contact?.querySelector('h2')?.textContent).toBe('Contact');
    const mail = contact?.querySelector('a[href="mailto:email@anibalribeiro.cz"]');
    expect(mail?.textContent).toBe('email@anibalribeiro.cz');
    const gh = contact?.querySelector('a[href="https://github.com/anibalribeiro"]');
    expect(gh?.textContent).toBe('GitHub');
    expect(gh?.getAttribute('rel')).toContain('noopener');
    const li = contact?.querySelector(
      'a[href="https://www.linkedin.com/in/anibal-ribeiro/"]',
    );
    expect(li?.textContent).toBe('LinkedIn');
  });

  it('has a footer with the name and year', () => {
    const { document } = parseIndex();
    const footer = document.querySelector('footer');
    expect(footer?.textContent).toContain('Aníbal Ribeiro');
    expect(footer?.textContent).toContain(String(new Date().getFullYear()));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — `#contact` / `footer` missing.

- [ ] **Step 3: Implement Contact and Footer**

`src/components/Contact.astro`:

```astro
---
import { site } from '../data/site';
---
<section id="contact" aria-labelledby="contact-heading">
  <h2 id="contact-heading">Contact</h2>
  <ul>
    <li>
      <a href={`mailto:${site.email}`}>{site.email}</a>
    </li>
    <li>
      <a href={site.socials.github} target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </li>
    <li>
      <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
    </li>
  </ul>
</section>
```

`src/components/Footer.astro`:

```astro
---
import { site } from '../data/site';
const year = new Date().getFullYear();
---
<footer>
  <p>{site.name} · {year}</p>
</footer>
```

`src/pages/index.astro` final composition:

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Work from '../components/Work.astro';
import Cv from '../components/Cv.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---
<Layout>
  <Header slot="header" />
  <Hero />
  <Work />
  <Cv />
  <Contact />
  <Footer slot="footer" />
</Layout>
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.astro src/components/Footer.astro src/pages/index.astro tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add contact links and footer

EOF
)"
```

---

### Task 11: Product-craft CSS

**Files:**
- Modify: `src/styles/global.css`, `src/components/Header.astro` (class names only if needed), `tests/build.test.ts`
- Test: `tests/build.test.ts` (no client JS + system font)

**Interfaces:**
- Consumes: existing markup class names (`hero`, `badge`, `project-grid`, `skip-link`, `mark`, `download`)
- Produces: light product-craft look matching the spec (no webfonts, sticky header, two-column project grid, smooth scroll)

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
describe('performance constraints', () => {
  it('does not ship client module scripts or webfont stylesheets', () => {
    const { document, html } = parseIndex();
    expect(document.querySelectorAll('script[type="module"]')).toHaveLength(0);
    expect(html).not.toMatch(/fonts\.googleapis\.com/);
    expect(html).not.toMatch(/fonts\.gstatic\.com/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: may FAIL if Astro injected a module script for the stub page. If it already passes, still replace CSS in Step 3 (visual deliverable). Do not add JS to make a red test; this test is a guardrail.

- [ ] **Step 3: Replace global CSS**

`src/styles/global.css`:

```css
:root {
  --bg: #f4f6f8;
  --card: #ffffff;
  --text: #111827;
  --muted: #4b5563;
  --line: #e5e7eb;
  --accent: #1e3a5f;
  --badge: #e8eef5;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.5;
}

.skip-link {
  position: absolute;
  left: -999px;
  top: 0.75rem;
  background: var(--card);
  color: var(--accent);
  padding: 0.4rem 0.7rem;
}

.skip-link:focus {
  left: 1rem;
  z-index: 20;
}

header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.5rem;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}

.mark {
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.03em;
}

header nav {
  display: flex;
  gap: 1.1rem;
}

header nav a {
  color: var(--muted);
  text-decoration: none;
}

header nav a:hover,
header nav a:focus {
  color: var(--text);
}

main {
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.hero {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.5rem;
}

.hero img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
}

.hero h1 {
  margin: 0 0 0.4rem;
  letter-spacing: -0.03em;
  font-size: 2rem;
}

.badge {
  display: inline-block;
  margin: 0 0 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--badge);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.bio {
  margin: 0;
  color: var(--muted);
}

#work,
#cv,
#contact {
  margin-top: 2.5rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.project-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.project-grid article {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem;
}

.project-grid h3 {
  margin: 0 0 0.35rem;
}

.tags {
  margin: 0 0 0.5rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.links {
  display: flex;
  gap: 0.85rem;
}

.links a,
#contact a {
  color: var(--accent);
  font-weight: 600;
}

.download {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.4rem 0.8rem;
  border: 0;
  border-radius: 8px;
  background: var(--line);
  color: var(--muted);
  font: inherit;
}

.download[disabled] {
  cursor: not-allowed;
}

#contact ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#contact li + li {
  margin-top: 0.35rem;
}

footer {
  padding: 1.25rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 700px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

Do not add `client:*` directives or `<script>` tags to components.

- [ ] **Step 4: Run tests and a visual check**

```bash
npx vitest run
npx astro build
npx astro preview
```

Expected: all tests PASS; open the preview URL and confirm sticky header, two-column cards, cream/gray product-craft look.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css tests/build.test.ts
git commit -m "$(cat <<'EOF'
style: apply product-craft layout with system fonts and no client JS

EOF
)"
```

---

### Task 12: Social image, favicon, apple-touch icon

**Files:**
- Create: `public/og.png`, `public/favicon.svg`, `public/apple-touch-icon.png`
- Modify: `scripts/generate-placeholders.mjs`, `tests/build.test.ts`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `og.png` exactly 1200×630; SVG favicon with `AR`; 180×180 apple-touch icon

- [ ] **Step 1: Write the failing test**

Append to `tests/build.test.ts`:

```ts
Add `import { existsSync } from 'node:fs';` at the top of `tests/build.test.ts` if it is not already there.

```ts
describe('brand assets', () => {
  it('ships og.png, favicon.svg, and apple-touch-icon.png', () => {
    expect(existsSync(path.join(root, 'dist/og.png'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/favicon.svg'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/apple-touch-icon.png'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/photo.jpg'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/build.test.ts
```

Expected: FAIL — `og.png` / favicon missing from `dist/`.

- [ ] **Step 3: Generate assets**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#1e3a5f"/>
  <text x="16" y="22" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff">AR</text>
</svg>
```

Extend `scripts/generate-placeholders.mjs` to also write:

- `/tmp/og.ppm` 1200×630 in `#1e3a5f`, convert with `sips -s format png` to `public/og.png`
- `/tmp/icon.ppm` 180×180 in `#1e3a5f`, convert to `public/apple-touch-icon.png`

Then run `node scripts/generate-placeholders.mjs`.

Optional: overlay the name with `sips` cannot draw text. If ImageMagick `convert` is available, use:

```bash
convert -size 1200x630 xc:'#1e3a5f' -gravity center -fill white -font Helvetica -pointsize 64 -annotate 0 'Aníbal Ribeiro' public/og.png
```

If ImageMagick is missing, a solid navy PNG is acceptable for v1 (replace later with a designed card). The file must still be 1200×630. Verify:

```bash
sips -g pixelWidth -g pixelHeight public/og.png
```

Expected: `pixelWidth: 1200`, `pixelHeight: 630`.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/build.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/og.png public/favicon.svg public/apple-touch-icon.png scripts/generate-placeholders.mjs tests/build.test.ts
git commit -m "$(cat <<'EOF'
feat: add Open Graph image, favicon, and apple-touch icon

EOF
)"
```

---

### Task 13: Final verification and README

**Files:**
- Create: `README.md`
- Modify: none unless `astro check` reports errors
- Test: `npm test`, `npx astro check`, `npx astro build`

**Interfaces:**
- Consumes: the finished site
- Produces: README explaining `npm run dev`, how to replace the photo (both paths), and how to enable the CV (`public/cv.pdf` + `cvAvailable: true`)

- [ ] **Step 1: Run the full suite**

```bash
npm test
npx astro check
npx astro build
```

Expected: all three exit 0. `dist/` contains `index.html`, `robots.txt`, sitemap, `og.png`, `photo.jpg`. Built HTML has one `h1`, no `script[type="module"]`.

- [ ] **Step 2: Write README.md**

```markdown
# anibalribeiro.cz

Personal site for Aníbal Ribeiro — software engineering manager.

## Develop

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run check
npm run build
```

## Replace the headshot

Overwrite both:

- `src/assets/photo.jpg` (hero, optimized at build)
- `public/photo.jpg` (stable URL used in JSON-LD)

Then rebuild.

## Enable the CV

1. Add `public/cv.pdf`
2. Set `cvAvailable: true` in `src/data/site.ts`
3. Rebuild

## Deploy

`npm run build` emits static files in `dist/`. Point `anibalribeiro.cz` at any static host (Cloudflare Pages, Netlify, etc.). Canonical URL in the HTML is `https://anibalribeiro.cz/`.
```

- [ ] **Step 3: Manual pass**

Open `npx astro preview`, check:

- Skip link appears on Tab
- Nav jumps to Work / CV / Contact
- Both project links open in a new tab
- Download PDF is visible and not clickable
- View source: title, description, canonical, JSON-LD

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: add README for local dev, photo, and CV enablement

EOF
)"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Astro static, one `/` route | 1, 10 composition |
| `src/data/site.ts` content | 2 |
| Translate Pro + WinMice cards/links | 2, 8 |
| Headline, bio, Aníbal accent | 2, 7 |
| Photo placeholder + Astro Image | 7 |
| CV coming soon, disabled download | 9 |
| Contact email/GitHub/LinkedIn | 10 |
| Product-craft CSS, light only, system fonts | 11 |
| Sticky header, two-column work | 6, 8, 11 |
| Title, description, canonical, robots, theme-color | 4 |
| Open Graph / Twitter | 4, 12 |
| JSON-LD Person + WebSite | 3, 4 |
| Semantic headings / landmarks / skip link | 4–10 |
| sitemap + robots.txt | 5 |
| Zero client JS | 11 guardrail |
| Favicon + apple-touch-icon | 12 |
| `astro check` / `astro build` / content tests | 13 |
| No blog/CMS/analytics | not scheduled |
