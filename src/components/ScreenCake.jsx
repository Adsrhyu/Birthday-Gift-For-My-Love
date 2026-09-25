import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Wind, RotateCcw } from 'lucide-react';
import { burstCelebrationHearts } from '../utils/heartBurst';
import { romanticSynth } from '../utils/audioSynth';

export default function ScreenCake({ onNext, onBack, config }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishRevealed, setWishRevealed] = useState(false);
  const cakeContainerRef = useRef(null);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    setWishRevealed(true);

    // Audio chime
    romanticSynth.playCelebrationChime();

    // Taburan love polos tanpa isi (celebratory hollow outline hearts burst)
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight * 0.42;

    if (cakeContainerRef.current) {
      const rect = cakeContainerRef.current.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height * 0.28; // right where the candle flames are
    }

    burstCelebrationHearts(originX, originY);
  };

  const handleRelight = () => {
    setCandlesLit(true);
  };

  return (
    <div className="denim-bg" style={{
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-gold-light)',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '600'
          }}>
            <Sparkles size={16} /> Make a Wish
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.1,
            marginTop: '4px'
          }}>
            Special Cake
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '4px' }}>
            {candlesLit
              ? "Berdo'alah yang terbaik, lalu tiup lilinnya! 🎂"
              : 'Semoga semua doa dan harapan baikmu terkabul tahun ini! ✨'}
          </p>
        </div>

        {/* Cake Showcase Card */}
        <div className="glass-card-gold" style={{
          width: '100%',
          padding: '34px 20px 26px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '24px',
          position: 'relative'
        }}>
          {/* Cake Illustration SVG */}
          <div
            ref={cakeContainerRef}
            onClick={handleBlowCandles}
            style={{
              cursor: candlesLit ? 'pointer' : 'default',
              position: 'relative',
              transition: 'transform 0.3s ease'
            }}
            title={candlesLit ? 'Klik untuk meniup lilin!' : 'Lilin sudah ditiup!'}
          >
            <svg width="220" height="220" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Filter glow for candles */}
              <defs>
                <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                </filter>
              </defs>

              {/* Candles */}
              {/* Candle 1 (Left) */}
              <rect x="52" y="44" width="6" height="24" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5" />
              <line x1="55" y1="44" x2="55" y2="40" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              {candlesLit ? (
                <g className="flame-animated">
                  <ellipse cx="55" cy="34" rx="7" ry="12" fill="#FBBF24" filter="url(#candleGlow)" opacity="0.6" />
                  <path d="M55 24 C52 30, 50 34, 55 40 C60 34, 58 30, 55 24 Z" fill="#F59E0B" />
                  <ellipse cx="55" cy="35" rx="2.5" ry="5" fill="#FEF08A" />
                </g>
              ) : (
                <text x="50" y="32" fontSize="12" className="smoke-puff" fill="#94A3B8">💨</text>
              )}

              {/* Candle 2 (Center - Tall) */}
              <rect x="77" y="36" width="6" height="32" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
              <line x1="80" y1="36" x2="80" y2="30" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              {candlesLit ? (
                <g className="flame-animated" style={{ animationDelay: '0.3s' }}>
                  <ellipse cx="80" cy="22" rx="8" ry="14" fill="#FBBF24" filter="url(#candleGlow)" opacity="0.6" />
                  <path d="M80 12 C76 19, 74 24, 80 30 C86 24, 84 19, 80 12 Z" fill="#F59E0B" />
                  <ellipse cx="80" cy="24" rx="3" ry="6" fill="#FEF08A" />
                </g>
              ) : (
                <text x="75" y="22" fontSize="14" className="smoke-puff" fill="#94A3B8">💨</text>
              )}

              {/* Candle 3 (Right) */}
              <rect x="102" y="44" width="6" height="24" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5" />
              <line x1="105" y1="44" x2="105" y2="40" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              {candlesLit ? (
                <g className="flame-animated" style={{ animationDelay: '0.6s' }}>
                  <ellipse cx="105" cy="34" rx="7" ry="12" fill="#FBBF24" filter="url(#candleGlow)" opacity="0.6" />
                  <path d="M105 24 C102 30, 100 34, 105 40 C110 34, 108 30, 105 24 Z" fill="#F59E0B" />
                  <ellipse cx="105" cy="35" rx="2.5" ry="5" fill="#FEF08A" />
                </g>
              ) : (
                <text x="100" y="32" fontSize="12" className="smoke-puff" fill="#94A3B8">💨</text>
              )}

              {/* Cake Top Tier (Frosting Swirl & Gold Accents) */}
              <path d="M40 78 C40 68, 55 64, 80 64 C105 64, 120 68, 120 78 L120 95 C120 102, 105 106, 80 106 C55 106, 40 102, 40 95 Z" fill="#1E293B" stroke="#D4AF37" strokeWidth="2" />
              <path d="M40 76 C50 82, 60 76, 70 82 C80 76, 90 82, 100 76 C110 82, 120 76, 120 76" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Cake Base Tier */}
              <path d="M25 98 C25 90, 45 86, 80 86 C115 86, 135 90, 135 98 L135 125 C135 133, 115 137, 80 137 C45 137, 25 133, 25 125 Z" fill="#0B2046" stroke="#D4AF37" strokeWidth="2.5" />
              
              {/* Frosting drips */}
              <path d="M25 98 Q 35 108, 45 98 Q 55 108, 65 98 Q 75 108, 85 98 Q 95 108, 105 98 Q 115 108, 125 98 Q 135 108, 135 98" fill="none" stroke="#D4AF37" strokeWidth="3" />

              {/* Golden Decorative Pearls */}
              {[38, 58, 80, 102, 122].map((cx) => (
                <circle key={cx} cx={cx} cy="116" r="3.5" fill="#F6E27A" stroke="#D4AF37" strokeWidth="1" />
              ))}

              {/* Plate / Stand */}
              <ellipse cx="80" cy="132" rx="68" ry="12" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
              <path d="M60 144 L100 144 L92 154 L68 154 Z" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Interactive Blow Button */}
          {candlesLit ? (
            <button
              onClick={handleBlowCandles}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '16px',
                padding: '12px 28px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                color: '#0B2046',
                fontFamily: 'var(--font-sans)',
                fontWeight: '800',
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(212, 175, 55, 0.45)',
                transition: 'all 0.3s var(--ease-spring)'
              }}
              className="pulse-gold-btn"
            >
              <Wind size={20} />
              <span>Tiup Lilin Sekarang 🎂</span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              marginTop: '14px'
            }}>
              <span style={{
                color: '#34D399',
                fontWeight: '700',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ✨ Semoga do'anya segera terkabul!
              </span>
              <button
                onClick={handleRelight}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                <RotateCcw size={14} /> Nyalakan kembali lilin
              </button>
            </div>
          )}

          {/* Sweet Wish Revealed Card */}
          {wishRevealed && (
            <div style={{
              marginTop: '22px',
              background: 'rgba(7, 21, 43, 0.75)',
              border: '1px dashed var(--color-gold)',
              borderRadius: '16px',
              padding: '18px',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease',
              width: '100%'
            }}>
              <h4 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
                color: 'var(--color-gold)',
                marginBottom: '6px'
              }}>
                Doaku Untukmu{config?.partnerName ? `, ${config.partnerName}` : ''} ❤️
              </h4>
              <p style={{
                fontFamily: 'var(--font-cursive)',
                fontSize: '1.35rem',
                color: '#FFFFFF',
                lineHeight: 1.4
              }}>
                "Semoga setiap langkahmu dipenuhi berkah, segala impian besarmu dipermudah, selalu diberi kesehatan, dan senyummu tidak pernah pudar bersamaku."
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '14px', width: '100%', justifyContent: 'center' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '1px solid #64748B',
              background: 'transparent',
              color: '#CBD5E1',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </button>

          <button
            onClick={onNext}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
              color: '#0B2046',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.2s var(--ease-spring)'
            }}
            className="pulse-gold-btn"
          >
            <span>Buka Surat Cinta 💌</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
