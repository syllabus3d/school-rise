import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');
const iconSvgPath = path.join(publicDir, 'icon.svg');
const svgContent = fs.readFileSync(iconSvgPath, 'utf8');

function renderSvgToPng(svg, width, height) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: width,
    },
    shapeRendering: 2, // geometricPrecision
    textRendering: 1, // optimizeLegibility
    imageRendering: 1,
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

console.log('Generating PWA and website icon assets from icon.svg...');

// 1. pwa-512x512.png
const png512 = renderSvgToPng(svgContent, 512, 512);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);
console.log('✓ Created public/pwa-512x512.png');

// 2. pwa-192x192.png
const png192 = renderSvgToPng(svgContent, 192, 192);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);
console.log('✓ Created public/pwa-192x192.png');

// 3. apple-touch-icon.png (180x180)
const appleTouchPng = renderSvgToPng(svgContent, 180, 180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchPng);
console.log('✓ Created public/apple-touch-icon.png');

// 4. favicon-32x32.png
const favicon32 = renderSvgToPng(svgContent, 32, 32);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), favicon32);
console.log('✓ Created public/favicon-32x32.png');

// 5. favicon.ico (copy 32x32 png as favicon.ico for browser compatibility)
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);
console.log('✓ Created public/favicon.ico');

// 6. pwa-maskable-512x512.png with safe padding (80% scale centered)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="maskableDarkBg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#1A202C" />
      <stop offset="60%" stop-color="#0B0E14" />
      <stop offset="100%" stop-color="#030407" />
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#maskableDarkBg)" />
  <g transform="translate(51, 51) scale(0.8)">
    ${svgContent.replace(/<\?xml.*?\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
  </g>
</svg>`;

const maskablePng = renderSvgToPng(maskableSvg, 512, 512);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), maskablePng);
console.log('✓ Created public/pwa-maskable-512x512.png');

console.log('All PWA and browser icon assets generated successfully!');
