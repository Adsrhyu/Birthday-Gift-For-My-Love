import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScreenLetter({ onNext, onBack, config }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#D4AF37', '#93C5FD']
      });
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
      <div style={{
        maxWidth: '580px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Header */}
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
            <Heart size={16} fill="currentColor" /> From the Heart
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.1,
            marginTop: '4px'
          }}>
            A Letter For My Love
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '4px' }}>
            {isOpen ? 'Surat kecil penuh doa dan rasa terima kasihku ❤️' : 'Ketuk amplop untuk membuka surat rahasia ini! ✨'}
          </p>
        </div>

        {/* Envelope & Letter Container */}
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          {!isOpen ? (
            /* Closed Envelope with Wax Seal */
            <div
              onClick={handleOpenEnvelope}
              style={{
                width: '100%',
                maxWidth: '420px',
                height: '240px',
                background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2342 100%)',
                borderRadius: '16px',
                border: '2px dashed var(--color-gold)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 25px rgba(212, 175, 55, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'transform 0.3s var(--ease-spring)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
              }}
            >
              {/* Flap lines */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '110px',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #2A4D78 0%, #173258 100%)',
                borderBottom: '1px solid rgba(212, 175, 55, 0.4)'
              }} />

              {/* Heart Wax Seal Stamp */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #D4AF37 0%, #854D0E 100%)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
                border: '2px solid #FEF08A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                transform: 'translateY(20px)'
              }}>
                <Heart size={26} fill="#FEF08A" color="#854D0E" />
              </div>

              <div style={{
                zIndex: 6,
                marginTop: '36px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: 'var(--font-cursive)',
                  fontSize: '1.6rem',
                  color: 'var(--color-gold-light)',
                  fontWeight: '700'
                }}>
                  Untuk: {config.partnerName || "Sayangku"}
                </p>
              </div>
            </div>
          ) : (
            /* Open Letter on Parchment Paper */
            <div
              className="glass-card-gold"
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'linear-gradient(135deg, #FFFDF8 0%, #F9F5EC 100%)',
                color: '#1E293B',
                borderRadius: '18px',
                padding: '32px 28px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
                border: '2px dashed #C5A059',
                position: 'relative',
                animation: 'fadeIn 0.6s ease'
              }}
            >
              {/* Decorative Stamp Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '1px solid rgba(197, 160, 89, 0.4)',
                paddingBottom: '14px',
                marginBottom: '18px'
              }}>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-cursive)',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#0B2046',
                    lineHeight: 1
                  }}>
                    Sayangku tercinta,
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Special Birthday Edition ✨
                  </span>
                </div>

                <div style={{
                  border: '1px solid #C5A059',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '700',
                  color: '#854D0E',
                  background: '#FEF9C3',
                  transform: 'rotate(3deg)'
                }}>
                  SEALED WITH LOVE
                </div>
              </div>

              {/* Letter Content */}
              <div style={{
                fontFamily: 'var(--font-handwriting)',
                fontSize: '1.45rem',
                lineHeight: '1.55',
                color: '#1E293B',
                whiteSpace: 'pre-line'
              }}>
                {config.letterContent || `Selamat ulang tahun ya sayangku! ❤️

Di hari spesialmu ini, aku cuma mau bilang terima kasih sebanyak-banyaknya. Terima kasih sudah selalu jadi sosok yang penyabar, pendengar yang baik, dan orang yang selalu bisa membuat hari-hariku terasa lebih tenang dan ceria.

Melihat semua usaha, kerja keras, dan dedikasimu setiap hari bikin aku selalu bangga punya kamu. Semoga di umur yang baru ini, segala impian dan tujuan besarmu satu per satu terwujud, kamu senantiasa dilimpahkan kesehatan, rezeki yang berkah, serta ketenangan hati. Dan yang paling penting, semoga kita selalu bisa saling menemani dan saling menggenggam tangan melewati setiap suka maupun duka bersama.

Jangan lupa istirahat kalau capek ya. Kamu selalu punya aku di sini. Happy birthday, my favorite person in the whole universe! 🎂🥂`}
              </div>

              {/* Signature */}
              <div style={{
                marginTop: '24px',
                textAlign: 'right',
                borderTop: '1px dashed rgba(197, 160, 89, 0.4)',
                paddingTop: '12px'
              }}>
                <p style={{
                  fontFamily: 'var(--font-cursive)',
                  fontSize: '1.5rem',
                  color: '#0B2046',
                  fontWeight: '700'
                }}>
                  Yang selalu menyayangimu,
                </p>
                <p style={{
                  fontFamily: 'var(--font-cursive)',
                  fontSize: '1.8rem',
                  color: '#0B2046',
                  fontWeight: '700',
                  marginTop: '2px'
                }}>
                  Ade Sri Rahayu ❤️
                </p>
              </div>
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
            <span>Buka Galeri Foto 📸</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
