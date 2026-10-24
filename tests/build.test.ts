import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSite, parseIndex, parsePage, readDist } from './helpers/build';
import { pokeBattle } from '../src/data/pokeBattle';

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
      'Software engineering manager. Side projects: Translate Pro for Brave, a customizable in-page translator; WinMice, a native macOS mouse utility; and Fenix Runner, a customizable watch face for Garmin watches.',
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
        'https://anibalribeiro.cz/FenixRunner/',
        'https://anibalribeiro.cz/FenixRunner/privacy/',
        'https://anibalribeiro.cz/FenixRunner/terms/',
        'https://anibalribeiro.cz/terms/',
        'https://anibalribeiro.cz/privacy/',
        'https://anibalribeiro.cz/ridge/',
        'https://anibalribeiro.cz/pulse/',
        'https://anibalribeiro.cz/daylight/',
        'https://anibalribeiro.cz/aurora/',
        'https://anibalribeiro.cz/football-live/',
      ]),
    );
    // The noindex buy page is deliberately left out.
    expect(locs).toHaveLength(15);
  });
});

describe('header', () => {
  it('exposes Apps I made, CV, and Contact jump links', () => {
    const { document } = parseIndex();
    const header = document.querySelector('header');
    expect(header).toBeTruthy();
    expect(header?.querySelector('nav')).toBeTruthy();
    expect(header?.querySelector('a[href="#work"]')?.textContent).toBe('Apps I made');
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
  it('renders all nine projects as h3s under #work', () => {
    const { document } = parseIndex();
    const work = document.querySelector('#work');
    expect(work).toBeTruthy();
    expect(work?.querySelector('h2')?.textContent).toBe('Apps I made');
    const titles = [...work!.querySelectorAll('h3')].map((el) => el.textContent);
    expect(titles).toEqual(['Translate Pro for Brave', 'WinMice', 'Football Live', 'Poke Battle', 'Fenix Runner', 'Ridge', 'Pulse', 'Daylight', 'Aurora']);
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
    expect(articles).toHaveLength(9);

    const alts = articles.map((article) => article.querySelector('img')?.getAttribute('alt'));
    expect(alts).toEqual([
      'Translate Pro for Brave icon',
      'WinMice icon',
      'Football Live icon',
      'Poke Battle icon',
      'Fenix Runner icon',
      'Ridge icon',
      'Pulse icon',
      'Daylight icon',
      'Aurora icon',
    ]);

    for (const article of articles) {
      const img = article.querySelector('img');
      expect(img?.getAttribute('width')).toBe('48');
      expect(img?.getAttribute('height')).toBe('48');
      expect(img?.getAttribute('src')).toMatch(/\.(png|webp|jpg|svg)/i);
    }
  });
});

describe('cv', () => {
  it('exposes the CV link when available', () => {
    const { document, html } = parseIndex();
    const cv = document.querySelector('#cv');
    expect(cv?.querySelector('h2')?.textContent).toBe('CV');
    expect(cv?.querySelector('a[href="/cv/"]')).not.toBeNull();
    expect(html).toContain('href="/cv/"');
    const viewLink = cv?.querySelector('a[href="/cv/"]');
    expect(viewLink?.textContent).toContain('View CV');
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

  it('documents in-app updates from v1.1.0', () => {
    const { html } = parsePage('Winmice/index.html');
    expect(html).toContain('brew upgrade --cask winmice');
    expect(html).toMatch(/checks? (for updates )?once a day/i);
  });

  it('reduces feature cards to a title and a screenshot', () => {
    const { document } = parsePage('Winmice/index.html');
    const cards = [...document.querySelectorAll('.feature-grid article')];
    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(card.querySelector('h3')?.textContent?.trim()).toBeTruthy();
      expect(card.querySelector('details.shot')).not.toBeNull();
      // Only the expand/collapse hints remain as text outside the heading.
      expect(card.querySelectorAll('p')).toHaveLength(0);
    }
  });

  it('drops the No Electron claim from the lede', () => {
    const { document } = parsePage('Winmice/index.html');
    const lede = document.querySelector('.lede')?.textContent ?? '';
    expect(lede).not.toMatch(/No Electron/i);
    expect(lede).toContain('1.7 MB');
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
    expect(questions).toHaveLength(5);
    expect(questions).toContain(
      'Does macOS support Windows-style autoscroll or mouse side buttons natively?',
    );
    expect(questions).toContain('Does WinMice update itself?');
    expect(questions).toContain(
      'Is WinMice an AutoScroll or Sensible Side Buttons alternative?',
    );
  });

  it('states the update policy once instead of in prose and the FAQ both', () => {
    const { html } = parsePage('Winmice/index.html');
    // The JSON-LD copy of the answer is intentional, so only count rendered prose.
    const prose = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '');
    expect(prose.match(/once a day/g)).toHaveLength(1);
  });

  it('keeps the visible copy tight', () => {
    const { html } = parsePage('Winmice/index.html');
    const article = html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/g, '')
      .match(/<article class="product">([\s\S]*?)<p class="product-links"/)![1]
      // Collapsed panels are not part of the on-load reading load.
      .replace(/<details[\s\S]*?<\/details>/g, '');
    const words = article
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w));
    expect(words.length).toBeLessThan(220);
  });
});

