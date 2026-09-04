import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, parseIndex, parsePage, readDist } from './helpers/build';

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
    const locs = [...child.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(
      expect.arrayContaining([
        'https://anibalribeiro.cz/',
        'https://anibalribeiro.cz/Winmice/',
      ]),
    );
    expect(locs).toHaveLength(2);
  });
});

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

  it('preloads the hero image', () => {
    const { document } = parseIndex();
    const preload = document.querySelector('link[rel="preload"][as="image"]');
    expect(preload).toBeTruthy();
    expect(preload?.getAttribute('href')).toBeTruthy();
  });
});

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
      'a[href="/Winmice/"]',
    );
    expect(product?.textContent).toBe('Product site');
  });

  it('shows a 48px official icon on each project card', () => {
    const { document } = parseIndex();
    const articles = [...document.querySelectorAll('#work article')];
    expect(articles).toHaveLength(2);

    const alts = articles.map((article) => article.querySelector('img')?.getAttribute('alt'));
    expect(alts).toEqual(['Translate Pro for Brave icon', 'WinMice icon']);

    for (const article of articles) {
      const img = article.querySelector('img');
      expect(img?.getAttribute('width')).toBe('48');
      expect(img?.getAttribute('height')).toBe('48');
      expect(img?.getAttribute('src')).toMatch(/\.(png|webp|jpg|svg)/i);
    }
  });
});

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

describe('performance constraints', () => {
  it('does not ship client module scripts or webfont stylesheets', () => {
    const { document, html } = parseIndex();
    expect(document.querySelectorAll('script[type="module"]')).toHaveLength(0);
    expect(html).not.toMatch(/fonts\.googleapis\.com/);
    expect(html).not.toMatch(/fonts\.gstatic\.com/);
  });
});

describe('brand assets', () => {
  it('ships og.png, favicon.svg, and apple-touch-icon.png', () => {
    expect(existsSync(path.join(root, 'dist/og.png'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/favicon.svg'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/apple-touch-icon.png'))).toBe(true);
    expect(existsSync(path.join(root, 'dist/photo.jpg'))).toBe(true);
  });
});

