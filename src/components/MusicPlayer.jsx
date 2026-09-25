import React, { useEffect, useRef } from 'react';

const AUDIO_SRC = '/birthday_sound.mp3';

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    const playAudio = () => {
      audio.play().catch((err) => {
        // Autoplay may be restricted until user gesture
        console.log('Autoplay waiting for gesture:', err);
      });
    };

    // Attempt direct autoplay
    playAudio();

    // Mobile / Desktop gesture unlock (starts immediately upon first touch/click/key)
    const unlockOnGesture = () => {
      playAudio();
      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
        document.removeEventListener(evt, unlockOnGesture);
      });
    };

    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
      document.addEventListener(evt, unlockOnGesture, { once: true, passive: true });
    });

    return () => {
      ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((evt) => {
        document.removeEventListener(evt, unlockOnGesture);
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
      loop
      preload="auto"
      onEnded={handleEnded}
      style={{ display: 'none' }}
    />
  );
}
