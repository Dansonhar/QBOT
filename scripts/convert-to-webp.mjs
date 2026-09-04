import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, relative } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const QUALITY = 80;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findImages(full));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function convert() {
  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to convert`);

  let saved = 0;
  for (const img of images) {
    const webpPath = img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const rel = relative(PUBLIC_DIR, img);

    try {
      const origStat = await stat(img);

      // Check if webp already exists and is newer
      try {
        const webpStat = await stat(webpPath);
        if (webpStat.mtimeMs > origStat.mtimeMs) {
          continue; // Skip, already converted
        }
      } catch {}

      await sharp(img)
        .webp({ quality: QUALITY })
        .toFile(webpPath);

      const webpStat = await stat(webpPath);
      const reduction = ((1 - webpStat.size / origStat.size) * 100).toFixed(0);
      saved += origStat.size - webpStat.size;
      console.log(`✓ ${rel} → .webp (${reduction}% smaller)`);
    } catch (err) {
      console.error(`✗ ${rel}: ${err.message}`);
    }
  }

  console.log(`\nTotal saved: ${(saved / 1024 / 1024).toFixed(1)} MB`);
}

convert();
