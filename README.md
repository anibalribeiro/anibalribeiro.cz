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
