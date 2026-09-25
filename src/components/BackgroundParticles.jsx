import React, { useMemo } from 'react';

export default function BackgroundParticles() {
  const particles = useMemo(() => {
    // Strictly NO PINK hearts - gentle, sparse falling stars as requested ("jangan terlalu banyak")
    const symbols = ['✦', '✧', '⋆', '✨'];
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 9.5 + 4) % 94}%`,
      delay: `${(i * 1.4) % 14}s`,
      duration: `${16 + (i % 5) * 2.5}s`,
      size: `${11 + (i % 3) * 3}px`,
      opacity: (i % 2 === 0 ? 0.45 : 0.28),
      color: i % 2 === 0 ? 'rgba(246, 226, 122, 0.7)' : 'rgba(147, 197, 253, 0.7)',
      glow: i % 2 === 0 ? '0 0 6px rgba(246, 226, 122, 0.5)' : '0 0 6px rgba(147, 197, 253, 0.5)'
    }));
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="falling-star"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            opacity: p.opacity,
            color: p.color,
            textShadow: p.glow
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
