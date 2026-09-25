import sharp from 'sharp';
import fs from 'fs';

async function deployUltraCrispAssets() {
  const framePath = 'scripts/pinterest_frame_orig.jpg';
  const photoPath = 'couple_main.jpg';

  console.log('Generating Ultra-Crisp assets from Pinterest frame and couple photo...');
  const { data: frameRaw, info } = await sharp(framePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 2400
  const h = info.height; // 2400

  function getB(idx) {
    return (frameRaw[idx * 3] + frameRaw[idx * 3 + 1] + frameRaw[idx * 3 + 2]) / 3;
  }

  // 1. Outside flood fill
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

  // 5. Crop and scale couple photo to fit heart opening with SHARPENING for crystal clear details
  const photoCropped = await sharp(photoPath)
    .extract({ left: 0, top: 110, width: 864, height: 864 })
    .resize(1540, 1540, { fit: 'fill', kernel: 'lanczos3' })
    .sharpen({ sigma: 1.2, m1: 1.2, m2: 0.5 }) // crisp, beautiful facial details
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

  // 6. Save Ultra-HD master composite at 1600x1600 for razor-sharp clarity on retina displays
  const masterHeartPath = 'public/heart_lace_hd.png';
  await sharp(compositeBuf, { raw: { width: w, height: h, channels: 4 } })
    .resize(1600, 1600, { kernel: 'lanczos3' })
    .png({ compressionLevel: 8 })
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
    .resize(1600, 1600, { kernel: 'lanczos3' })
    .png({ compressionLevel: 8 })
    .toFile(pureFramePath);

  fs.copyFileSync(pureFramePath, 'public/heart_lace_clean.png');
  fs.copyFileSync(pureFramePath, 'public/cover/heart_lace.png');
  fs.copyFileSync(pureFramePath, 'public/cover/heart_lace_clean.png');
  fs.copyFileSync(pureFramePath, 'heart_lace.png');
  fs.copyFileSync(pureFramePath, 'heart_lace_clean.png');

  // 8. Square icons
  const heart512 = await sharp(masterHeartPath).resize(450, 450, { fit: 'contain', kernel: 'lanczos3' }).toBuffer();
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

  const heart192 = await sharp(masterHeartPath).resize(170, 170, { fit: 'contain', kernel: 'lanczos3' }).toBuffer();
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

  const heart180 = await sharp(masterHeartPath).resize(160, 160, { fit: 'contain', kernel: 'lanczos3' }).toBuffer();
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

  // 9. Generate crisp og-image.png (1200x630) where the heart love frame is huge and centered!
  const heartOg = await sharp(masterHeartPath)
    .resize(550, 550, { fit: 'contain', kernel: 'lanczos3' })
    .toBuffer();

  const bgSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spotlight" cx="72%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#1b3972" />
          <stop offset="55%" stop-color="#0a1a36" />
          <stop offset="100%" stop-color="#050e1f" />
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#spotlight)" />

      <!-- Sparkles / Golden Stars -->
      <polygon points="100,80 103,90 113,93 103,96 100,106 97,96 87,93 97,90" fill="#F6E27A" opacity="0.9" />
      <polygon points="560,95 562,102 569,104 562,106 560,113 558,106 551,104 558,102" fill="#FFFFFF" opacity="0.85" />
      <polygon points="140,530 143,540 153,543 143,546 140,556 137,546 127,543 137,540" fill="#F6E27A" opacity="0.85" />
      <polygon points="1120,70 1122,78 1130,80 1122,82 1120,90 1118,82 1110,80 1118,78" fill="#93C5FD" opacity="0.9" />
      <polygon points="1130,550 1133,560 1143,563 1133,566 1130,576 1127,566 1117,563 1127,560" fill="#F6E27A" opacity="0.9" />
      <circle cx="600" cy="530" r="3" fill="#FFFFFF" opacity="0.7" />
      <circle cx="220" cy="210" r="2.5" fill="#F6E27A" opacity="0.6" />

      <!-- Left Typography (Crisp & Elegant) -->
      <text x="85" y="210" font-family="'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="34" fill="#93C5FD" letter-spacing="2">✨ SPECIAL BIRTHDAY GIFT</text>
      <text x="85" y="295" font-family="'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" font-weight="900" font-size="72" fill="#FFFFFF" letter-spacing="-1.5">For My Darling</text>
      <text x="85" y="375" font-family="'Outfit', -apple-system, BlinkMacSystemFont, sans-serif" font-weight="900" font-size="68" fill="#F6E27A" letter-spacing="-1">Happy Birthday! 💖</text>
      <text x="85" y="445" font-family="'Playfair Display', Georgia, serif" font-style="italic" font-size="28" fill="#CBD5E1">A special keepsake crafted with love</text>
    </svg>
  `;

  await sharp(Buffer.from(bgSvg))
    .composite([{
      input: heartOg,
      left: 620,
      top: 40
    }])
    .png({ quality: 100, compressionLevel: 8 })
    .toFile('public/og-image.png');

  console.log('✅ ULTRA-CRISP ASSETS CREATED SUCCESSFULLY!');
}

deployUltraCrispAssets().catch(console.error);
