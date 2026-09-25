import sharp from 'sharp';
import fs from 'fs';

async function deployMountainLanding() {
  const framePath = 'scripts/pinterest_frame_orig.jpg';
  const photoPath = 'couple_mountain.jpg';

  console.log('1. Loading Pinterest frame and couple mountain photo...');
  const { data: frameRaw, info } = await sharp(framePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width; // 2400
  const h = info.height; // 2400

  function getB(idx) {
    return (frameRaw[idx * 3] + frameRaw[idx * 3 + 1] + frameRaw[idx * 3 + 2]) / 3;
  }

  // Flood fill outside
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
        if (getB(nidx) < 45) {
          isOutside[nidx] = 1;
          queueOut.push(nidx);
        }
      }
    }
  }

  // Smooth outside border to remove dark edge fringe
  for (let pass = 0; pass < 2; pass++) {
    const toAdd = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (!isOutside[idx]) {
          const hasOut = isOutside[idx + 1] || isOutside[idx - 1] || isOutside[idx + w] || isOutside[idx - w];
          if (hasOut && getB(idx) < 95) toAdd.push(idx);
        }
      }
    }
    for (const idx of toAdd) isOutside[idx] = 1;
  }

  // Inside flood fill
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

  console.log('2. Processing mountain photo with refined crop and lanczos3 sharpness...');
  // Refined crop: left 180, top 160, size 570
  const photoCropped = await sharp(photoPath)
    .extract({ left: 180, top: 160, width: 570, height: 570 })
    .resize(1540, 1540, { fit: 'fill', kernel: 'lanczos3' })
    .sharpen({ sigma: 1.2, m1: 1.2, m2: 0.5 })
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

      if (isInside[idx]) continue;

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

  console.log('3. Saving 1600x1600 Ultra-HD mountain composite for ScreenLanding...');
  const masterHeartPath = 'public/heart_lace_hd.png';
  await sharp(compositeBuf, { raw: { width: w, height: h, channels: 4 } })
    .resize(1600, 1600, { kernel: 'lanczos3' })
    .png({ compressionLevel: 8 })
    .toFile(masterHeartPath);

  fs.copyFileSync(masterHeartPath, 'public/heart_lace_user.png');
  fs.copyFileSync(masterHeartPath, 'heart_lace_hd.png');
  fs.copyFileSync(masterHeartPath, 'heart_lace_user.png');

  console.log('4. ScreenLanding master assets successfully saved with Mountain photo!');
}

deployMountainLanding().catch(console.error);
