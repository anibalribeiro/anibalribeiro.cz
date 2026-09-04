# WinMice product page — refresh for v1.1.0

**Date:** 2026-09-04
**Status:** Approved for implementation planning

## Goal

Bring `/Winmice/` in line with WinMice v1.1.0 and replace the two outdated
settings screenshots with fresh captures of the current five-pane Settings
window.

The page was written against v1.0.0. Since then the app gained Sparkle-based
in-app updates, reverse scroll directions, and two new Settings panes, and it
roughly tripled in download size. Every download-size claim on the page is now
wrong, which is the most important thing to fix: it is a factual claim about a
signed binary a visitor is about to download.

## Source of truth

`~/WinMice` at `e1f820a`, tag `v1.1.0`. Specifically `README.md` for feature
copy and sizes, and the `v1.1.0` GitHub release notes for what changed.

## Screenshots

### Source material

Five 1x captures of the Settings window, 636×681 px, PNG with an alpha shadow
ring (`⌘⇧4` + space window capture): Scrolling, Back & Forward, General,
Permissions, About.

### Density approach

The captures are non-Retina. Upscaling them adds no detail — it produces a
larger, softer file. Instead, keep native pixels and constrain the rendered
size so each image displays at roughly half its pixel width.

`.feature-grid` currently declares `display: grid` with a gap but **no**
`grid-template-columns`, so it is single-column at every viewport and its
images render about 766 CSS px wide. At that size a 636 px capture would be
*upscaled by the browser* — visibly soft. Fixing the grid is therefore part of
fixing the screenshots, not a cosmetic aside.

Adopt the pattern `.project-grid` already uses in `global.css`:

```
grid-template-columns: 1fr 1fr;   /* collapsing to 1fr at max-width: 700px */
```

The resulting arithmetic, with `main` at `52rem` and `1.25rem` padding:

| Quantity | Value |
|---|---|
| `main` content width | 832 − 40 = 792 px |
| Column width (2 cols, 20 px gap) | 386 px |
| Image width (article padding 1rem × 2) | 354 px |
| Effective density at 636 px intrinsic | ~1.8x |

`.feature-grid img` also gets `max-width: 360px` with auto margins as a safety
net. On desktop this is a near no-op, since the column already yields 354 px;
it only binds in the ~620–700 px viewport band where the grid has collapsed but
the viewport is still wide. Below that, narrow Retina phones land near 2x on
their own (a 390 px viewport gives a 318 px image).

Constraining rendered width is the only mechanism that makes a 1x capture look
sharp on a Retina display, and it costs nothing in bytes.

### Processing

1. Crop the transparent shadow margin so the window fills the frame.
2. Keep PNG as the committed source, not JPEG.

JPEG is the wrong codec for UI screenshots — it rings around every text label.
The current `settings-nav.jpg` / `settings-scroll.jpg` are JPEG and show this.
Astro's sharp pipeline emits optimized WebP from either source, so starting
lossless just avoids compressing twice.

Old `.jpg` assets are deleted, not left orphaned.

## Page layout

The feature grid keeps two screenshots, one per behavior it already describes:

| Section | Screenshot |
|---------|-----------|
| Middle-click vector scrolling | Scrolling pane |
| Back and forward mouse buttons | Back & Forward pane |

A new "Inside the app" section below the grid shows `General` and
`Permissions`, reusing the same `.feature-grid` markup and the same width cap.

`About` is not published. It shows a version number, a tagline already in the
hero, and a donate button already in the footer links — it would date the page
on every release for no informational gain.

## Content changes

All copy lives in `src/data/winmice.ts` except the section prose in
`src/pages/Winmice/index.astro`.

### Size claims

Three places say "about 600 KB" (`seo.description`, `lede`, and the
"Native, not Electron" section). Replace with ~1.7 MB download / ~4 MB
installed, noting the app's own binary is under 1 MB and the remainder is the
Sparkle update framework. Keep the "no Electron, no interpreted runtime"
framing — that is still the differentiator, and being honest about what the
extra megabytes buy is more credible than a stale smaller number.

### New feature coverage

- **Updates** — a new section. Opt-in on first run, checks daily, shows what
  changed, installs only on confirmation. Configurable in
  `Settings → General → Updates`. Homebrew users can keep using
  `brew upgrade --cask winmice`.
- **Reverse vertical / horizontal** — added to the scrolling feature copy.
- **Speed range** 25–300%, and indicator appearance (light/dark) and size
  (28–48 px) — added to the scrolling feature copy.
- **Button mapping** — any button the mouse reports can be mapped, not just 4
  and 5; left, right, and middle are excluded; mapping a button already used by
  the other direction swaps the two.
- **General pane** — launch at login, hide menu bar icon, Restore Defaults.

### FAQ

Keep the four existing entries, updating the install answer to mention the
Permissions pane. Add three from the README:

- Does macOS have Windows-style autoscroll built in? (No.)
- Do back/forward buttons work on a Mac without extra software? (Only in apps
  that handle buttons 4 and 5 themselves.)
- Is it a Windows program? (No — disambiguates from WinMICE, the imputation
  statistics tool. This exists to keep the name from being confused in search.)

The AutoScroll / Sensible Side Buttons answer gains the note that WinMice
replaces rather than coexists with them, since two apps grabbing one mouse
button conflict.

## Open Graph image

`public/winmice-og.jpg` shows the old three-pane UI and is referenced both as
`og:image` and as JSON-LD `screenshot`.

Rebuild at 1200×630 (the standard OG ratio; it is currently 1000×666) by
compositing the new Scrolling capture scaled to 560 px tall — a downscale from
681 px, so it stays sharp — centered on a `#f4f6f8` background, the site's
`--bg`. The site is light-only, so no dark variant is needed.
`ogImageWidth` / `ogImageHeight` in `index.astro` update to match.

## Testing

The existing suite is 36 tests across 5 files, all passing, and asserts against
built HTML via `tests/helpers/build.ts`.

- `tests/build.test.ts` already requires ≥2 images whose alt text contains
  "settings". Extend to assert the gallery panes are present and that no
  "600 KB" claim survives anywhere in the built output.
- Assert the FAQ JSON-LD carries the full set of questions.
- Assert `og:image` dimensions match the regenerated file.
- `tests/product-css.test.ts` gains a check that the screenshot width cap is
  declared in `product.css`.

Tests are written before the corresponding change and must fail first for the
right reason.

## Out of scope

- The demo loop the WinMice README promises on the product site. It does not
  exist yet and needs a screen recording, which is its own piece of work.
- Any change to the home page project card.
- Committing the surrounding uncommitted WinMice page work, which predates
  this task.
