// Web Audio API Music Box & Romantic Chimes Generator
// Provides high-fidelity offline audio playback with no external dependencies or CORS risks

class RomanticAudioSynth {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentStep = 0;
    this.timerId = null;
    this.volume = 0.5;
    this.onProgress = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft, bell-like music box tone
  playNote(freq, time, duration = 1.2) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm music box waveform: sine with a hint of triangle
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Subtle natural vibrato
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vib.frequency.setValueAtTime(5, time); // 5Hz gentle vibrato
    vibGain.gain.setValueAtTime(2, time);
    vib.connect(osc.frequency);
    vib.start(time);
    vib.stop(time + duration);

    // Natural bell envelope: fast attack, exponential decay
    const nowVolume = this.volume * 0.35;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(nowVolume, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Play a romantic arpeggio chord
  playChord(frequencies, time, stagger = 0.06) {
    frequencies.forEach((freq, idx) => {
      this.playNote(freq, time + idx * stagger, 1.8);
    });
  }

  // Celebration Chime when candle is blown or code unlocked
  playCelebrationChime() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 E5 G5 C6 E6 G6
    notes.forEach((freq, idx) => {
      this.playNote(freq, now + idx * 0.08, 1.6);
    });
  }

  // Gentle stamp sound
  playStampSound() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Sting - "Shape of My Heart" Chorus / Reff Web Audio Synth (Nylon string acoustic harmonics)
  startMelody(onProgressCallback) {
    this.init();
    this.isPlaying = true;
    this.onProgress = onProgressCallback;

    const N = {
      'F#2': 92.50, 'G#2': 103.83, 'A2': 110.00, 'B2': 123.47,
      'C#3': 138.59, 'D3': 146.83, 'E3': 164.81, 'E#3': 174.61, 'F#3': 185.00,
      'G#3': 207.65, 'A3': 220.00, 'B3': 246.94,
      'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'E#4': 349.23, 'F#4': 369.99,
      'G#4': 415.30, 'A4': 440.00, 'B4': 493.88,
      'C#5': 554.37, 'D5': 587.33, 'E5': 659.25, 'F#5': 739.99
    };

    const shapeOfMyHeartReff = [
      // Intro Hook motif (F#m -> C#m/E -> D -> C#7)
      { melody: N['C#5'], bass: N['F#2'], harm: N['A3'], dur: 0.45 },
      { melody: N['B4'],  bass: null,     harm: N['C#4'], dur: 0.35 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.35 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['A4'],  bass: N['E2'],  harm: N['G#3'], dur: 0.60 },

      { melody: N['B4'],  bass: null,     harm: N['B3'],  dur: 0.40 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.35 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['G#4'], bass: N['D2'],  harm: N['F#3'], dur: 0.60 },

      { melody: N['A4'],  bass: null,     harm: N['A3'],  dur: 0.40 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['E#4'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['F#4'], bass: N['C#2'], harm: N['E#3'], dur: 0.70 },

      // REFF LINE 1: "I know that the spades are the swords of a soldier"
      { melody: N['F#4'], bass: N['F#2'], harm: N['C#4'], dur: 0.32 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.28 },
      { melody: N['A4'],  bass: null,     harm: N['A3'],  dur: 0.35 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['B4'],  bass: N['E2'],  harm: N['G#3'], dur: 0.75 },

      // REFF LINE 2: "I know that the clubs are weapons of war"
      { melody: N['B4'],  bass: null,     harm: N['B3'],  dur: 0.32 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.28 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.32 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.28 },
      { melody: N['B4'],  bass: null,     harm: null,     dur: 0.35 },
      { melody: N['C#5'], bass: null,     harm: null,     dur: 0.40 },
      { melody: N['B4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['G#4'], bass: N['D2'],  harm: N['F#3'], dur: 0.75 },

      // REFF LINE 3: "I know that diamonds mean money for this art"
      { melody: N['F#4'], bass: null,     harm: N['A3'],  dur: 0.32 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.28 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.32 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.28 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.30 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.30 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.32 },
      { melody: N['C#5'], bass: N['C#2'], harm: N['E#3'], dur: 0.80 },

      // REFF LINE 4: "But that's not the shape of my heart"
      { melody: N['C#5'], bass: null,     harm: N['G#3'], dur: 0.42 },
      { melody: N['B4'],  bass: null,     harm: null,     dur: 0.36 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.36 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.36 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.36 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.38 },
      { melody: N['F#4'], bass: N['F#2'], harm: N['C#4'], dur: 1.10 },

      // TAG: "That's not the shape... the shape of my heart"
      { melody: N['A4'],  bass: N['D2'],  harm: N['F#3'], dur: 0.45 },
      { melody: N['G#4'], bass: null,     harm: null,     dur: 0.38 },
      { melody: N['F#4'], bass: null,     harm: null,     dur: 0.55 },
      { melody: N['D5'],  bass: N['E2'],  harm: N['G#3'], dur: 0.40 },
      { melody: N['C#5'], bass: null,     harm: null,     dur: 0.35 },
      { melody: N['B4'],  bass: null,     harm: null,     dur: 0.35 },
      { melody: N['A4'],  bass: null,     harm: null,     dur: 0.35 },
      { melody: N['G#4'], bass: N['C#2'], harm: N['E#3'], dur: 0.60 },
      { melody: N['F#4'], bass: N['F#2'], harm: N['A3'],  dur: 1.80 }
    ];

    let noteIndex = 0;
    const playNext = () => {
      if (!this.isPlaying) return;

      const item = shapeOfMyHeartReff[noteIndex];
      const now = this.ctx.currentTime;

      if (item.melody) {
        this.playNote(item.melody, now, item.dur * 1.1);
      }
      if (item.harm) {
        this.playNote(item.harm, now + 0.03, item.dur * 0.9);
      }
      if (item.bass) {
        this.playNote(item.bass, now, item.dur * 1.5);
      }

      if (this.onProgress) {
        this.onProgress((noteIndex + 1) / shapeOfMyHeartReff.length);
      }

      noteIndex = (noteIndex + 1) % shapeOfMyHeartReff.length;
      this.timerId = setTimeout(playNext, item.dur * 1000);
    };

    playNext();
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }
}

export const romanticSynth = new RomanticAudioSynth();
