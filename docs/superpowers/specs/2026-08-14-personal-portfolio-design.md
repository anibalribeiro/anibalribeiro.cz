# Personal portfolio — anibalribeiro.cz

**Date:** 2026-08-14  
**Status:** Approved for implementation planning

## Goal

A hiring-first personal site at anibalribeiro.cz. Recruiters and hiring managers are the primary audience; other developers should still find the project work clear and credible. English only.

## Audience and voice

- Primary: recruiters and hiring managers
- Secondary: developers who might use or inspect the projects
- Tone: product-craft — clean, shipped, professional. Not a résumé PDF and not a terminal-themed developer splash page.

## Content

**Name:** Aníbal Ribeiro (accent on the í, as on the approved layout; domain and email stay unaccented)  
**Headline:** Software Engineering Manager

**Bio:**

> I’m a software engineering manager. Outside work I build small utility apps — the kind of tools I actually want to use. Recent ones: **Translate Pro for Brave**, a faster in-page translator for the browser, and **WinMice**, a native macOS menu-bar app that brings Windows-style mouse scrolling and side buttons to Mac.

**Contact:**

- Email: `email@anibalribeiro.cz` (`mailto:`)
- GitHub: https://github.com/anibalribeiro
- LinkedIn: https://www.linkedin.com/in/anibal-ribeiro/

**Photo:** Include a circular headshot in the hero. Source file is `src/assets/photo.jpg`, rendered with Astro’s `<Image />` (resized, WebP). The same image is also at `public/photo.jpg` so JSON-LD can use the stable URL `https://anibalribeiro.cz/photo.jpg`. Replace both files when you have a real headshot.

**Out of scope for v1:** blog, skills grid, experience timeline, language switch, analytics, CMS, extra marketing pages created only for keyword targeting.

## Information architecture

One Astro route: `/`. One long scrolling page with sticky in-page nav:

| Nav label | Target |
|-----------|--------|
| AR (mark) | top of page |
| Work | `#work` |
| CV | `#cv` |
| Contact | `#contact` |

No separate `/cv` URL.

## Page layout

Product-craft visual language: system UI type, soft gray page background (`#f4f6f8`), white cards, navy-tinted accent (`#1e3a5f`), pill role badge, two-column project grid on desktop (stack to one column on small screens). Light theme only (no dark mode in v1). Nav jumps use smooth in-page scrolling. Favicon is a simple `AR` mark.

Section order:

1. **Sticky header** — `AR` mark, Work / CV / Contact
2. **Hero** — circular photo, name, role badge, bio
3. **Work** — two project cards, side by side
4. **CV** — coming-soon copy and download control
5. **Contact** — email, GitHub, LinkedIn
6. **Footer** — name and year

## Projects

Data lives in `src/data/site.ts` (or equivalent). Each project has: title, short description, tags, primary link, optional secondary link. No live store metrics (user counts go stale).

### Translate Pro for Brave

- Tags: Extension, Brave
- Description: Faster, customizable in-page translation for Brave.
- Primary link: Chrome Web Store (`https://chromewebstore.google.com/detail/ibgigmlamcafnomafjpeogpipkdhjjgb`)
- No secondary link

### WinMice

- Tags: macOS, Swift
- Description: Windows-style mouse scrolling and side buttons on Mac.
- Primary link: GitHub (`https://github.com/anibalribeiro/WinMice`)
- Secondary link: product site (`https://anibalribeiro.github.io/WinMice/`)

External project and social links open in a new tab (`rel="noopener noreferrer"`).

## CV section

Until a PDF is provided:

- Copy: “CV coming soon.”
- A Download PDF control is visible and **disabled**. It must not 404 or point at a missing file.

When the PDF is ready:

- Place the file at `public/cv.pdf`
- Set `cvAvailable: true` in site data (explicit flag, not file-existence magic at runtime — this is a static build)
- Rebuild so the button becomes an enabled download of `/cv.pdf`

## Architecture

Static **Astro** site. `astro build` emits HTML/CSS/JS in `dist/` for hosting on anibalribeiro.cz (Cloudflare Pages, Netlify, or any static host). No backend, no CMS, no client-side data fetching.

```
src/
  data/site.ts          # person, bio, links, projects, cvAvailable, seo strings
  assets/photo.jpg      # hero headshot (Astro Image)
  layouts/Layout.astro  # html lang, title, meta, OG, JSON-LD, canonical
  components/
    Header.astro
    Hero.astro
    ProjectCard.astro
    Work.astro
    Cv.astro
    Contact.astro
    Footer.astro
  pages/index.astro
  pages/robots.txt.ts   # or public/robots.txt
public/
  photo.jpg             # stable URL for Person schema
  og.png                # 1200×630 Open Graph image
  # cv.pdf added later
```

