import React, { useEffect } from 'react';

const AUDIO_SRC = './birthday_sound.mp3';

export default function MusicPlayer() {
  useEffect(() => {
    // Reference the instant audio element created in index.html, or fallback
    let audio = document.getElementById('birthday-audio');
    if (!audio) {
      audio = new Audio(AUDIO_SRC);
      audio.id = 'birthday-audio';
      audio.loop = true;
      audio.preload = 'auto';
      document.body.appendChild(audio);
    }

    audio.volume = 0.85;

    const playAudio = () => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = 0.85;
      if (audio.paused) {
        audio.play().catch((err) => {
          console.log('Audio autoplay waiting for user interaction:', err.message);
        });
      }
    };

    window.__birthdayAudio = audio;
    window.__playBirthdayMusic = playAudio;

    // Immediately trigger play upon React mounting
    playAudio();

    // Universal unlock on any user interaction anywhere on the screen
    const unlockOnGesture = () => {
      playAudio();
    };

    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown'];
    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, unlockOnGesture, { capture: true, passive: true });
      document.addEventListener(evt, unlockOnGesture, { capture: true, passive: true });
    });

    return () => {
      ['click', 'touchstart', 'touchend', 'pointerdown', 'mousedown', 'scroll', 'keydown'].forEach((evt) => {
        window.removeEventListener(evt, unlockOnGesture, { capture: true });
        document.removeEventListener(evt, unlockOnGesture, { capture: true });
      });
    };
  }, []);

  return null;
}
