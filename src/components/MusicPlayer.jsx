import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronUp, Music } from 'lucide-react';

const AUDIO_SRC = '/birthday_sound.mp3';
const SONG_TITLE = 'Special Birthday Sound 🎵';

const ROMANTIC_QUOTES = [
  "Setiap melodi cinta mengingatkanku padamu... ❤️",
  "Kamu adalah lagu terindah dalam hidupku ✨",
  "Hari ini harimu, tersenyumlah yang paling manis! 🎂",
  "Terima kasih sudah selalu jadi rumah tempatku pulang 🏡",
  "Semoga di usiamu yang baru, semua impianmu terkabul 💫"
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Rotate quotes every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Autoplay and auto-loop on initial entry or first user touch/click
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMutedRef.current ? 0 : volumeRef.current;

    const playAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Autoplay waiting for user gesture:', err);
      });
    };

    // Attempt direct autoplay
    playAudio();

    // Mobile / Browser gesture unlock for audio policy
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

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Playback error:', err);
      });
    }
  };

  // Handle Volume change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // Ensure continuous looping from start to finish
  const handleEnded = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Loop restart error:', e);
      });
    }
  };

  return (
    <>
      {/* Background TikTok Audio Element with Seamless Loop */}
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onTimeUpdate={(e) => {
          if (e.target.duration) {
            setProgress(e.target.currentTime / e.target.duration);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />

      {/* Floating Music Widget (Top-Right Glassmorphism Pill & Expanded Turntable Card) */}
      <aside aria-label="Pemutar Musik Romantis" style={{
        position: 'fixed',
        top: '14px',
        right: '14px',
        zIndex: 50,
        maxWidth: 'calc(100vw - 28px)'
      }}>
        {/* Compact View Pill */}
        {!isExpanded ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(11, 32, 70, 0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '999px',
              padding: '6px 12px 6px 8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45), 0 0 14px rgba(212, 175, 55, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsExpanded(true)}
          >
            {/* Spinning Vinyl Disk */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #2d3748 30%, #1a202c 70%, #0B2046 100%)',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPlaying ? '0 0 10px rgba(212, 175, 55, 0.6)' : 'none',
              animation: isPlaying ? 'spinRecord 4s linear infinite' : 'none',
              flexShrink: 0
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--color-gold)'
              }} />
            </div>

            {/* Song title and equalizer */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '95px', maxWidth: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#F8FAFC',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {SONG_TITLE}
                </span>
              </div>

              {/* Animated Equalizer Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '10px', marginTop: '2px' }}>
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.6s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.9s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.5s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.8s' }} />
                <span style={{ fontSize: '0.66rem', color: 'var(--color-gold-light)', marginLeft: '4px', fontWeight: '600' }}>
                  {isPlaying ? 'Memutar...' : 'Klik putar'}
                </span>
              </div>
            </div>

            {/* Quick Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                color: '#0B2046',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                flexShrink: 0
              }}
              title={isPlaying ? 'Jeda' : 'Putar Musik'}
            >
              {isPlaying ? <Pause size={16} fill="#0B2046" /> : <Play size={16} fill="#0B2046" style={{ marginLeft: '2px' }} />}
            </button>
          </div>
        ) : (
          /* Expanded Card View */
          <div style={{
            width: '290px',
            background: 'rgba(11, 32, 70, 0.94)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 25px rgba(212, 175, 55, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeIn 0.25s ease'
          }}>
            {/* Top Bar with Title & Minimize Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Music size={16} color="var(--color-gold)" />
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-gold-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Sound Spesial Birthday
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
                title="Kecilkan"
              >
                <ChevronUp size={18} />
              </button>
            </div>

            {/* Turntable Vinyl Representation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '10px 0'
            }}>
              {/* Big Spinning Record */}
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2d3748 25%, #1a202c 60%, #0B2046 100%)',
                border: '3px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying ? '0 0 20px rgba(212, 175, 55, 0.5)' : 'none',
                animation: isPlaying ? 'spinRecord 4s linear infinite' : 'none',
                position: 'relative'
              }}>
                {/* Grooves */}
                <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.15)' }} />
                <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                {/* Center Label */}
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--color-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0B2046' }} />
                </div>
              </div>
            </div>

            {/* Song Info */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px' }}>
                {SONG_TITLE}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#93C5FD', fontStyle: 'italic', minHeight: '32px' }}>
                "{ROMANTIC_QUOTES[quoteIdx]}"
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #F6E27A, #D4AF37)',
                transition: 'width 0.2s linear'
              }} />
            </div>

            {/* Controls (Play/Pause & Volume) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
              <button
                onClick={togglePlay}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                  color: '#0B2046',
                  fontWeight: '800',
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)'
                }}
              >
                {isPlaying ? <Pause size={15} fill="#0B2046" /> : <Play size={15} fill="#0B2046" />}
                <span>{isPlaying ? 'Jeda' : 'Putar'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={toggleMute}
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title={isMuted ? 'Nyalakan Suara' : 'Bisukan'}
                >
                  {isMuted ? <VolumeX size={17} color="#F87171" /> : <Volume2 size={17} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ width: '70px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
