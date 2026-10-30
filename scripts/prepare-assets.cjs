// Pass SHARP_MODULE to use an already installed Sharp runtime, or install sharp locally.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const config = require('../asset-generation.json');
const output = path.resolve(__dirname, '../public/images');
(async () => {
  await fs.mkdir(output, { recursive: true });
  for (const [name, file] of Object.entries(config.files)) {
    const input = path.join(config.source, file);
    if (name === 'hero') {
      await sharp(input).resize({ width: 1600 }).webp({ quality: 86 }).toFile(path.join(output, 'hero.webp'));
      await sharp(input).resize({ width: 800 }).webp({ quality: 82 }).toFile(path.join(output, 'hero-800.webp'));
    } else {
      await sharp(input).resize({ width: 960 }).webp({ quality: 83 }).toFile(path.join(output, `${name}.webp`));
      await sharp(input).resize({ width: 480 }).webp({ quality: 80 }).toFile(path.join(output, `${name}-480.webp`));
    }
  }
  console.log(`Prepared ${Object.keys(config.files).length * 2} local responsive WebP assets.`);
})();
