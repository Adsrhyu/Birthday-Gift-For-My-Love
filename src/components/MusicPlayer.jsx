import React, { useEffect, useRef, useState } from 'react';

const AUDIO_SRC = '/birthday_sound.mp3';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    // 1. Prevent mobile Chrome from showing unsolicited PWA install prompt banner
    const preventInstallBanner = (e) => {
      e.preventDefault();
      console.log('Suppressed default PWA install prompt.');
    };
    window.addEventListener('beforeinstallprompt', preventInstallBanner);

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    const playAudio = () => {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
          setNeedsGesture(false);
        }).catch((err) => {
          // Autoplay blocked by browser policy until user gesture
          console.log('Autoplay blocked by browser, waiting for user gesture:', err.message);
          setIsPlaying(false);
          setNeedsGesture(true);
        });
      }
    };

    // Expose global trigger for any button (e.g. Buka Kado) or link to start music immediately
    window.__playBirthdayMusic = playAudio;

    // Direct attempt upon entering website
    playAudio();

    // Universal gesture unlock — starts song immediately upon any touch / click / scroll
    const unlockOnGesture = () => {
      playAudio();
      ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockOnGesture, { capture: true });
        document.removeEventListener(evt, unlockOnGesture, { capture: true });
      });
    };

    ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, unlockOnGesture, { once: true, capture: true, passive: true });
      document.addEventListener(evt, unlockOnGesture, { once: true, capture: true, passive: true });
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', preventInstallBanner);
      ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockOnGesture, { capture: true });
        document.removeEventListener(evt, unlockOnGesture, { capture: true });
      });
    };
  }, []);

  const toggleMusic = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setNeedsGesture(false);
      }).catch((e) => console.log('Play toggle error:', e));
    }
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onEnded={handleEnded}
        style={{ display: 'none' }}
      />

      {/* Floating Music Button (No install needed, plays immediately) */}
      <div
        style={{
          position: 'fixed',
          top: '14px',
          right: '14px',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          title={isPlaying ? 'Klik untuk jeda musik' : 'Klik untuk putar musik'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: isPlaying ? '7px 14px' : '9px 18px',
            borderRadius: '999px',
            border: isPlaying ? '1px solid rgba(255, 255, 255, 0.28)' : '1.5px solid #F6E27A',
            background: isPlaying
              ? 'rgba(11, 32, 70, 0.75)'
              : 'linear-gradient(135deg, rgba(246, 226, 122, 0.95), rgba(212, 175, 55, 0.95))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: isPlaying ? '#F8FAFC' : '#0B2046',
            fontWeight: isPlaying ? '600' : '800',
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: isPlaying
              ? '0 4px 18px rgba(0, 0, 0, 0.35)'
              : '0 6px 22px rgba(246, 226, 122, 0.5), 0 0 14px rgba(246, 226, 122, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: 'scale(1)',
            animation: needsGesture ? 'gentlePulseButton 1.8s ease-in-out infinite' : 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? (
            <>
              {/* Spinning Disc / Note Icon */}
              <span
                style={{
                  display: 'inline-block',
                  animation: 'spinRecord 3s linear infinite',
                  fontSize: '1rem',
                  lineHeight: 1
                }}
              >
                💿
              </span>
              <span>Musik Aktif 🎵</span>
              {/* Mini Audio Equalizer Waves */}
              <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                <span style={{ width: '2px', height: '100%', background: '#F6E27A', borderRadius: '1px', animation: 'barWave1 0.8s ease-in-out infinite alternate' }} />
                <span style={{ width: '2px', height: '60%', background: '#93C5FD', borderRadius: '1px', animation: 'barWave2 0.6s ease-in-out infinite alternate' }} />
                <span style={{ width: '2px', height: '90%', background: '#F6E27A', borderRadius: '1px', animation: 'barWave3 0.9s ease-in-out infinite alternate' }} />
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>🎵</span>
              <span>Putar Lagu 💖</span>
            </>
          )}
        </button>

        <style>{`
          @keyframes spinRecord {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes gentlePulseButton {
            0%, 100% { transform: scale(1); box-shadow: 0 4px 18px rgba(246, 226, 122, 0.4); }
            50% { transform: scale(1.06); box-shadow: 0 8px 26px rgba(246, 226, 122, 0.7); }
          }
          @keyframes barWave1 {
            0% { height: 30%; }
            100% { height: 100%; }
          }
          @keyframes barWave2 {
            0% { height: 100%; }
            100% { height: 25%; }
          }
          @keyframes barWave3 {
            0% { height: 40%; }
            100% { height: 90%; }
          }
        `}</style>
      </div>
    </>
  );
}
