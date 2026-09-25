import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music, Volume2, VolumeX, Upload, ChevronUp } from 'lucide-react';
import { romanticSynth } from '../utils/audioSynth';

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
  const [volume, setVolume] = useState(0.7);
  const [mode, setMode] = useState('synth'); // 'synth' | 'custom'
  const [customAudioUrl, setCustomAudioUrl] = useState(null);
  const [customSongName, setCustomSongName] = useState('Lagu Pilihan Kita');
  const [isExpanded, setIsExpanded] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
  }, [volume, isMuted]);

  // Rotate quotes every 7s
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Autoplay "Shape of My Heart (Reff)" on entry (with mobile gesture unlock fallback)
  useEffect(() => {
    const startMusicNow = () => {
      try {
        romanticSynth.init();
        romanticSynth.setVolume(isMutedRef.current ? 0 : volumeRef.current);
        romanticSynth.startMelody((prog) => setProgress(prog));
        setIsPlaying(true);
      } catch {
        // AudioContext may require user interaction
      }
    };

    // Attempt direct autoplay
    startMusicNow();

    // Mobile gesture unlock if browser initially suspended the audio context
    const unlockOnTouch = () => {
      startMusicNow();
      ['click', 'touchstart', 'pointerdown'].forEach((evt) => {
        document.removeEventListener(evt, unlockOnTouch);
      });
    };

    ['click', 'touchstart', 'pointerdown'].forEach((evt) => {
      document.addEventListener(evt, unlockOnTouch, { once: true, passive: true });
    });

    return () => {
      ['click', 'touchstart', 'pointerdown'].forEach((evt) => {
        document.removeEventListener(evt, unlockOnTouch);
      });
      romanticSynth.stopMelody();
    };
  }, []);

  // Handle Play / Pause
  const togglePlay = () => {
    if (mode === 'synth') {
      if (isPlaying) {
        romanticSynth.stopMelody();
        setIsPlaying(false);
      } else {
        romanticSynth.setVolume(isMuted ? 0 : volume);
        romanticSynth.startMelody((prog) => setProgress(prog));
        setIsPlaying(true);
      }
    } else if (mode === 'custom') {
      if (!audioRef.current) return;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Playback error:', err);
        });
      }
    }
  };

  // Handle Volume change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    romanticSynth.setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      romanticSynth.setVolume(volume);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      romanticSynth.setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // Handle custom audio file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (isPlaying) {
        romanticSynth.stopMelody();
        if (audioRef.current) audioRef.current.pause();
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomSongName(file.name.replace(/\.[^/.]+$/, ""));
      setMode('custom');
      setIsPlaying(false);
    }
  };

  const switchMode = (newMode) => {
    if (mode === newMode) return;
    if (isPlaying) {
      romanticSynth.stopMelody();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
    setMode(newMode);
  };

  return (
    <>
      {/* Hidden custom audio element */}
      {customAudioUrl && (
        <audio
          ref={audioRef}
          src={customAudioUrl}
          loop
          onTimeUpdate={(e) => {
            if (e.target.duration) {
              setProgress(e.target.currentTime / e.target.duration);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Floating Music Widget (Top-Right Glassmorphism Pill & Expanded Turntable Card) */}
      <aside aria-label="Pemutar Musik Romantis" style={{
        display: 'none',
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 50,
        maxWidth: 'calc(100vw - 32px)'
      }}>
        {/* Compact View Pill */}
        {!isExpanded ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(11, 32, 70, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '999px',
            padding: '8px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
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
              animation: isPlaying ? 'spinRecord 4s linear infinite' : 'none'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--color-gold)'
              }} />
            </div>

            {/* Song title and equalizer */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100px', maxWidth: '170px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#F8FAFC',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {mode === 'synth' ? 'Shape of My Heart (Reff) 🎶' : customSongName}
                </span>
              </div>
              
              {/* Animated Equalizer Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '10px', marginTop: '2px' }}>
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.6s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.9s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.5s' }} />
                <div className="eq-bar" style={{ animationPlayState: isPlaying ? 'running' : 'paused', animationDuration: '0.8s' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--color-gold-light)', marginLeft: '4px' }}>
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
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                color: '#0B2046',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
              title={isPlaying ? 'Jeda' : 'Putar Musik'}
            >
              {isPlaying ? <Pause size={18} fill="#0B2046" /> : <Play size={18} fill="#0B2046" style={{ marginLeft: '2px' }} />}
            </button>
          </div>
        ) : (
          /* Expanded Card View */
          <div style={{
            width: '320px',
            background: 'rgba(10, 25, 52, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.5)',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.6), 0 0 25px rgba(212,175,55,0.2)',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music size={18} color="var(--color-gold)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-gold)', letterSpacing: '0.5px' }}>
                  BGM ROMANTIS
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <ChevronUp size={20} />
              </button>
            </div>

            {/* Turntable / Album Cover */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 0',
              position: 'relative'
            }}>
              {/* Vinyl Disk */}
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #334155 25%, #0f172a 65%, #020617 100%)',
                border: '3px solid var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlaying ? '0 0 20px rgba(212, 175, 55, 0.5)' : '0 6px 15px rgba(0,0,0,0.5)',
                animation: isPlaying ? 'spinRecord 5s linear infinite' : 'none',
                position: 'relative'
              }}>
                {/* Grooves */}
                <div style={{
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.15)'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: '24px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255,255,255,0.1)'
                }} />
                {/* Center sticker */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37, #AA8C2C)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0B2046',
                  fontWeight: 'bold',
                  fontSize: '0.65rem'
                }}>
                  LOVE ❤️
                </div>
              </div>

              {/* Romantic Quote ticker */}
              <div style={{
                marginTop: '14px',
                textAlign: 'center',
                minHeight: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{
                  fontFamily: 'var(--font-cursive)',
                  fontSize: '1.05rem',
                  color: 'var(--color-gold-light)',
                  transition: 'opacity 0.4s ease'
                }}>
                  "{ROMANTIC_QUOTES[quoteIdx]}"
                </p>
              </div>

              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                marginTop: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.round(progress * 100)}%`,
                  height: '100%',
                  background: 'var(--color-gold)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              padding: '0 8px'
            }}>
              {/* Volume / Mute */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={toggleMute}
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer' }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ width: '60px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                />
              </div>

              {/* Main Play / Pause Button */}
              <button
                onClick={togglePlay}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                  color: '#0B2046',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(212, 175, 55, 0.4)',
                  transition: 'transform 0.2s ease'
                }}
                className="pulse-gold-btn"
              >
                {isPlaying ? <Pause size={22} fill="#0B2046" /> : <Play size={22} fill="#0B2046" style={{ marginLeft: '3px' }} />}
              </button>

              {/* Mode switch / Custom upload */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  title="Upload MP3 Lagu Favorit Kalian"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '6px 8px',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={14} />
                  <span>MP3</span>
                </button>
              </div>
            </div>

            {/* Audio Mode Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              marginTop: '14px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: '10px'
            }}>
              <button
                onClick={() => switchMode('synth')}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  fontSize: '0.72rem',
                  borderRadius: '6px',
                  background: mode === 'synth' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  color: mode === 'synth' ? 'var(--color-gold)' : '#94A3B8',
                  border: mode === 'synth' ? '1px solid var(--color-gold)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontWeight: mode === 'synth' ? '600' : 'normal'
                }}
              >
                🎶 Music Box (Offline)
              </button>
              {customAudioUrl && (
                <button
                  onClick={() => switchMode('custom')}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    fontSize: '0.72rem',
                    borderRadius: '6px',
                    background: mode === 'custom' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                    color: mode === 'custom' ? 'var(--color-gold)' : '#94A3B8',
                    border: mode === 'custom' ? '1px solid var(--color-gold)' : '1px solid transparent',
                    cursor: 'pointer',
                    fontWeight: mode === 'custom' ? '600' : 'normal'
                  }}
                >
                  🎧 {customSongName.slice(0, 10)}...
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
