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

Five Retina window captures of the Settings window, 1504×1584 px PNG at 144
dpi: Scrolling, Back & Forward, General, Permissions, About.

Each frame is the window plus its semi-transparent drop shadow. The opaque
window body measures 1280×1360 px — that is 640×680 logical points at 2x. All
five are geometrically identical, so one crop box serves all of them:
`left 112, top 76, 1280×1360`.

An earlier round used 1x captures (636×681, region grabs including desktop
wallpaper). Those are superseded: a 1x source cannot be both legible and sharp,
for the reason set out below.

### Sizing approach

A screenshot of a UI has two independent requirements, and they pull in
opposite directions on a 1x source:

- **Legibility** depends on *rendered* size. The window's text is drawn at a
  fixed point size, so rendering the image below 1:1 shrinks that text.
- **Sharpness** depends on pixels per rendered CSS pixel.

With a 1x source you can only buy sharpness by rendering smaller, which
destroys legibility. An earlier attempt capped these images at 360 px for
~1.8x density and rendered the capture at 57%, shrinking macOS's ~13 px labels
to roughly 7 px: sharp per pixel, and unreadable. That is the whole reason the
captures were redone at 2x.

With a 2x source both requirements are satisfied at once. Render at the
window's true 640 pt width and serve a 1280 px file to Retina clients:

- `.feature-grid img` gets `max-width: 640px`, so the UI text appears at
  exactly the size macOS drew it.
- `<Image densities={[1, 2]} width={640} height={680} />` emits a `srcset`
  with a 640 px candidate at `1x` and a 1280 px candidate at `2x`, so 1x
  clients fetch ~22 KB and Retina clients ~50 KB.

### Compact gallery

Four screenshots at 640×680 made the page about 5,600 px tall. Each one is now
collapsed behind a 280 px thumbnail in a `<details>`/`<summary>`, expanding to
the full 640 px image on click. That brings the page to roughly 3,400 px, a 39%
reduction, and 5,900 px only if a reader opens all four.

`<details>` is the right mechanism here for three reasons: the spec allows
client JavaScript only where HTML and CSS cannot do the job, and this can;
the FAQ on the same page already uses `<details>`, so the interaction is
consistent; and it degrades to a working disclosure widget with no styling at
all.

Layout details:

- `.feature-grid` returns to `1fr 1fr` (collapsing to `1fr` at 700 px), so
  thumbnails pair two to a row.
- A 640 px image cannot fit a 386 px column, so
  `.feature-grid article:has(details[open])` takes `grid-column: 1 / -1` and an
  expanded card claims the whole row.
- The thumbnail rule must be `.feature-grid summary img` rather than
  `.shot summary img`: the latter ties on specificity with `.feature-grid img`
  and would depend on rule order.
- The full image lives in the `<details>` body, not the summary, so browsers
  defer fetching it until the pane opens.
- The summary carries two hints, `.hint-expand` and `.hint-collapse`, swapped
  by `.shot[open]`. A single "click to enlarge" label would still say
  "enlarge" while the pane was already open.
- The thumbnail is hidden when open (`.shot[open] summary img`), since the full
  image has replaced it.

Thumbnail `alt` is empty by design: the adjacent hint text names the pane, so
duplicating it would make screen readers announce the same thing twice. The
full image keeps the descriptive `alt`.

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
Permissions pane. Add four more, for eight in total:

- Does macOS have Windows-style autoscroll built in? (No.)
- Do back/forward buttons work on a Mac without extra software? (Only in apps
  that handle buttons 4 and 5 themselves.)
- Does WinMice update itself? (Yes, opt-in — the headline v1.1.0 change, so it
  earns a direct answer rather than only a prose mention.)
- Is it a Windows program? (No — disambiguates from WinMICE, the imputation
  statistics tool. This exists to keep the name from being confused in search.)

The AutoScroll / Sensible Side Buttons answer gains the note that WinMice
replaces rather than coexists with them, since two apps grabbing one mouse
button conflict.

## Open Graph image

`public/winmice-og.jpg` shows the old three-pane UI and is referenced both as
`og:image` and as JSON-LD `screenshot`.

Rebuild at 1200×630, the standard OG ratio; it is currently 1000×666.

Simply centring the capture leaves dead space either side, because the window
is portrait and the canvas is landscape. Instead, split the card: app icon,
"WinMice" wordmark, the two-line tagline, and the `anibalribeiro.cz/Winmice`
URL on the left; the Scrolling capture scaled to 570 px tall on the right,
inset 48 px from the edge. Background is `#f4f6f8`, the site's `--bg`, and the
type uses the site's `--text`, `--muted`, and `--accent`. The site is
light-only, so no dark variant is needed.

Scaling the 1360 px capture down to 570 px keeps the UI text sharp.
`ogImageWidth` / `ogImageHeight` in `index.astro` update to match.

Note the filename does not change between rounds, so social platforms will
serve their cached copy until the URL is re-scraped through their post
inspector tools.

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
