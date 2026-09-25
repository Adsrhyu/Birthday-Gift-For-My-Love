import React, { useState } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import MusicPlayer from './components/MusicPlayer';
import ScreenLanding from './components/ScreenLanding';
import ScreenPin from './components/ScreenPin';
import ScreenCalendar from './components/ScreenCalendar';
import ScreenCake from './components/ScreenCake';
import ScreenLetter from './components/ScreenLetter';
import ScreenMemories from './components/ScreenMemories';
import ScreenVouchers from './components/ScreenVouchers';
import PersonalizerModal from './components/PersonalizerModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_gift_config');
      return saved ? JSON.parse(saved) : {
        partnerName: 'Sayangku',
        pin: '2709',
        mainPhoto: '/couple_main.jpg',
        letterContent: ''
      };
    } catch {
      return {
        partnerName: 'Sayangku',
        pin: '2709',
        mainPhoto: '/couple_main.jpg',
        letterContent: ''
      };
    }
  });

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('birthday_gift_config', JSON.stringify(newConfig));
    } catch (e) {
      console.log('Save error:', e);
    }
  };

  const goToScreen = (index) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentScreen(index);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100dvh' }}>
      {/* Background Falling Stars & Hearts */}
      <BackgroundParticles />

      {/* Floating Romantic Music Player */}
      <MusicPlayer />

      {/* Settings / Personalizer Modal */}
      <PersonalizerModal config={config} onSaveConfig={handleSaveConfig} />

      {/* Active Screen Flow */}
      <main style={{ minHeight: '100dvh' }}>
        {currentScreen === 0 && (
          <ScreenLanding
            config={config}
            onNext={() => goToScreen(1)}
          />
        )}

        {currentScreen === 1 && (
          <ScreenPin
            config={config}
            onNext={() => goToScreen(2)}
            onBack={() => goToScreen(0)}
          />
        )}

        {currentScreen === 2 && (
          <ScreenCalendar
            config={config}
            onNext={() => goToScreen(3)}
            onBack={() => goToScreen(1)}
          />
        )}

        {currentScreen === 3 && (
          <ScreenCake
            config={config}
            onNext={() => goToScreen(4)}
            onBack={() => goToScreen(2)}
          />
        )}

        {currentScreen === 4 && (
          <ScreenLetter
            config={config}
            onNext={() => goToScreen(5)}
            onBack={() => goToScreen(3)}
          />
        )}

        {currentScreen === 5 && (
          <ScreenMemories
            config={config}
            onNext={() => goToScreen(6)}
            onBack={() => goToScreen(4)}
          />
        )}

        {currentScreen === 6 && (
          <ScreenVouchers
            config={config}
            onBack={() => goToScreen(5)}
            onRestart={() => goToScreen(0)}
          />
        )}
      </main>
    </div>
  );
}
