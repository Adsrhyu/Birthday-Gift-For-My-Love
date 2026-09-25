import sharp from 'sharp';

async function testComposite() {
  const framePath = 'scripts/vintage_frame_raw.jpg';
  const userPhotoPath = 'C:/Users/asusa/.gemini/antigravity-ide/brain/ecd504f4-b401-4ddc-9cb8-dd37e220ef74/.user_uploaded/media_1790316203910.jpg';

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

  // 4. Crop and center the couple photo:
  const photo = await sharp(userPhotoPath)
    .extract({ left: 245, top: 90, width: 540, height: 540 })
    .resize(w, h, { fit: 'cover' })
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
        // Inside heart: couple photo
        out[idx] = photo[idx];
        out[idx + 1] = photo[idx + 1];
        out[idx + 2] = photo[idx + 2];
        out[idx + 3] = 255;
        continue;
      }

      // In the lace:
      // Pure clean white & silver-white embossed lace
      // ZERO black / dark colors ("jangan ada warna hitamnya")
      const r = frameData[fidx];
      const g = frameData[fidx + 1];
      const b = frameData[fidx + 2];
      const brightness = (r + g + b) / 3;

      // Map brightness to luminous white / delicate silver tones (230..255)
      const laceWhite = Math.round(230 + (brightness / 255) * 25);

      out[idx] = laceWhite;
      out[idx + 1] = laceWhite;
      out[idx + 2] = Math.min(255, laceWhite + 2);
      out[idx + 3] = 255;
    }
  }

  // Save the master HD frame
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('test_vintage_ref_hd.png');

  // Preview on blue background (#0d2353)
  const heartBuf = await sharp('test_vintage_ref_hd.png').toBuffer();
  await sharp({
    create: {
      width: 1100,
      height: 1100,
      channels: 4,
      background: { r: 13, g: 35, b: 83, alpha: 1 } // #0d2353
    }
  })
  .composite([{ input: heartBuf, gravity: 'center' }])
  .png()
  .toFile('test_vintage_preview_blue.png');

  console.log('Saved test_vintage_ref_hd.png and test_vintage_preview_blue.png successfully');
}

testComposite();

