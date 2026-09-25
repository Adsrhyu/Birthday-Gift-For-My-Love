import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const SWEET_DAILY_NOTES = [
  "Hari biasa yang selalu istimewa karena ada kamu.",
  "Terima kasih sudah selalu sabar dan ada untukku.",
  "Senyummu selalu jadi penyemangat hariku!",
  "Gak pernah bosan bersyukur bisa kenal kamu.",
  "Semoga hari-harimu selalu dipenuhi kebahagiaan.",
  "Kamu adalah tempat ternyaman untuk pulang."
];

export default function ScreenCalendar({ onNext, onBack, _config }) {
  const [selectedDay, setSelectedDay] = useState(27);
  const [noteText, setNoteText] = useState("Hari paling istimewa dan harus dirayakan dengan cara paling istimewa juga.");

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (day === 27) {
      setNoteText("Hari paling istimewa dan harus dirayakan dengan cara paling istimewa juga.");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F6E27A', '#93C5FD']
      });
    } else {
      const randomNote = SWEET_DAILY_NOTES[day % SWEET_DAILY_NOTES.length];
      setNoteText(`Tanggal ${day}: "${randomNote}"`);
    }
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
      {/* Glowing heart pulse animation */}
      <style>{`
        @keyframes glowingHeartPulse {
          0%, 100% {
            transform: scale(1.18);
            filter: drop-shadow(0 0 6px rgba(255, 243, 191, 0.95)) drop-shadow(0 0 14px rgba(246, 226, 122, 0.85)) drop-shadow(0 0 22px rgba(212, 175, 55, 0.7));
          }
          50% {
            transform: scale(1.28);
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1)) drop-shadow(0 0 20px rgba(246, 226, 122, 1)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.9));
          }
        }
        .glowing-heart-date {
          animation: glowingHeartPulse 2.2s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        maxWidth: '520px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-gold-light)', marginBottom: '6px' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600' }}>
              A Very Special Date
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.1
          }}>
            The Day
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '4px' }}>
            Hari spesial dimana pria bernama Ryan Wardiana dilahirkan ❤️
          </p>
        </div>

        {/* Calendar Glass Card */}
        <div className="glass-card-gold" style={{
          width: '100%',
          padding: '26px 20px',
          borderRadius: '20px'
        }}>
          {/* Calendar Month Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            paddingBottom: '12px'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#FFFFFF'
            }}>
              September
            </h3>
            <span style={{
              background: 'rgba(212, 175, 55, 0.2)',
              color: 'var(--color-gold-light)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              Special Month
            </span>
          </div>

          {/* Days Grid Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} style={{
                fontSize: '0.78rem',
                fontWeight: '700',
                color: '#94A3B8',
                textTransform: 'uppercase'
              }}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid Numbers (1 to 30 with offset for September) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}>
            {/* Blank offset for Sept (2 blank days) */}
            <div />
            <div />

            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isSpecial = day === 27;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  style={isSpecial ? {
                    aspectRatio: '1',
                    borderRadius: '0',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: 0,
                    transition: 'all 0.3s var(--ease-spring)'
                  } : {
                    aspectRatio: '1',
                    borderRadius: '50%',
                    border: isSelected
                      ? '1px solid var(--color-gold)'
                      : '1px solid transparent',
                    background: isSelected
                      ? 'rgba(212, 175, 55, 0.25)'
                      : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? 'var(--color-gold-light)' : '#E2E8F0',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.2s var(--ease-spring)'
                  }}
                  className={isSpecial ? 'glowing-heart-date' : ''}
                >
                  {isSpecial ? (
                    <>
                      {/* Glowing Heart with glowing edges */}
                      <svg
                        viewBox="0 0 24 24"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          overflow: 'visible'
                        }}
                      >
                        <defs>
                          <linearGradient id="specialDayHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF9DB" />
                            <stop offset="45%" stopColor="#F6E27A" />
                            <stop offset="100%" stopColor="#D4AF37" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          fill="url(#specialDayHeartGrad)"
                          stroke="#FFFFFF"
                          strokeWidth="1.2"
                        />
                      </svg>
                      {/* Day Number centered inside the glowing love */}
                      <span style={{
                        position: 'relative',
                        zIndex: 2,
                        color: '#0B2046',
                        fontWeight: '900',
                        fontSize: '0.88rem',
                        marginTop: '-2px',
                        textShadow: '0 1px 1px rgba(255,255,255,0.7)',
                        lineHeight: 1
                      }}>
                        27
                      </span>
                    </>
                  ) : (
                    <span>{day}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Date Note Box */}
          <div style={{
            marginTop: '22px',
            background: 'rgba(7, 21, 43, 0.65)',
            border: '1px dashed rgba(212, 175, 55, 0.4)',
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center'
          }}>
            <p style={{
              fontFamily: 'var(--font-cursive)',
              fontSize: '1.25rem',
              color: 'var(--color-gold-light)',
              lineHeight: 1.3
            }}>
              {noteText}
            </p>
          </div>
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
            <span>Tiup Lilin</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
