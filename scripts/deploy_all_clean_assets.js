import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function deployAllCleanAssets() {
  const framePath = 'scripts/vintage_frame_raw.jpg';
  // NEWEST photo — user explicitly said "fotonya tetap jang terbaru, jangan ganti"
  const userPhotoPath = 'C:/Users/asusa/.gemini/antigravity-ide/brain/ecd504f4-b401-4ddc-9cb8-dd37e220ef74/.user_uploaded/media_1790323812952.png';

  const { data: rawData, info } = await sharp(framePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // 1. Create perfectly symmetrical frame data mirrored across heart axis (x = 497)
  const axis = 497;
  const frameData = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 3;
      let srcX = x;
      if (x > axis) {
        srcX = axis - (x - axis);
      }
      if (srcX < 0) srcX = 0;
      const sidx = (y * w + srcX) * 3;
      frameData[idx] = rawData[sidx];
      frameData[idx + 1] = rawData[sidx + 1];
      frameData[idx + 2] = rawData[sidx + 2];
    }
  }

  // 2. Outside flood fill from corners:
  const isOutside = new Uint8Array(w * h);
  const queueOut = [0, w - 1, (h - 1) * w, (h - 1) * w + (w - 1)];
  for (const q of queueOut) isOutside[q] = 1;

  while (queueOut.length > 0) {
    const curr = queueOut.pop();
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!isOutside[nidx]) {
          const r = frameData[nidx * 3];
          const g = frameData[nidx * 3 + 1];
          const b = frameData[nidx * 3 + 2];
          const brightness = (r + g + b) / 3;
          if (brightness < 45) {
            isOutside[nidx] = 1;
            queueOut.push(nidx);
          }
        }
      }
    }
  }

  // 3. Inside flood fill from center (512, 512)
  const isInside = new Uint8Array(w * h);
  const centerIdx = 512 * w + 512;
  const queueIn = [centerIdx];
  isInside[centerIdx] = 1;

  while (queueIn.length > 0) {
    const curr = queueIn.pop();
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!isInside[nidx] && !isOutside[nidx]) {
          const r = frameData[nidx * 3];
          const g = frameData[nidx * 3 + 1];
          const b = frameData[nidx * 3 + 2];
          const brightness = (r + g + b) / 3;
          if (brightness < 45) {
            isInside[nidx] = 1;
            queueIn.push(nidx);
          }
        }
      }
    }
  }

  // 4. Read and crop user photo to fit heart shape
  const photo = await sharp(userPhotoPath)
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const out = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const fidx = (y * w + x) * 3;
      const pixelIndex = y * w + x;

      if (isOutside[pixelIndex]) {
        // Transparent outside
        out[idx] = 0;
        out[idx + 1] = 0;
        out[idx + 2] = 0;
        out[idx + 3] = 0;
        continue;
      }

      if (isInside[pixelIndex]) {
        // Photo visible inside
        out[idx] = photo[idx];
        out[idx + 1] = photo[idx + 1];
        out[idx + 2] = photo[idx + 2];
        out[idx + 3] = 255;
        continue;
      }

      // LACE AREA — preserve original lace detail faithfully
      // Match reference: white scalloped outer border with visible dark lace details
      const r = frameData[fidx];
      const g = frameData[fidx + 1];
      const b = frameData[fidx + 2];
      const brightness = (r + g + b) / 3;

      // Keep original lace tones — white stays white, dark patterns stay dark
      // This matches the reference which shows clear black/dark lace detail inside white scallops
      out[idx] = r;
      out[idx + 1] = g;
      out[idx + 2] = b;
      out[idx + 3] = 255;
    }
  }

  // Generate Master HD Image (without bow — we'll composite bow on top)
  const masterNobow = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 5. Create Pink Bow SVG and composite on top center
  const bowWidth = Math.round(w * 0.16);
  const bowHeight = Math.round(bowWidth * 0.62);
  const bowSvg = `
    <svg width="${bowWidth}" height="${bowHeight}" viewBox="0 0 120 74" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bowLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F9B4C2"/>
          <stop offset="50%" stop-color="#F2A0B0"/>
          <stop offset="100%" stop-color="#E88DA0"/>
        </linearGradient>
        <linearGradient id="bowRight" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F9B4C2"/>
          <stop offset="50%" stop-color="#F2A0B0"/>
          <stop offset="100%" stop-color="#E88DA0"/>
        </linearGradient>
        <radialGradient id="bowKnot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#F2A0B0"/>
          <stop offset="100%" stop-color="#D88898"/>
        </radialGradient>
      </defs>
      <!-- Left loop -->
      <ellipse cx="36" cy="30" rx="32" ry="22" fill="url(#bowLeft)" transform="rotate(-12,36,30)"/>
      <!-- Right loop -->
      <ellipse cx="84" cy="30" rx="32" ry="22" fill="url(#bowRight)" transform="rotate(12,84,30)"/>
      <!-- Center knot -->
      <ellipse cx="60" cy="33" rx="12" ry="14" fill="url(#bowKnot)"/>
      <!-- Left ribbon tail -->
      <path d="M 48 42 C 38 58, 24 64, 18 72" stroke="#E88DA0" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- Right ribbon tail -->
      <path d="M 72 42 C 82 58, 96 64, 102 72" stroke="#E88DA0" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- Subtle highlight on left loop -->
      <ellipse cx="30" cy="24" rx="14" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(-15,30,24)"/>
      <!-- Subtle highlight on right loop -->
      <ellipse cx="90" cy="24" rx="14" ry="8" fill="rgba(255,255,255,0.2)" transform="rotate(15,90,24)"/>
    </svg>
  `;

  const bowPng = await sharp(Buffer.from(bowSvg))
    .png()
    .toBuffer();

  // Find the top center of the heart for bow placement
  // The heart's top dip is around y ~75-110 area, x centered around axis
  const bowLeft = Math.round(axis - bowWidth / 2);
  const bowTop = Math.round(h * 0.10); // Place at the heart's top dip, overlapping the lace

  const masterHeartPath = 'public/heart_lace_hd.png';
  await sharp(masterNobow)
    .composite([{
      input: bowPng,
      left: bowLeft,
      top: bowTop
    }])
    .png({ compressionLevel: 9 })
    .toFile(masterHeartPath);

  // Copy to other paths
  fs.copyFileSync(masterHeartPath, 'public/heart_lace_user.png');
  
  // Ensure cover directory exists
  if (!fs.existsSync('public/cover')) {
    fs.mkdirSync('public/cover', { recursive: true });
  }
  fs.copyFileSync(masterHeartPath, 'public/cover/heart_lace.png');
  fs.copyFileSync(masterHeartPath, 'public/cover/heart_lace_clean.png');
  console.log('Saved public/heart_lace_hd.png, heart_lace_user.png, cover/heart_lace.png');

  // Also copy to root for backward compatibility
  fs.copyFileSync(masterHeartPath, 'heart_lace_hd.png');
  fs.copyFileSync(masterHeartPath, 'heart_lace_user.png');

  // Square icons with generous padding and royal blue background (#0d2353)
  // 512x512
  const heart512 = await sharp(masterHeartPath).resize(430, 430, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
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
  const heart192 = await sharp(masterHeartPath).resize(162, 162, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
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
  const heart180 = await sharp(masterHeartPath).resize(152, 152, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
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

  // Generate og-image.png (1200x630) for link preview with royal blue gradient and typography
  const heartOg = await sharp(masterHeartPath).resize(480, 480, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  
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
      top: 75
    }])
    .png()
    .toFile('public/og-image.png');

  console.log('All public assets successfully created & deployed!');
}

deployAllCleanAssets();
