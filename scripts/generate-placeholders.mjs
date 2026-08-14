import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

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

// #1e3a5f — solid navy OG + apple-touch (ImageMagick unavailable for text overlay)
writePpm('/tmp/og.ppm', 1200, 630, 0x1e, 0x3a, 0x5f);
execFileSync('sips', ['-s', 'format', 'png', '/tmp/og.ppm', '--out', 'public/og.png']);
writePpm('/tmp/icon.ppm', 180, 180, 0x1e, 0x3a, 0x5f);
execFileSync('sips', ['-s', 'format', 'png', '/tmp/icon.ppm', '--out', 'public/apple-touch-icon.png']);
