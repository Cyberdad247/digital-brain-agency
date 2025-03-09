import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(
  __dirname,
  '../public/lovable-uploads/eaecd866-2c98-451b-bc04-52404085afe5.png'
);
const outputPath = path.join(__dirname, '../public/lovable-uploads/hero-bg.webp');

sharp(inputPath)
  .webp({ quality: 80 })
  .toFile(outputPath)
  .then(() => console.log('Image converted successfully'))
  .catch((err) => console.error('Error converting image:', err));