const workerOrigin = 'https://er.anibalcatheringer.workers.dev';

describe('Fenix Runner product page', () => {
  it('is emitted at /FenixRunner/ with product SEO and JSON-LD', () => {
    const { document } = parsePage('FenixRunner/index.html');
    expect(document.querySelector('title')?.textContent).toBe(
      'Fenix Runner — a customizable watch face for Garmin (Connect IQ)',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://anibalribeiro.cz/FenixRunner/',
    );
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    const data = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')!.textContent!,
    );
    const app = data['@graph'].find((n: { '@type': string }) => n['@type'] === 'SoftwareApplication');
    expect(app).toMatchObject({ name: 'Fenix Runner', operatingSystem: 'Garmin Connect IQ' });
    expect(app.offers.price).toBe('3.00');
  });

  it('shows the cropped hero banner without the old product name baked in', () => {
    const { document } = parsePage('FenixRunner/index.html');
    const img = document.querySelector('figure.hero-banner img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('alt')).toContain('Fenix Runner');
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://anibalribeiro.cz/fenix-runner-og.jpg',
    );
  });

  it('sends the hero CTA to the unlock page and links the legal pages', () => {
    const { document } = parsePage('FenixRunner/index.html');
    const cta = document.querySelector('.product-hero a.download[href="/FenixRunner/buy/"]');
    expect(cta?.textContent).toContain('$3.00');
    expect(document.querySelector('a[href="/FenixRunner/privacy/"]')).toBeTruthy();
    expect(document.querySelector('a[href="/FenixRunner/terms/"]')).toBeTruthy();
  });
});

describe('Fenix Runner legal pages', () => {
  it.each([
    ['FenixRunner/privacy/index.html', 'Fenix Runner — Privacy Policy'],
    ['FenixRunner/terms/index.html', 'Fenix Runner — Terms of Service'],
  ])('%s is indexable, titled and has one h1', (file, title) => {
    const { document } = parsePage(file);
    expect(document.querySelector('title')?.textContent).toBe(title);
    expect(document.querySelector('h1')?.textContent).toBe(title);
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index, follow',
    );
  });

  it('name Creem as merchant of record and link the two policies together', () => {
    const terms = parsePage('FenixRunner/terms/index.html').document;
    const privacy = parsePage('FenixRunner/privacy/index.html').document;
    expect(terms.body.textContent).toContain('merchant of record');
    expect(privacy.body.textContent).toContain('merchant of record');
    expect(terms.querySelector('a[href="/FenixRunner/privacy/"]')).toBeTruthy();
    expect(privacy.querySelector('a[href="/FenixRunner/terms/"]')).toBeTruthy();
  });

  it('are linked from the product page', () => {
    const { document } = parsePage('FenixRunner/index.html');
    expect(document.querySelector('a[href="/FenixRunner/privacy/"]')).toBeTruthy();
    expect(document.querySelector('a[href="/FenixRunner/terms/"]')).toBeTruthy();
    expect(document.querySelector('a[href="/FenixRunner/buy/"]')).toBeTruthy();
  });
});

describe('Fenix Runner buy page', () => {
  it('is noindex and posts a Device Code to the licence Worker without scripts', () => {
    const { document } = parsePage('FenixRunner/buy/index.html');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    );
    const form = document.querySelector('form.buy-form');
    expect(form?.getAttribute('method')).toBe('get');
    expect(form?.getAttribute('action')).toBe(`${workerOrigin}/u`);
    expect(form?.querySelector('input[name="d"]')?.hasAttribute('required')).toBe(true);
    expect(document.querySelectorAll('script:not([type="application/ld+json"])')).toHaveLength(0);
  });
});

