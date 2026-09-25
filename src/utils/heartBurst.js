/**
 * High-performance canvas particle burst of outline hearts (love polos tanpa isi)
 * Only outlines are drawn (stroke only, no fill) with elegant physics.
 */
export function burstOutlineHearts(originX, originY, options = {}) {
  if (typeof window === 'undefined') return;

  const xPos = originX !== undefined ? originX : window.innerWidth / 2;
  const yPos = originY !== undefined ? originY : window.innerHeight * 0.65;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = options.colors || [
    '#FFFFFF',
    '#93C5FD',
    '#BAE6FD',
    '#60A5FA',
    '#F6E27A',
    '#FDE047'
  ];

  const particleCount = options.particleCount || 55;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    // Burst spreading upwards (-150 to -30 degrees default)
    const minAngle = options.angleMin !== undefined ? options.angleMin : -155;
    const maxAngle = options.angleMax !== undefined ? options.angleMax : -25;
    const angle = (Math.PI / 180) * (minAngle + Math.random() * (maxAngle - minAngle));
    const baseSpeed = options.speed || 7.5;
    const speed = baseSpeed + Math.random() * 10;
    particles.push({
      x: xPos,
      y: yPos,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
      vy: Math.sin(angle) * speed * (0.9 + Math.random() * 0.5),
      size: 16 + Math.random() * 22,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      lineWidth: 2 + Math.random() * 0.8,
      alpha: 1,
      decay: 0.011 + Math.random() * 0.012,
      gravity: 0.26 + Math.random() * 0.12,
      drag: 0.98
    });
  }

  function drawHeartOutline(context, x, y, size, rotation, color, lineWidth, alpha) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = Math.max(0, Math.min(1, alpha));
    context.beginPath();

    const topCurveHeight = size * 0.35;
    context.moveTo(0, topCurveHeight);
    // Left side of heart outline
    context.bezierCurveTo(-size * 0.65, -topCurveHeight * 0.8, -size * 0.9, size * 0.35, 0, size);
    // Right side of heart outline
    context.bezierCurveTo(size * 0.9, size * 0.35, size * 0.65, -topCurveHeight * 0.8, 0, topCurveHeight);

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // STROKE ONLY: hollow / polos tanpa isi
    context.stroke();
    context.restore();
  }

  let animationFrameId;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;
    for (const p of particles) {
      if (p.alpha > 0.01) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.drag;
        p.vy = (p.vy * p.drag) + p.gravity;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        drawHeartOutline(ctx, p.x, p.y, p.size, p.rotation, p.color, p.lineWidth, p.alpha);
      }
    }

    if (activeCount > 0 && Date.now() - startTime < 3500) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animate();
}

/**
 * High-performance canvas particle burst of outline stars (bintang putih polos tanpa isi)
 * Only white outlines are drawn (stroke only, no fill) with elegant physics.
 */
export function burstOutlineStars(originX, originY, options = {}) {
  if (typeof window === 'undefined') return;

  const xPos = originX !== undefined ? originX : window.innerWidth / 2;
  const yPos = originY !== undefined ? originY : window.innerHeight * 0.45;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Pure white colors (putih polos tanpa isi)
  const colors = options.colors || [
    '#FFFFFF',
    '#F8FAFC',
    'rgba(255, 255, 255, 0.95)',
    'rgba(241, 245, 249, 0.95)'
  ];

  const particleCount = options.particleCount || 55;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const minAngle = options.angleMin !== undefined ? options.angleMin : -155;
    const maxAngle = options.angleMax !== undefined ? options.angleMax : -25;
    const angle = (Math.PI / 180) * (minAngle + Math.random() * (maxAngle - minAngle));
    const baseSpeed = options.speed || 8;
    const speed = baseSpeed + Math.random() * 11;
    particles.push({
      x: xPos,
      y: yPos,
      vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
      vy: Math.sin(angle) * speed * (0.9 + Math.random() * 0.5),
      size: 15 + Math.random() * 22,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      lineWidth: 1.8 + Math.random() * 0.6,
      alpha: 1,
      decay: 0.011 + Math.random() * 0.012,
      gravity: 0.25 + Math.random() * 0.1,
      drag: 0.98,
      points: 5 // classic 5-pointed star
    });
  }

  function drawStarOutline(context, x, y, size, rotation, color, lineWidth, alpha, points = 5) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = Math.max(0, Math.min(1, alpha));
    context.beginPath();

    const outerRadius = size * 0.55;
    const innerRadius = outerRadius * 0.42;

    for (let i = 0; i < points * 2; i++) {
      const r = (i % 2 === 0) ? outerRadius : innerRadius;
      const a = (i * Math.PI) / points - Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) {
        context.moveTo(px, py);
      } else {
        context.lineTo(px, py);
      }
    }

    context.closePath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // STROKE ONLY: hollow outline / polos tanpa isi (no fill)
    context.stroke();
    context.restore();
  }

  let animationFrameId;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;
    for (const p of particles) {
      if (p.alpha > 0.01) {
        activeCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= p.drag;
        p.vy = (p.vy * p.drag) + p.gravity;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        drawStarOutline(ctx, p.x, p.y, p.size, p.rotation, p.color, p.lineWidth, p.alpha, p.points);
      }
    }

    if (activeCount > 0 && Date.now() - startTime < 3500) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animate();
}

/**
 * Multi-wave celebratory burst of plain white outline stars (bintang putih polos tanpa isi)
 * Specially designed for blowing birthday candles!
 */
export function burstCelebrationStars(originX, originY) {
  if (typeof window === 'undefined') return;
  const centerX = originX !== undefined ? originX : window.innerWidth / 2;
  const centerY = originY !== undefined ? originY : window.innerHeight * 0.42;

  // Wave 1: Immediate powerful bloom of white outline stars
  burstOutlineStars(centerX, centerY, { particleCount: 52 });

  // Wave 2: Left and right outward bloom of white outline stars
  setTimeout(() => {
    burstOutlineStars(Math.max(40, centerX - 70), centerY - 10, { particleCount: 42, angleMin: -160, angleMax: -60 });
    burstOutlineStars(Math.min(window.innerWidth - 40, centerX + 70), centerY - 10, { particleCount: 42, angleMin: -120, angleMax: -20 });
  }, 180);

  // Wave 3: Upward fountain shower of white outline stars
  setTimeout(() => {
    burstOutlineStars(centerX, centerY - 25, { particleCount: 46, angleMin: -145, angleMax: -35 });
  }, 380);
}

/**
 * Multi-wave celebratory burst of outline hearts (perfect for candle blowing / major celebrations)
 */
export function burstCelebrationHearts(originX, originY) {
  if (typeof window === 'undefined') return;
  const centerX = originX !== undefined ? originX : window.innerWidth / 2;
  const centerY = originY !== undefined ? originY : window.innerHeight * 0.45;

  // Wave 1: Immediate powerful bloom
  burstOutlineHearts(centerX, centerY, { particleCount: 50 });

  // Wave 2: Left and right outward blooms
  setTimeout(() => {
    burstOutlineHearts(Math.max(40, centerX - 70), centerY - 10, { particleCount: 40, angleMin: -160, angleMax: -60 });
    burstOutlineHearts(Math.min(window.innerWidth - 40, centerX + 70), centerY - 10, { particleCount: 40, angleMin: -120, angleMax: -20 });
  }, 180);

  // Wave 3: Fountain shower upwards to finish the celebration
  setTimeout(() => {
    burstOutlineHearts(centerX, centerY - 30, { particleCount: 45, angleMin: -145, angleMax: -35 });
  }, 380);
}
