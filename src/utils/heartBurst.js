/**
 * High-performance canvas particle burst of outline hearts (love polos tanpa isi)
 * Only outlines are drawn (stroke only, no fill) with elegant physics.
 */
export function burstOutlineHearts(originX, originY) {
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

  const colors = [
    '#FFFFFF',
    '#93C5FD',
    '#BAE6FD',
    '#60A5FA',
    '#F6E27A',
    '#FDE047'
  ];

  const particleCount = 55;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    // Burst spreading upwards (-150 to -30 degrees)
    const angle = (Math.PI / 180) * (-150 + Math.random() * 120);
    const speed = 7 + Math.random() * 11;
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
      decay: 0.012 + Math.random() * 0.012,
      gravity: 0.28 + Math.random() * 0.12,
      drag: 0.978
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