describe('purchase redirect rules', () => {
  const htaccess = readFileSync(path.join(root, 'public/.htaccess'), 'utf8');

  it('forward a Device Code to the Worker checkout with a temporary redirect', () => {
    expect(htaccess).toContain(`${workerOrigin}/u?d=%1`);
    expect(htaccess).toMatch(/RewriteRule \^\(\?:buy\|FenixRunner\/buy\)\/\?\$ .* \[R=302,L,QSD\]/);
  });

  it('send /buy without a code to the form page', () => {
    expect(htaccess).toMatch(/RewriteRule \^buy\/\?\$ \/FenixRunner\/buy\/ \[R=302,L\]/);
  });
});


describe('Poke Battle pages', () => {
  it('publishes the product page with three store buttons, the price and legal and support links', () => {
    const { document } = parsePage('pokebattle/index.html');
    expect(document.querySelector('h1')?.textContent).toBe('Poke Battle');
    const tags = [...document.querySelectorAll('.platform-tags .badge')].map((tag) => tag.textContent);
    expect(tags).toEqual(expect.arrayContaining(['Garmin', 'Zepp OS', 'Apple Watch']));
    const cta = document.querySelector('.product-hero .cta-row');
    expect(cta?.textContent).toContain('$4.00 USD');
    const garmin = cta?.querySelector('a.download');
    expect(garmin?.textContent?.trim()).toBe('Garmin Store');
    expect(cta?.querySelectorAll('.download svg.store-icon')).toHaveLength(3);
    expect(document.querySelector('header nav a[href="/Winmice/"]')).toBeNull();
    expect(document.querySelector('header nav a[href="/FenixRunner/"]')).toBeNull();
    expect(garmin?.getAttribute('href')).toBe('https://apps.garmin.com/apps/2170cdb5-233a-4f64-9ee7-8b17967438c2');
    const soon = [...(cta?.querySelectorAll('button.download[disabled]') ?? [])].map((button) => button.textContent);
    expect(soon.map((label) => label?.trim())).toEqual(['Zepp OS · Coming soon', 'App Store · Coming soon']);
    expect(document.querySelector('#purchase-heading')?.parentElement?.textContent).toContain('$4.00 USD');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://anibalribeiro.cz/pokebattle/');
    for (const slug of ['privacy', 'terms', 'support']) {
      expect(document.querySelector(`a[href="/pokebattle/${slug}/"]`)).toBeTruthy();
      expect(readDist(`pokebattle/${slug}/index.html`)).toContain('<h1');
    }
    expect(document.querySelectorAll('.feature-grid details.shot')).toHaveLength(4);
    expect(document.querySelector('a[href*="workers.dev"]')).toBeNull();
  });

  it('explains the Zepp OS trial and the one-time Creem activation', () => {
    const { document } = parsePage('pokebattle/index.html');
    const purchase = document.querySelector('#purchase-heading')?.parentElement?.textContent ?? '';
    expect(purchase).toContain('3 New Battles a day');
    expect(purchase).toContain('through Creem');
    expect(purchase).toContain('licence key');
    const offer = document.querySelector('.offer');
    expect(offer?.querySelector('h3')?.textContent).toContain('Full Version for Zepp OS');
    expect(offer?.textContent).toContain('$4.00 USD');
    expect(offer?.textContent).toContain('lifetime licence');
    expect(offer?.textContent).toContain("What's included");
    const creem = document.querySelector('#purchase-heading')?.parentElement?.querySelector('a[href*="creem.io"]');
    expect(creem?.getAttribute('href') ?? null).toBe(pokeBattle.zeppCheckoutUrl);
  });

  it('keeps privacy relevant to both apps and discloses Creem separately', () => {
    const { document } = parsePage('pokebattle/privacy/index.html');
    expect(document.body.textContent).toContain('Apple Watch');
    expect(document.body.textContent).toContain('Garmin');
    expect(document.body.textContent).toContain('merchant of record');
    expect(document.querySelector('a[href="https://www.creem.io/privacy"]')).toBeTruthy();
    expect(document.body.textContent).toContain('Zepp OS licence activation');
    expect(document.body.textContent).not.toContain('no device-code unlock server');
    expect(document.querySelector('a[href="/pokebattle/terms/"]')).toBeTruthy();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://anibalribeiro.cz/pokebattle/privacy/');
  });

  it('provides purchase terms for the Zepp OS trial and Creem activation', () => {
    const { document } = parsePage('pokebattle/terms/index.html');
    expect(document.body.textContent).toContain('3 New Battles a day');
    expect(document.body.textContent).toContain('licence key is deactivated');
    expect(document.body.textContent).toContain('Refunds and consumer rights');
    expect(document.querySelector('a[href="https://www.creem.io/buyer-terms"]')).toBeTruthy();
    expect(document.querySelector('a[href="/pokebattle/privacy/"]')).toBeTruthy();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://anibalribeiro.cz/pokebattle/terms/');
  });

  it('includes the product and legal pages in the sitemap and links from the homepage', () => {
    const sitemap = readDist('sitemap-0.xml');
    for (const route of ['pokebattle/', 'pokebattle/privacy/', 'pokebattle/terms/']) {
      expect(sitemap).toContain(`https://anibalribeiro.cz/${route}`);
    }
    expect(parseIndex().document.querySelector('#work a[href="/pokebattle/"]')).toBeTruthy();
  });
});


