import sharp from 'sharp';

async function buildHDCleanHeart() {
  const initFramePath = 'initial_heart_lace_hd.png';
  const userPhotoPath = 'C:/Users/asusa/.gemini/antigravity-ide/brain/ecd504f4-b401-4ddc-9cb8-dd37e220ef74/.user_uploaded/media_1790316203910.jpg';

  const { data: initData, info } = await sharp(initFramePath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // 1. Identify outside transparent pixels using flood-fill from edges
  const isOutside = new Uint8Array(w * h);
  const queue = [0, w - 1, (h - 1) * w, (h - 1) * w + (w - 1)];
  for (const q of queue) isOutside[q] = 1;

  while (queue.length > 0) {
    const curr = queue.pop();
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!isOutside[nidx]) {
          if (initData[nidx * 4 + 3] < 35) {
            isOutside[nidx] = 1;
            queue.push(nidx);
          }
        }
      }
    }
  }

  // 2. Precompute bow envelope (topY and botY per column x)
  const bowTop = new Int16Array(w).fill(-1);
  const bowBot = new Int16Array(w).fill(-1);
  for (let x = 275; x <= 400; x++) {
    let top = -1, bot = -1;
    for (let y = 145; y <= 235; y++) {
      const idx = (y * w + x) * 4;
      const r = initData[idx], g = initData[idx + 1], a = initData[idx + 3];
      if (r > 165 && (r - g) > 3 && a > 40) {
        if (top === -1) top = y;
        bot = y;
      }
    }
    bowTop[x] = top;
    bowBot[x] = bot;
  }

  // Smooth any gaps in the envelope
  for (let x = 278; x <= 398; x++) {
    if (bowTop[x] === -1 && bowTop[x - 1] !== -1 && bowTop[x + 1] !== -1) {
      bowTop[x] = Math.round((bowTop[x - 1] + bowTop[x + 1]) / 2);
      bowBot[x] = Math.round((bowBot[x - 1] + bowBot[x + 1]) / 2);
    }
  }

  // 3. Inner Heart Window:
  // Mathematical organic heart curve matching inner scallops
  const innerHeartSvg = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <path d="M 333 528 
               C 278 485, 222 432, 172 372 
               C 138 330, 142 265, 155 230 
               C 172 182, 218 160, 260 174 
               C 290 182, 315 190, 333 190 
               C 351 190, 376 182, 406 174 
               C 448 160, 494 182, 511 230 
               C 524 265, 528 330, 494 372 
               C 444 432, 388 485, 333 528 Z" 
            fill="#FFFFFF" />
    </svg>
  `;

  const { data: innerMask } = await sharp(Buffer.from(innerHeartSvg))
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 4. User photo cropped and scaled in HD:
  const photo = await sharp(userPhotoPath)
    .extract({ left: 245, top: 110, width: 530, height: 530 })
    .resize(w, h, { fit: 'cover' })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const out = Buffer.alloc(w * h * 4);

  // Pass 1: Render photo inside, clean white lace outside
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const pixelIndex = y * w + x;

      if (isOutside[pixelIndex]) {
        out[idx] = 0;
        out[idx + 1] = 0;
        out[idx + 2] = 0;
        out[idx + 3] = 0;
        continue;
      }

      const isInner = innerMask[idx + 3] > 128;
      if (isInner) {
        // Couple photo:
        out[idx] = photo[idx];
        out[idx + 1] = photo[idx + 1];
        out[idx + 2] = photo[idx + 2];
        out[idx + 3] = 255;
      } else {
        // White lace: ZERO black / dark colors ("jangan ada warna hitamnya")
        const r = initData[idx], g = initData[idx + 1], b = initData[idx + 2];
        const origLightness = (r + g + b) / 3;

        if (origLightness < 210) {
          // Remap dark lines / holes into delicate subtle paper embossing (242..253)
          const embossedTone = Math.round(242 + (origLightness / 210) * 11);
          out[idx] = embossedTone;
          out[idx + 1] = embossedTone;
          out[idx + 2] = Math.min(255, embossedTone + 2);
          out[idx + 3] = 255;
        } else {
          // Pure white paper lace highlights:
          out[idx] = Math.max(r, 250);
          out[idx + 1] = Math.max(g, 250);
          out[idx + 2] = Math.max(b, 252);
          out[idx + 3] = 255;
        }
      }
    }
  }

  // Pass 2: Pink satin ribbon bow placed directly on top!
  for (let x = 275; x <= 400; x++) {
    const top = bowTop[x];
    const bot = bowBot[x];
    if (top === -1) continue;

    for (let y = top; y <= bot; y++) {
      const idx = (y * w + x) * 4;
      const r = initData[idx], g = initData[idx + 1], b = initData[idx + 2], a = initData[idx + 3];

      const isPink = (r > 165 && (r - g) > 3 && a > 40);
      if (isPink) {
        out[idx] = r;
        out[idx + 1] = g;
        out[idx + 2] = b;
        out[idx + 3] = 255;
      } else {
        // Fill any internal notch / ink mark with beautiful satin ribbon pink
        out[idx] = 226;
        out[idx + 1] = 216;
        out[idx + 2] = 219;
        out[idx + 3] = 255;
      }
    }
  }

  // Save the master clean HD frame
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('test_hd_clean_heart.png');

  console.log('Saved test_hd_clean_heart.png with perfect satin bow!');
}

buildHDCleanHeart();
