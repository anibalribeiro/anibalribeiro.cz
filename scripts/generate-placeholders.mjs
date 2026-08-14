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