describe('Store-wide legal pages', () => {
  it.each([
    ['privacy/index.html', 'Privacy Policy', 'https://anibalribeiro.cz/privacy/', '/terms/'],
    ['terms/index.html', 'Terms of Service', 'https://anibalribeiro.cz/terms/', '/privacy/'],
  ])('publishes %s for the Creem shop', (file, heading, canonical, other) => {
    const { document } = parsePage(file);
    expect(document.querySelector('h1')?.textContent).toBe(heading);
    expect(document.body.textContent).toContain('merchant of record');
    expect(document.querySelector('a[href="https://www.creem.io/buyer-terms"]')).toBeTruthy();
    expect(document.querySelector(`.product-links a[href="${other}"]`)).toBeTruthy();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(canonical);
  });

  it('links both pages from the site footer', () => {
    const { document } = parseIndex();
    expect(document.querySelector('footer a[href="/terms/"]')).toBeTruthy();
    expect(document.querySelector('footer a[href="/privacy/"]')).toBeTruthy();
  });
});


describe('Garmin app pages', () => {
  const apps = [
    ['ridge', 'Ridge', 'e3617d06-8329-4dbb-936a-9565a0b3d72b', '2.99', 6],
    ['pulse', 'Pulse', 'c8f95bf2-583f-4228-aac2-0c9b3b85c40b', '2.99', 6],
    ['daylight', 'Daylight', 'c788e9e3-b158-4cb3-9d17-b444c687e861', '2.99', 8],
    ['aurora', 'Aurora', '2a9eb91a-6c1e-49bf-87d9-16df3e68afeb', '2.99', 7],
    ['football-live', 'Football Live', '275bac70-c30f-429e-a6ea-cadd9d53d5ee', '4.49', 8],
  ] as const;

  it.each(apps)('publishes /%s/ with its store link, price and screenshots', (slug, name, storeId, price, shots) => {
    const { document } = parsePage(`${slug}/index.html`);
    expect(document.querySelector('h1')?.textContent).toBe(name);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`https://anibalribeiro.cz/${slug}/`);
    expect(document.querySelector(`a[href="https://apps.garmin.com/apps/${storeId}"]`)).toBeTruthy();
    expect(document.querySelector('.cta-row')?.textContent).toContain(`$${price}`);
    expect(document.querySelectorAll('.feature-grid details.shot')).toHaveLength(shots);
    expect(document.querySelector('.product-links a[href="/terms/"]')).toBeTruthy();
    expect(document.querySelector('.product-links a[href="/privacy/"]')).toBeTruthy();
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toContain('SoftwareApplication');
  });

  it('links every app page from the homepage', () => {
    const { document } = parseIndex();
    for (const [slug] of apps) {
      expect(document.querySelector(`#work a[href="/${slug}/"]`)).toBeTruthy();
    }
  });

  it('keeps the watch faces and the data-driven Football Live disclosures distinct', () => {
    expect(parsePage('ridge/index.html').document.body.textContent).toContain('refunded within 48 hours');
    const football = parsePage('football-live/index.html').document.body.textContent ?? '';
    expect(football).toContain('Do not use it for betting');
    expect(football).toContain('favourite team codes');
  });
});
