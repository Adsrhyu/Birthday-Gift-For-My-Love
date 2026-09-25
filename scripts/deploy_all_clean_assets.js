import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function deployAllCleanAssets() {
  const framePath = 'scripts/pinterest_frame_orig.jpg';
  const photoPath = 'couple_main.jpg';

  console.log('Processing Pinterest frame and couple photo...');
  const { data: frameRaw, info } = await sharp(framePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 2400
  const h = info.height; // 2400

  function getB(idx) {
    return (frameRaw[idx * 3] + frameRaw[idx * 3 + 1] + frameRaw[idx * 3 + 2]) / 3;
  }

  // 1. Outside flood fill from all border pixels
  const isOutside = new Uint8Array(w * h);
  const queueOut = [];
  for (let x = 0; x < w; x++) {
    queueOut.push(x);
    queueOut.push((h - 1) * w + x);
    isOutside[x] = 1;
    isOutside[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    queueOut.push(y * w);
    queueOut.push(y * w + (w - 1));
    isOutside[y * w] = 1;
    isOutside[y * w + (w - 1)] = 1;
  }

  const initialThreshold = 45;
  let head = 0;
  while (head < queueOut.length) {
    const curr = queueOut[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cx + 1 < w ? curr + 1 : -1,
      cx - 1 >= 0 ? curr - 1 : -1,
      cy + 1 < h ? curr + w : -1,
      cy - 1 >= 0 ? curr - w : -1
    ];

    for (const nidx of neighbors) {
      if (nidx >= 0 && !isOutside[nidx]) {
        if (getB(nidx) < initialThreshold) {
          isOutside[nidx] = 1;
          queueOut.push(nidx);
        }
      }
    }
  }

  // 2. Expand outside slightly for boundary pixels < 95 brightness to eliminate dark fringe
  for (let pass = 0; pass < 2; pass++) {
    const toAdd = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (!isOutside[idx]) {
          const hasOut = isOutside[idx + 1] || isOutside[idx - 1] || isOutside[idx + w] || isOutside[idx - w];
          if (hasOut && getB(idx) < 95) {
            toAdd.push(idx);
          }
        }
      }
    }
    for (const idx of toAdd) isOutside[idx] = 1;
  }

  // 3. Inside flood fill from center (1200, 1200)
  const isInside = new Uint8Array(w * h);
  const queueIn = [1200 * w + 1200];
  isInside[1200 * w + 1200] = 1;
  head = 0;
  while (head < queueIn.length) {
    const curr = queueIn[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      cx + 1 < w ? curr + 1 : -1,
      cx - 1 >= 0 ? curr - 1 : -1,
      cy + 1 < h ? curr + w : -1,
      cy - 1 >= 0 ? curr - w : -1
    ];

    for (const nidx of neighbors) {
      if (nidx >= 0 && !isInside[nidx] && !isOutside[nidx]) {
        if (getB(nidx) < 22) {
          isInside[nidx] = 1;
          queueIn.push(nidx);
        }
      }
    }
  }

  // 4. Standalone pure transparent frame (without photo)
  const pureFrameBuf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const cidx = idx * 4;
      const fidx = idx * 3;

      if (isOutside[idx] || isInside[idx]) {
        pureFrameBuf[cidx] = 0;
        pureFrameBuf[cidx + 1] = 0;
        pureFrameBuf[cidx + 2] = 0;
        pureFrameBuf[cidx + 3] = 0;
        continue;
      }

      const nearOut = (x > 0 && isOutside[idx - 1]) || 
                      (x < w - 1 && isOutside[idx + 1]) || 
                      (y > 0 && isOutside[idx - w]) || 
                      (y < h - 1 && isOutside[idx + w]);

      const fr = frameRaw[fidx];
      const fg = frameRaw[fidx + 1];
      const fb = frameRaw[fidx + 2];
      const b = (fr + fg + fb) / 3;

      if (nearOut && b < 160) {
        const alphaNorm = Math.min(1.0, Math.max(0.0, (b - 80) / (160 - 80)));
        pureFrameBuf[cidx] = Math.round(fr * (1 - alphaNorm) + 245 * alphaNorm);
        pureFrameBuf[cidx + 1] = Math.round(fg * (1 - alphaNorm) + 245 * alphaNorm);
        pureFrameBuf[cidx + 2] = Math.round(fb * (1 - alphaNorm) + 248 * alphaNorm);
        pureFrameBuf[cidx + 3] = Math.round(alphaNorm * 255);
      } else {
        pureFrameBuf[cidx] = fr;
        pureFrameBuf[cidx + 1] = fg;
        pureFrameBuf[cidx + 2] = fb;
        pureFrameBuf[cidx + 3] = 255;
      }
    }
  }

  // 5. Crop and scale couple photo to fit heart opening
  // couple_main.jpg is 864 x 1152
  const photoCropped = await sharp(photoPath)
    .extract({ left: 0, top: 110, width: 864, height: 864 })
    .resize(1540, 1540, { fit: 'fill' })
    .raw()
    .toBuffer();

  const photoW = 1540;
  const photoH = 1540;
  const photoX = Math.round(1175 - photoW / 2);
  const photoY = Math.round(1330 - photoH / 2);

  const compositeBuf = Buffer.alloc(w * h * 4);

  // Fill photo canvas
  for (let py = 0; py < photoH; py++) {
    for (let px = 0; px < photoW; px++) {
      const targetX = photoX + px;
      const targetY = photoY + py;
      if (targetX >= 0 && targetX < w && targetY >= 0 && targetY < h) {
        const cidx = (targetY * w + targetX) * 4;
        const pidx = (py * photoW + px) * 3;
        compositeBuf[cidx] = photoCropped[pidx];
        compositeBuf[cidx + 1] = photoCropped[pidx + 1];
        compositeBuf[cidx + 2] = photoCropped[pidx + 2];
        compositeBuf[cidx + 3] = 255;
      }
    }
  }

  // Composite frame on top of photo
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const cidx = idx * 4;
      const fidx = idx * 3;

      if (isOutside[idx]) {
        compositeBuf[cidx] = 0;
        compositeBuf[cidx + 1] = 0;
        compositeBuf[cidx + 2] = 0;
        compositeBuf[cidx + 3] = 0;
        continue;
      }

      if (isInside[idx]) {
        // Just the photo
        continue;
      }

      const nearOut = (x > 0 && isOutside[idx - 1]) || 
                      (x < w - 1 && isOutside[idx + 1]) || 
                      (y > 0 && isOutside[idx - w]) || 
                      (y < h - 1 && isOutside[idx + w]);

      const fr = frameRaw[fidx];
      const fg = frameRaw[fidx + 1];
      const fb = frameRaw[fidx + 2];
      const b = (fr + fg + fb) / 3;

      if (nearOut && b < 160) {
        const alphaNorm = Math.min(1.0, Math.max(0.0, (b - 80) / (160 - 80)));
        compositeBuf[cidx] = Math.round(fr * (1 - alphaNorm) + 245 * alphaNorm);
        compositeBuf[cidx + 1] = Math.round(fg * (1 - alphaNorm) + 245 * alphaNorm);
        compositeBuf[cidx + 2] = Math.round(fb * (1 - alphaNorm) + 248 * alphaNorm);
        compositeBuf[cidx + 3] = Math.round(alphaNorm * 255);
      } else {
        compositeBuf[cidx] = fr;
        compositeBuf[cidx + 1] = fg;
        compositeBuf[cidx + 2] = fb;
        compositeBuf[cidx + 3] = 255;
      }
    }
  }

  // 6. Save HD master composite (frame + photo)
  const masterHeartPath = 'public/heart_lace_hd.png';
  await sharp(compositeBuf, { raw: { width: w, height: h, channels: 4 } })
    .resize(1200, 1200)
    .png({ compressionLevel: 9 })
    .toFile(masterHeartPath);

  fs.copyFileSync(masterHeartPath, 'public/heart_lace_user.png');
  fs.copyFileSync(masterHeartPath, 'heart_lace_hd.png');
  fs.copyFileSync(masterHeartPath, 'heart_lace_user.png');

  // 7. Save standalone transparent frame
  if (!fs.existsSync('public/cover')) {
    fs.mkdirSync('public/cover', { recursive: true });
  }
  const pureFramePath = 'public/heart_lace.png';
  await sharp(pureFrameBuf, { raw: { width: w, height: h, channels: 4 } })
    .resize(1200, 1200)
    .png({ compressionLevel: 9 })
    .toFile(pureFramePath);

  fs.copyFileSync(pureFramePath, 'public/heart_lace_clean.png');
  fs.copyFileSync(pureFramePath, 'public/cover/heart_lace.png');
  fs.copyFileSync(pureFramePath, 'public/cover/heart_lace_clean.png');
  fs.copyFileSync(pureFramePath, 'heart_lace.png');
  fs.copyFileSync(pureFramePath, 'heart_lace_clean.png');

  // 8. Update public/couple_main.jpg with high-res couple photo
  fs.copyFileSync(photoPath, 'public/couple_main.jpg');

  // 9. Square icons with generous padding and royal blue background (#0d2353)
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

  fs.copyFileSync('public/icon-512.png', 'public/icon.png');

  // 10. Generate og-image.png (1200x630) for social link preview
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

  console.log('✅ ALL ASSETS GENERATED & DEPLOYED FROM PINTEREST FRAME SUCCESSFULLY!');
}

deployAllCleanAssets().catch(console.error);