`astro.config.mjs` sets `site: 'https://anibalribeiro.cz'` and uses `@astrojs/sitemap` so `sitemap-index.xml` is emitted at build.

## Data flow

All page copy and links are read at **build time** from `src/data/site.ts`. Replacing `public/photo.jpg` updates the headshot on the next build. Enabling the CV is a data-flag change plus adding `public/cv.pdf`, then rebuild.

## Error handling

- Missing CV: disabled button + “CV coming soon.” Never link to a missing `/cv.pdf`.
- Missing or broken headshot: keep the circular frame; the placeholder image ships in the repo so this should not happen in v1.
- No form, so no submit errors. Email is mailto only.

## SEO

Optimize for search and for link unfurls (LinkedIn, Slack, iMessage). Canonical origin is `https://anibalribeiro.cz` (no `www`). Trailing-slash policy: Astro default, canonical is `https://anibalribeiro.cz/`.

### Document metadata

| Field | Value |
|-------|--------|
| `<html lang>` | `en` |
| Title | `Aníbal Ribeiro — Software Engineering Manager` |
| Meta description | `Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator, and WinMice, a native macOS mouse utility.` |
| Canonical | `https://anibalribeiro.cz/` |
| `robots` | `index, follow` |
| Theme color | `#f4f6f8` |

Open Graph / Twitter:

- `og:type` = `website`
- `og:title` / `twitter:title` = same as document title
- `og:description` / `twitter:description` = same as meta description
- `og:url` = canonical URL
- `og:image` / `twitter:image` = `https://anibalribeiro.cz/og.png` (1200×630, include `og:image:width` and `og:image:height`)
- `og:locale` = `en_US`
- `og:site_name` = `Aníbal Ribeiro`
- `twitter:card` = `summary_large_image`

JSON-LD on `/` (one `<script type="application/ld+json">` with a `@graph`):

- **WebSite** — `name`, `url`
- **Person** — `name`, `jobTitle` (`Software Engineering Manager`), `url`, `email`, `image` (absolute URL to the headshot), `sameAs` (GitHub and LinkedIn)

### Semantic HTML and copy

- One `h1`: the name **Aníbal Ribeiro**. Role is not a second `h1`.
- `h2` for Work, CV, Contact. Project titles are `h3`.
- Landmark elements: `header`, `nav`, `main`, `section` (each with `aria-labelledby` or `aria-label`), `footer`.
- Headshot `alt`: `Portrait of Aníbal Ribeiro`. Width and height attributes set; image compressed and served in modern formats via Astro’s `<Image />` (WebP, with JPEG fallback as needed).
- Visible link text names the destination (`Chrome Web Store`, `GitHub`, `Product site`, `LinkedIn`). No “click here”.
- Skip-to-content link as the first focusable control, targeting `main`.

### Crawlability and performance

- `robots.txt` allows `/` and points at the sitemap. Do not disallow CSS/JS.
- Sitemap includes only `/` until more routes exist.
- Zero client-side JavaScript in v1 unless a feature cannot be done with HTML/CSS (sticky header and smooth scroll are CSS). That keeps First Input Delay / INP trivial and the HTML fully crawlable.
- Preload the hero image. No webfonts unless a self-hosted font is added later; v1 uses the system UI stack so there is no font-display flash and no extra font requests.
- `og.png` and `photo.jpg` are compressed before commit. No unused CSS.
- Favicon + `apple-touch-icon` so search and home-screen results are branded.

### Not in v1

- Google Search Console / Bing verification meta tags (add later if you create those accounts).
- A blog or extra landing pages for long-tail keywords.
- `www` vs apex redirect is a DNS/hosting concern; the HTML always canonicalizes to `https://anibalribeiro.cz/`.

## Testing

- `astro check` and `astro build` must pass.
- A small unit/build-time test asserts: both project titles render, the three contact hrefs are present, and the CV control is disabled while `cvAvailable` is false.
- SEO tests on the built `dist/index.html`: document title, meta description, canonical, `og:image`, JSON-LD parses and includes Person `sameAs` for GitHub and LinkedIn, one `h1`, `html[lang=en]`. Built output includes `robots.txt` and a sitemap that lists `https://anibalribeiro.cz/`.
- No end-to-end browser suite in v1.

## Success criteria

- A recruiter can learn the role, read the bio, open both projects, and find email/LinkedIn in one scroll.
- A developer can reach GitHub / the Chrome Web Store / the WinMice product site in one click.
- Adding a third project is appending an object in `src/data/site.ts`.
- Adding the CV is dropping in a PDF, flipping one flag, and rebuilding.
- Sharing the homepage on LinkedIn/Slack shows the title, description, and `og.png` card.
- Search engines receive a single canonical URL, a Person schema, a sitemap, and server-rendered HTML with no required JavaScript.
