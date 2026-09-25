import React, { useState, useMemo } from 'react';
import { Lock, Unlock, ArrowLeft } from 'lucide-react';
import { romanticSynth } from '../utils/audioSynth';

export default function ScreenPin({ onNext, onBack, config }) {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dateSelected, setDateSelected] = useState(false); // tracks if correct date was chosen
  const [showPinPad, setShowPinPad] = useState(false); // shows numeric pad after correct date

  const CORRECT_DATE = '3112';
  const CORRECT_PIN = (config?.pin && config.pin !== '2709') ? config.pin : '3112'; // PIN is 3112

  // Sparse floating white outline hearts
  const hearts = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${(i * 12 + 5) % 92}%`,
      delay: `${(i * 1.8) % 12}s`,
      duration: `${18 + (i % 4) * 3}s`,
      size: `${14 + (i % 3) * 4}px`,
      opacity: 0.25 + (i % 3) * 0.1
    }));
  }, []);

  // Handle date button click
  const handleDateClick = (date) => {
    if (dateSelected) return; // already selected correct date

    if (date === CORRECT_DATE) {
      setErrorMsg('');
      setSuccessMsg('Yeay berhasil, terima kasih sudah ingat! 🎉\nMasukkan ulang pin nya sayang!');
      setDateSelected(true);
      romanticSynth.playCelebrationChime();
      // Show PIN pad after a short delay
      setTimeout(() => {
        setShowPinPad(true);
      }, 1200);
    } else {
      setSuccessMsg('');
      setErrorMsg('Oops, salah pilih sayang! Coba ingat kembali 💙');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Handle PIN entry after correct date
  const checkPin = (code) => {
    if (code === CORRECT_PIN) {
      setErrorMsg('');
      setIsUnlocked(true);
      romanticSynth.playCelebrationChime();
      setTimeout(() => {
        onNext();
      }, 1000);
    } else {
      setIsShaking(true);
      setErrorMsg('Pin salah, coba lagi sayang! 💙');
      setPinInput('');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleKeyClick = (val) => {
    if (pinInput.length < 4) {
      const nextPin = pinInput + val;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        checkPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="denim-bg" style={{
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Sparse floating white outline hearts */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}>
        {hearts.map((h) => (
          <span
            key={h.id}
            className="falling-star"
            style={{
              left: h.left,
              animationDelay: h.delay,
              animationDuration: h.duration,
              fontSize: h.size,
              opacity: h.opacity,
              color: 'rgba(255, 255, 255, 0.5)',
              textShadow: 'none'
            }}
          >
            ♡
          </span>
        ))}
      </div>

      <div
        className={`glass-card-gold ${isShaking ? 'shake-animation' : ''}`}
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '34px 28px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Lock Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: isUnlocked
            ? 'linear-gradient(135deg, #10B981, #059669)'
            : 'linear-gradient(135deg, #F6E27A, #D4AF37)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
          transition: 'all 0.4s var(--ease-spring)'
        }}>
          {isUnlocked ? (
            <Unlock size={32} color="#0B2046" />
          ) : (
            <Lock size={32} color="#0B2046" />
          )}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.9rem',
          fontWeight: '700',
          color: 'var(--color-gold)',
          marginBottom: '6px'
        }}>
          {isUnlocked ? 'Akses Diterima! ✨' : 'Secret Code'}
        </h2>
        <p style={{
          fontSize: '0.9rem',
          color: '#CBD5E1',
          marginBottom: '22px',
          lineHeight: '1.5'
        }}>
          {showPinPad
            ? 'Masukkan pin spesial kita 💙'
            : 'Pilih tanggal spesial kita,\nmoment kamu mendekatiku 💙'}
        </p>

        {/* Success Message */}
        {successMsg && (
          <p style={{
            color: '#34D399',
            fontSize: '0.88rem',
            marginBottom: '14px',
            animation: 'fadeIn 0.3s ease',
            whiteSpace: 'pre-line',
            lineHeight: '1.5'
          }}>
            {successMsg}
          </p>
        )}

        {/* Error Message */}
        {errorMsg && (
          <p style={{
            color: '#F87171',
            fontSize: '0.85rem',
            marginBottom: '14px',
            animation: 'fadeIn 0.3s ease'
          }}>
            {errorMsg}
          </p>
        )}

        {/* Date Choice Buttons - show when PIN pad is not active */}
        {!showPinPad && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {['1402', '3112', '0101', '2512'].map((choice) => (
              <button
                key={choice}
                onClick={() => handleDateClick(choice)}
                disabled={dateSelected}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: dateSelected && choice === CORRECT_DATE
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: dateSelected && choice === CORRECT_DATE
                    ? '1.5px solid #34D399'
                    : '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  cursor: dateSelected ? 'default' : 'pointer',
                  letterSpacing: '1px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  opacity: dateSelected && choice !== CORRECT_DATE ? 0.4 : 1
                }}
                onMouseEnter={(e) => {
                  if (!dateSelected) {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!dateSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {/* PIN Entry Section - shows after correct date is selected */}
        {showPinPad && (
          <>
            {/* PIN Dots Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              margin: '10px 0 16px 0'
            }}>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: pinInput.length > idx ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.2)',
                    boxShadow: pinInput.length > idx ? '0 0 10px var(--color-gold)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* Numeric keypad */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              maxWidth: '220px',
              margin: '0 auto 16px auto'
            }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    if (k === 'C') { setPinInput(''); setErrorMsg(''); }
                    else if (k === '⌫') handleBackspace();
                    else handleKeyClick(k);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: k === 'C' ? '#F87171' : '#F1F5F9',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '0.85rem',
            cursor: 'pointer',
            marginTop: '8px',
            textDecoration: 'underline'
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke awal
        </button>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.5s ease;
        }
      `}
      </style>
    </div>
  );
}
