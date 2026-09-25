import sharp from 'sharp';

async function generateUltraHdOgImage() {
  const masterHeartPath = 'public/heart_lace_hd.png';

  // 1. Generate crisp 560x560 heart frame for the OG preview
  const heartOg = await sharp(masterHeartPath)
    .resize(540, 540, { fit: 'contain', kernel: 'lanczos3' })
    .toBuffer();

  // 2. Beautiful royal midnight navy background with starry glow
  const bgSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spotlight" cx="70%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#1b3972" />
          <stop offset="60%" stop-color="#0a1a36" />
          <stop offset="100%" stop-color="#050e1f" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="1200" height="630" fill="url(#spotlight)" />

      <!-- Sparkles / Golden Stars -->
      <polygon points="100,80 103,90 113,93 103,96 100,106 97,96 87,93 97,90" fill="#F6E27A" opacity="0.9" />
      <polygon points="560,95 562,102 569,104 562,106 560,113 558,106 551,104 558,102" fill="#FFFFFF" opacity="0.85" />
      <polygon points="140,530 143,540 153,543 143,546 140,556 137,546 127,543 137,540" fill="#F6E27A" opacity="0.85" />
      <polygon points="1120,70 1122,78 1130,80 1122,82 1120,90 1118,82 1110,80 1118,78" fill="#93C5FD" opacity="0.9" />
      <polygon points="1130,550 1133,560 1143,563 1133,566 1130,576 1127,566 1117,563 1127,560" fill="#F6E27A" opacity="0.9" />
      <circle cx="620" cy="530" r="3" fill="#FFFFFF" opacity="0.7" />
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
      left: 630,
      top: 45
    }])
    .png({ quality: 100, compressionLevel: 8 })
    .toFile('public/og-image.png');

  console.log('Ultra HD og-image.png generated successfully!');
}

generateUltraHdOgImage().catch(console.error);
