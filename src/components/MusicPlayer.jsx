import React, { useEffect, useRef } from 'react';

const AUDIO_SRC = './birthday_sound.mp3';

export default function MusicPlayer() {
  const audioRef = useRef(null);

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
      if (!audio) return;
      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => {
          // Autoplay blocked by browser policy until first user interaction
          console.log('Waiting for user gesture to start audio:', err.message);
        });
      }
    };

    // Expose global trigger for any action (e.g. Buka Kado) to start music immediately
    window.__playBirthdayMusic = playAudio;

    // 2. Direct attempt immediately upon entering the website
    playAudio();

    // 3. Universal gesture unlock — instantly starts song upon any touch, click, scroll, or key
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

  const handleEnded = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  return (
    <audio
      ref={audioRef}
      src={AUDIO_SRC}
      autoPlay
      loop
      preload="auto"
      onEnded={handleEnded}
      style={{ display: 'none' }}
    />
  );
}