describe('Winmice product page', () => {
  it('is emitted at /Winmice/ with product SEO', () => {
    const { document } = parsePage('Winmice/index.html');
    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.querySelector('title')?.textContent).toBe(
      'WinMice for Mac — Windows-style autoscroll and mouse side buttons',
    );
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toContain('middle-click');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://anibalribeiro.cz/Winmice/');
    expect(
      document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    ).toContain('WinMice');
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('h1')?.textContent).toContain(
      'Windows-style mouse on Mac',
    );
  });

  it('embeds SoftwareApplication and FAQ JSON-LD', () => {
    const { document } = parsePage('Winmice/index.html');
    const raw = document.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);
    const nodes = data['@graph'] ?? [data];
    const app = nodes.find(
      (node: { '@type': string }) => node['@type'] === 'SoftwareApplication',
    );
    expect(app).toMatchObject({
      name: 'WinMice',
      operatingSystem: 'macOS',
      applicationCategory: 'UtilitiesApplication',
    });
    expect(app.downloadUrl).toContain('github.com/anibalribeiro/WinMice');
    const faq = nodes.find(
      (node: { '@type': string }) => node['@type'] === 'FAQPage',
    );
    expect(faq?.mainEntity?.length).toBeGreaterThanOrEqual(3);
  });

  it('has download, Homebrew, and screenshot content', () => {
    const { document, html } = parsePage('Winmice/index.html');
    expect(
      document.querySelector(
        'a[href="https://github.com/anibalribeiro/WinMice/releases/latest"]',
      ),
    ).toBeTruthy();
    expect(html).toContain('brew install --cask winmice');
    expect(html).toContain('Accessibility');
    const screenshots = [...document.querySelectorAll('img')].filter((img) =>
      (img.getAttribute('alt') ?? '').toLowerCase().includes('settings'),
    );
    expect(screenshots.length).toBeGreaterThanOrEqual(2);
    expect(document.querySelectorAll('script[type="module"]')).toHaveLength(0);
  });

  it('keeps the product icon and macOS utility badge in one aligned row', () => {
    const { document } = parsePage('Winmice/index.html');
    const brand = document.querySelector('.product-hero .product-brand');
    expect(brand).toBeTruthy();
    expect(brand?.querySelector('img[alt="WinMice icon"]')).toBeTruthy();
    expect(brand?.textContent).toContain('macOS utility');
  });

  it('styles the hero Homebrew control as a download button', () => {
    const { document } = parsePage('Winmice/index.html');
    const homebrew = [...document.querySelectorAll('.cta-row a')].find(
      (el) => el.textContent?.trim() === 'Homebrew',
    );
    expect(homebrew?.classList.contains('download')).toBe(true);
    expect(homebrew?.getAttribute('href')).toBe('#install');
  });

  it('states the v1.1.0 download size instead of the stale 600 KB claim', () => {
    const { html } = parsePage('Winmice/index.html');
    expect(html).not.toContain('600 KB');
    expect(html).toContain('1.7 MB');
  });

  it('pairs each feature-grid behavior with its own Settings pane', () => {
    const { document } = parsePage('Winmice/index.html');
    const alts = [...document.querySelectorAll('.feature-grid img')].map((img) =>
      img.getAttribute('alt'),
    );
    expect(alts).toContain('WinMice Settings, Scrolling pane');
    expect(alts).toContain('WinMice Settings, Back & Forward pane');
  });

  it('publishes the General and Permissions panes but not About', () => {
    const { document } = parsePage('Winmice/index.html');
    const alts = [...document.querySelectorAll('img')].map((img) =>
      img.getAttribute('alt'),
    );
    expect(alts).toContain('WinMice Settings, General pane');
    expect(alts).toContain('WinMice Settings, Permissions pane');
    expect(alts).not.toContain('WinMice Settings, About pane');
  });

  it('collapses every screenshot behind a click-to-expand thumbnail', () => {
    const { document } = parsePage('Winmice/index.html');
    const shots = [...document.querySelectorAll('.feature-grid details.shot')];
    expect(shots).toHaveLength(4);

    for (const shot of shots) {
      const summary = shot.querySelector('summary');
      expect(summary).toBeTruthy();
      expect(summary!.querySelector('img')?.getAttribute('width')).toBe('280');
      expect(summary!.textContent).toMatch(/enlarge/i);

      // The hint has to stop saying "enlarge" once the pane is already open.
      expect(summary!.querySelector('.hint-expand')).toBeTruthy();
      expect(summary!.querySelector('.hint-collapse')?.textContent).toMatch(
        /collapse/i,
      );

      // The full image sits outside the summary, so it is only fetched on open.
      const full = [...shot.querySelectorAll('img')].filter(
        (img) => !summary!.contains(img),
      );
      expect(full).toHaveLength(1);
      expect(full[0].getAttribute('width')).toBe('640');
    }

    // Expanding must stay a pure HTML/CSS affordance.
    expect(document.querySelectorAll('script[type="module"]')).toHaveLength(0);
  });

  it('serves screenshots at native window size with a 2x Retina candidate', () => {
    const { document } = parsePage('Winmice/index.html');
    const shots = [...document.querySelectorAll('img')].filter((img) =>
      (img.getAttribute('alt') ?? '').includes('Settings,'),
    );
    expect(shots).toHaveLength(4);
    for (const shot of shots) {
      expect(Number(shot.getAttribute('width'))).toBe(640);
      expect(Number(shot.getAttribute('height'))).toBe(680);
      expect(shot.getAttribute('srcset')).toMatch(/\s2x(,|$)/);
    }
  });

  it('documents reverse scrolling and in-app updates from v1.1.0', () => {
    const { html } = parsePage('Winmice/index.html');
    expect(html).toContain('Reverse vertical');
    expect(html).toContain('Reverse horizontal');
    expect(html).toContain('brew upgrade --cask winmice');
    expect(html).toMatch(/checks? (for updates )?once a day/i);
  });

  it('points Open Graph at the regenerated 1200x630 card', () => {
    const { document } = parsePage('Winmice/index.html');
    const prop = (p: string) =>
      document.querySelector(`meta[property="${p}"]`)?.getAttribute('content');
    expect(prop('og:image')).toBe('https://anibalribeiro.cz/winmice-og.jpg');
    expect(prop('og:image:width')).toBe('1200');
    expect(prop('og:image:height')).toBe('630');
  });

  it('keeps a space where prose runs into inline emphasis or code', () => {
    const { html } = parsePage('Winmice/index.html');
    // Astro collapses a newline-plus-indent before an inline element to
    // nothing, silently gluing words together ("orReverse horizontal").
    const glued = html.match(
      /[a-zA-Z,)]<(?:em|strong|code)[ >]|<\/(?:em|strong|code)>[a-zA-Z(]/g,
    );
    expect(glued).toBeNull();
  });

  it('carries the expanded FAQ set into JSON-LD', () => {
    const { document } = parsePage('Winmice/index.html');
    const raw = document.querySelector(
      'script[type="application/ld+json"]',
    )?.textContent;
    const nodes = JSON.parse(raw!)['@graph'];
    const faq = nodes.find(
      (node: { '@type': string }) => node['@type'] === 'FAQPage',
    );
    const questions = faq.mainEntity.map((entry: { name: string }) => entry.name);
    expect(questions).toHaveLength(8);
    expect(questions).toContain(
      'Does macOS have Windows-style autoscroll built in?',
    );
    expect(questions).toContain('Is WinMice a Windows program?');
  });
});


