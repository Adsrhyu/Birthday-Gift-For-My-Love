import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function deployAllCleanAssets() {
  const masterHeartPath = 'test_hd_clean_heart.png';

  // 1. Copy to public/heart_lace_hd.png and public/heart_lace_user.png
  fs.copyFileSync(masterHeartPath, 'public/heart_lace_hd.png');
  fs.copyFileSync(masterHeartPath, 'public/heart_lace_user.png');
  console.log('Updated public/heart_lace_hd.png and heart_lace_user.png');

  // 2. Generate square icons with generous padding and royal blue background (#0d2353)
  // 512x512
  const heart512 = await sharp(masterHeartPath).resize(430, 423, { fit: 'contain' }).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 13, g: 35, b: 83, alpha: 1 }
    }
  })
  .composite([{ input: heart512, gravity: 'center' }])
  .png()
  .toFile('public/icon-512.png');

  // 192x192
  const heart192 = await sharp(masterHeartPath).resize(162, 159, { fit: 'contain' }).toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 13, g: 35, b: 83, alpha: 1 }
    }
  })
  .composite([{ input: heart192, gravity: 'center' }])
  .png()
  .toFile('public/icon-192.png');

  // apple-touch-icon.png (180x180)
  const heart180 = await sharp(masterHeartPath).resize(152, 149, { fit: 'contain' }).toBuffer();
  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 13, g: 35, b: 83, alpha: 1 }
    }
  })
  .composite([{ input: heart180, gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png');

  // icon.png (512x512)
  fs.copyFileSync('public/icon-512.png', 'public/icon.png');

  // 3. Generate og-image.png (1200x630) for link preview
  const heartOg = await sharp(masterHeartPath).resize(480, 472, { fit: 'contain' }).toBuffer();
  
  // Create gorgeous card SVG with typography
  const textSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#07142e" />
          <stop offset="50%" stop-color="#0c2354" />
          <stop offset="100%" stop-color="#081836" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)" />
      
      <!-- Sparkles / stars -->
      <polygon points="120,90 123,98 131,101 123,104 120,112 117,104 109,101 117,98" fill="#ffd700" opacity="0.8" />
      <polygon points="480,140 482,146 488,148 482,150 480,156 478,150 472,148 478,146" fill="#ffffff" opacity="0.8" />
      <polygon points="180,500 182,506 188,508 182,510 180,516 178,510 172,508 178,506" fill="#ffd700" opacity="0.8" />
      <polygon points="1100,100 1102,106 1108,108 1102,110 1100,116 1098,110 1092,108 1098,106" fill="#ffffff" opacity="0.8" />
      <polygon points="1060,520 1063,528 1071,531 1063,534 1060,542 1057,534 1049,531 1057,528" fill="#ffd700" opacity="0.8" />

      <!-- Left Text -->
      <text x="110" y="240" font-family="'Outfit', -apple-system, sans-serif" font-weight="800" font-size="64" fill="#ffffff" letter-spacing="-1">Happy Birthday,</text>
      <text x="110" y="325" font-family="'Outfit', -apple-system, sans-serif" font-weight="900" font-size="76" fill="#fcd34d" letter-spacing="-1">My Love Ryan!</text>
      <text x="110" y="405" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-size="34" fill="#93c5fd">A special gift for a very special person ✨</text>
    </svg>
  `;

  await sharp(Buffer.from(textSvg))
    .composite([{
      input: heartOg,
      left: 680,
      top: 79
    }])
    .png()
    .toFile('public/og-image.png');

  console.log('All public assets successfully created & deployed!');
}

deployAllCleanAssets();
