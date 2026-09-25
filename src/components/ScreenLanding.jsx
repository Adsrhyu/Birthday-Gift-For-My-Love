import React, { useState } from 'react';
import { burstOutlineHearts } from '../utils/heartBurst';

export default function ScreenLanding({ onNext, config }) {
  const [photoError, setPhotoError] = useState(false);

  const handleOpenGift = (e) => {
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight * 0.65;
    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    // Taburan love polos tanpa isi (hollow outline hearts burst)
    burstOutlineHearts(originX, originY);

    // Beri sedikit jeda agar letupan love terlihat indah sebelum berpindah
    setTimeout(() => {
      onNext();
    }, 450);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 35% 45%, #0d3b84 0%, #062358 55%, #021235 100%)',
      userSelect: 'none',
      boxSizing: 'border-box'
    }}>

      {/* Embedded Keyframe Animations & Responsive Styling */}
      <style>{`
        @keyframes gentleTitleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes gentleSubtitleFloat {
          0%, 100% { transform: rotate(-2deg) translateY(0px); }
          50% { transform: rotate(-1.2deg) translateY(-4px); }
        }
        @keyframes gentleHeartFloat {
          0%, 100% { transform: rotate(5deg) translateY(0px) scale(1); }
          50% { transform: rotate(6.5deg) translateY(-6px) scale(1.02); }
        }
        @keyframes gentleAirplaneFloat {
          0%, 100% { transform: rotate(-22deg) translate(0, 0); }
          50% { transform: rotate(-19deg) translate(2px, -3px); }
        }
        @keyframes gentleButtonPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(255,255,255,0.25);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55), 0 0 24px rgba(255,255,255,0.45);
          }
        }
        @keyframes pointerBounce {
          0%, 100% { transform: translateY(0px) rotate(-22deg); }
          50% { transform: translateY(-6px) rotate(-19deg); }
        }

        /* Desktop and Tablet landscape responsive refinement */
        @media (min-width: 769px) {
          .cover-heart-container {
            top: clamp(65px, 10vh, 115px) !important;
            right: clamp(80px, 12vw, 240px) !important;
            width: clamp(240px, 22vw, 340px) !important;
            height: clamp(240px, 22vw, 340px) !important;
          }
          .cover-airplane-container {
            top: clamp(35px, 6vh, 70px) !important;
            left: clamp(60px, 8vw, 150px) !important;
          }
          .cover-text-group {
            top: 44% !important;
            transform: translateY(-50%) !important;
            left: clamp(60px, 8vw, 150px) !important;
            width: auto !important;
            max-width: 580px !important;
            padding-left: 0 !important;
          }
          .cover-text-group h1 {
            font-size: clamp(4.4rem, 6.2vw, 6.2rem) !important;
          }
          .cover-text-group p {
            font-size: clamp(2.4rem, 3.2vw, 3.4rem) !important;
          }
        }
      `}</style>

      {/* ========================================================== */}
      {/* 1. TORN DENIM RIGHT PANEL & EXACT DASHED STITCH SEAM       */}
      {/* (Faithfully matches user reference photo & media_1790254464836.png) */}
      {/* ========================================================== */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'clamp(145px, 38vw, 360px)',
        zIndex: 2,
        pointerEvents: 'none'
      }}>
        {/* Denim Weave Texture with Smooth S-Curve Mask */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#101d32',
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(255,255,255,0.11) 0px, rgba(255,255,255,0.11) 1px, transparent 1px, transparent 3px),
            repeating-linear-gradient(to bottom, rgba(0,0,0,0.38) 0px, rgba(0,0,0,0.38) 1px, transparent 1px, transparent 4px),
            repeating-linear-gradient(65deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 5px)
          `,
          maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 100 1000'%3E%3Cpath d='M 100 0 L 42 0 C 72 65, 72 65, 42 130 C 12 195, 12 195, 42 260 C 72 325, 72 325, 42 390 C 12 455, 12 455, 42 520 C 72 585, 72 585, 42 650 C 12 715, 12 715, 42 780 C 72 845, 72 845, 42 910 C 18 960, 28 985, 42 1000 L 100 1000 Z' fill='black'/%3E%3C/svg%3E")`,
          WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 100 1000'%3E%3Cpath d='M 100 0 L 42 0 C 72 65, 72 65, 42 130 C 12 195, 12 195, 42 260 C 72 325, 72 325, 42 390 C 12 455, 12 455, 42 520 C 72 585, 72 585, 42 650 C 12 715, 12 715, 42 780 C 72 845, 72 845, 42 910 C 18 960, 28 985, 42 1000 L 100 1000 Z' fill='black'/%3E%3C/svg%3E")`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%'
        }} />

        {/* Thick White Rectangular Dashed Stitch Line */}
        <svg
          viewBox="0 0 100 1000"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <path
            d="M 42 0 C 72 65, 72 65, 42 130 C 12 195, 12 195, 42 260 C 72 325, 72 325, 42 390 C 12 455, 12 455, 42 520 C 72 585, 72 585, 42 650 C 12 715, 12 715, 42 780 C 72 845, 72 845, 42 910 C 18 960, 28 985, 42 1000"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeDasharray="20 10"
            strokeLinecap="butt"
            filter="drop-shadow(-3px 0 5px rgba(0,0,0,0.6))"
          />
        </svg>
      </div>

      {/* ========================================================== */}
      {/* 2. FRAME LOVE OVER DASHED SEAM LINE (LARGE & CRISP HD)     */}
      {/* Exactly placed over the broken/dashed stitch seam area     */}
      {/* ========================================================== */}
      <div
        className="cover-heart-container"
        style={{
          position: 'absolute',
          top: 'clamp(52px, 8.5vh, 85px)',
          right: 'clamp(10px, 4vw, 42px)',
          width: 'clamp(195px, 52vw, 285px)',
          height: 'clamp(195px, 52vw, 285px)',
          zIndex: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 32px rgba(246, 226, 122, 0.8)) drop-shadow(0 0 50px rgba(212, 175, 55, 0.5)) drop-shadow(0 14px 28px rgba(0,0,0,0.7))',
            animation: 'gentleHeartFloat 4.5s ease-in-out infinite',
            cursor: 'pointer',
            transition: 'transform 0.4s var(--ease-spring)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(3deg) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
          }}
        >
          {!photoError ? (
            <img
              src="/heart_lace_hd.png"
              alt="Our Sweet Memory"
              onError={() => setPhotoError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <img
              src={config?.mainPhoto || '/couple_main.jpg'}
              alt="Couple"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          )}
        </div>

        {/* Sparkling Stars next to Heart Frame (strictly gold and soft blue - simplified) */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '-14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 17,
          pointerEvents: 'none'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(147, 197, 253, 0.95)" stroke="#FFFFFF" strokeWidth="0.8" style={{ filter: 'drop-shadow(0 0 8px rgba(147,197,253,0.9))' }}>
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(246, 226, 122, 0.95)" stroke="#FFFFFF" strokeWidth="0.8" style={{ transform: 'translateX(4px)', filter: 'drop-shadow(0 0 7px rgba(246,226,122,0.85))' }}>
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. PAPER AIRPLANE FLYING CLOSE TOWARDS HEART FRAME         */}
      {/* Distance is kept close and connected with swooping trail   */}
      {/* ========================================================== */}
      <div
        className="cover-airplane-container"
        style={{
          position: 'absolute',
          top: 'clamp(24px, 4.4vh, 48px)',
          left: 'clamp(20px, 6vw, 65px)',
          zIndex: 12,
          pointerEvents: 'none'
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Origami Airplane */}
          <svg
            width="46"
            height="46"
            viewBox="0 0 64 64"
            fill="none"
            style={{
              animation: 'gentleAirplaneFloat 3.8s ease-in-out infinite',
              filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.45))'
            }}
          >
            <path d="M6 32 L58 6 L36 58 L28 36 Z" fill="#FFFFFF" />
            <path d="M28 36 L58 6 L36 58" fill="#E2E8F0" />
            <path d="M28 36 L36 46 L40 36" fill="#CBD5E1" />
            <line x1="28" y1="36" x2="58" y2="6" stroke="#94A3B8" strokeWidth="1.2" />
          </svg>

          {/* Dotted Flight Trail (Curves gracefully towards Heart Frame) */}
          <svg
            width="120"
            height="48"
            viewBox="0 0 120 48"
            fill="none"
            style={{ marginLeft: '-8px', marginTop: '10px', opacity: 0.95 }}
          >
            <path
              d="M 6 24 C 30 42, 55 10, 85 24 C 102 32, 112 18, 118 24"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>

        {/* Soft Blue Floating Mini Hearts / Stars near Airplane (NO PINK) */}
        <div style={{ position: 'absolute', top: '36px', left: '10px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#93C5FD">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '16px', left: '56px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#93C5FD">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. MAIN TYPOGRAPHY & CALL TO ACTION (ENLARGED)             */}
      {/* ========================================================== */}
      <div
        className="cover-text-group"
        style={{
          position: 'absolute',
          top: 'clamp(215px, 32vh, 270px)',
          left: 0,
          width: 'calc(100% - clamp(110px, 30vw, 160px))',
          maxWidth: '460px',
          paddingLeft: 'clamp(16px, 5.5vw, 34px)',
          paddingRight: '8px',
          boxSizing: 'border-box',
          zIndex: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        {/* Large Bold Happy Birthday */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(3.4rem, 11.5vw, 5.0rem)',
          fontWeight: '700',
          color: '#FFFFFF',
          lineHeight: 0.95,
          letterSpacing: '-0.5px',
          textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 0 16px rgba(255,255,255,0.2)',
          margin: '0 0 4px 0',
          animation: 'gentleTitleFloat 4s ease-in-out infinite'
        }}>
          Happy<br />Birthday
        </h1>

        {/* Elegant Cursive Subtitle (2 Lines & Static as requested) */}
        <p style={{
          fontFamily: "'Great Vibes', 'Dancing Script', cursive",
          fontSize: 'clamp(1.9rem, 6.4vw, 2.75rem)',
          color: '#FFFFFF',
          fontWeight: '400',
          margin: '8px 0 0 0',
          lineHeight: 1.15,
          display: 'block',
          textShadow: '0 3px 14px rgba(0, 0, 0, 0.65)',
          letterSpacing: '0.5px'
        }}>
          Special gift<br />for special person
        </p>

        {/* Open The Gift Button with Paper Airplane Pointer below */}
        <div style={{ marginTop: 'clamp(14px, 2.2vh, 22px)', zIndex: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
          <button
            onClick={handleOpenGift}
            style={{
              background: '#FFFFFF',
              color: '#0B2046',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: '700',
              fontSize: 'clamp(1.05rem, 3.6vw, 1.22rem)',
              padding: '13px 38px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s var(--ease-spring)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'gentleButtonPulse 3s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.55), 0 0 22px rgba(255,255,255,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(255,255,255,0.25)';
            }}
          >
            Open The Gift
          </button>

          {/* Paper Airplane Pointer below button, bouncing upward */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 64 64"
            fill="none"
            style={{
              animation: 'pointerBounce 1.2s ease-in-out infinite',
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
              marginLeft: '18px'
            }}
          >
            <path d="M6 32 L58 6 L36 58 L28 36 Z" fill="#FFFFFF" />
            <path d="M28 36 L58 6 L36 58" fill="#E2E8F0" />
            <path d="M28 36 L36 46 L40 36" fill="#CBD5E1" />
            <line x1="28" y1="36" x2="58" y2="6" stroke="#94A3B8" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. OPEN SCRAPBOOK ENVELOPE (MATCHING USER REFERENCE PHOTO) */}
      {/* Open watercolor envelope with tilted card & blue hearts    */}
      {/* ========================================================== */}
      <div
        className="cover-envelope-corner"
        style={{
          position: 'absolute',
          bottom: 'clamp(44px, 6.0vh, 70px)',
          right: 'clamp(6px, 1.8vw, 22px)',
          width: 'clamp(180px, 47vw, 245px)',
          height: 'clamp(168px, 43vw, 228px)',
          transform: 'rotate(-14deg)',
          transformOrigin: 'bottom right',
          zIndex: 14,
          pointerEvents: 'none'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>

          {/* 1. Open Back Flap & Deep Inner Lining of Envelope */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            right: '18px',
            height: '84%',
            background: 'linear-gradient(145deg, #A8CEF8 0%, #7CB5F7 45%, #60A5FA 100%)',
            clipPath: 'polygon(0% 36%, 50% 0%, 100% 36%, 100% 100%, 0% 100%)',
            borderRadius: '4px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.38)',
            filter: 'drop-shadow(0 4px 10px rgba(96, 165, 250, 0.25))'
          }}>
            {/* Darker Inner Pocket Cavity */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '64%',
              background: 'linear-gradient(180deg, #4A83D0 0%, #356BB4 100%)',
              boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.32)'
            }} />
          </div>

          {/* 2. White Card Poking Out Tilted (Matches envelope diagonal slant) */}
          <div style={{
            position: 'absolute',
            top: '4%',
            left: '16%',
            width: '74%',
            height: '66%',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 85%, #F1F5F9 100%)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12)',
            transform: 'rotate(-3deg)',
            transformOrigin: 'bottom center',
            zIndex: 3,
            padding: '12px 10px 8px 12px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.9)'
          }}>
            {/* Little Blue Watercolor Heart on Top Right of Card */}
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '8px',
              width: '18px',
              height: '18px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))'
            }}>
              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Signature Calligraphy Title: For my love */}
            <h3 style={{
              fontFamily: "'Dancing Script', 'Great Vibes', cursive",
              fontSize: 'clamp(1.65rem, 5.5vw, 2.25rem)',
              fontWeight: '700',
              color: '#1E293B',
              lineHeight: 1.05,
              margin: '0 0 2px 0',
              letterSpacing: '-0.3px',
              textShadow: '0 1px 2px rgba(0,0,0,0.06)'
            }}>
              For my love
            </h3>

            {/* Delicate Cursive Subtitle: special day */}
            <p style={{
              fontFamily: "'Dancing Script', 'Caveat', cursive",
              fontSize: 'clamp(0.95rem, 3.2vw, 1.25rem)',
              fontWeight: '600',
              color: '#475569',
              lineHeight: 1.15,
              margin: '2px 0 0 0',
              fontStyle: 'italic',
              letterSpacing: '0.3px'
            }}>
              special day
            </p>
          </div>

          {/* 3. Front Pocket Flaps of Envelope (Fold over Card) */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            right: '18px',
            height: '52%',
            zIndex: 4,
            pointerEvents: 'none'
          }}>
            <svg
              viewBox="0 0 200 120"
              preserveAspectRatio="none"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                filter: 'drop-shadow(0 -3px 8px rgba(0,0,0,0.22))'
              }}
            >
              <defs>
                <linearGradient id="envFrontLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="60%" stopColor="#78ABEE" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id="envFrontRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#85B7F2" />
                  <stop offset="60%" stopColor="#6AA0E8" />
                  <stop offset="100%" stopColor="#508BD8" />
                </linearGradient>
                <linearGradient id="envBottomFlapGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#5B95E0" />
                  <stop offset="100%" stopColor="#7FB2F4" />
                </linearGradient>
              </defs>

              {/* Left Flap Fold */}
              <path
                d="M 0 120 L 0 0 L 105 76 Z"
                fill="url(#envFrontLeftGrad)"
                opacity="0.98"
              />

              {/* Right Flap Fold */}
              <path
                d="M 200 120 L 200 0 L 95 76 Z"
                fill="url(#envFrontRightGrad)"
                opacity="0.96"
              />

              {/* Bottom Meeting Fold */}
              <path
                d="M 0 120 L 100 62 L 200 120 Z"
                fill="url(#envBottomFlapGrad)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.2"
              />

              {/* Crisp Highlight Crease Lines */}
              <line x1="0" y1="0" x2="100" y2="72" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
              <line x1="200" y1="0" x2="100" y2="72" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            </svg>
          </div>

          {/* 4. Blue Heart Tucked in Front Pocket Corner */}
          <div style={{
            position: 'absolute',
            bottom: '26%',
            left: '22%',
            width: '24px',
            height: '24px',
            zIndex: 5,
            transform: 'rotate(-14deg)',
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))'
          }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* 5. Floating Soft-Blue Watercolor Hearts around Envelope */}
          <div style={{ position: 'absolute', top: '2%', left: '8%', width: '16px', height: '16px', zIndex: 12, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#93C5FD"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div style={{ position: 'absolute', top: '18%', left: '-6%', width: '22px', height: '22px', zIndex: 12, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.28))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div style={{ position: 'absolute', top: '40%', left: '-15%', width: '26px', height: '26px', zIndex: 12, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div style={{ position: 'absolute', top: '65%', left: '-10%', width: '18px', height: '18px', zIndex: 12, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#93C5FD"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>

          <div style={{ position: 'absolute', top: '4%', right: '22%', width: '22px', height: '22px', zIndex: 12, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.28))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div style={{ position: 'absolute', top: '16%', right: '-4%', width: '26px', height: '26px', zIndex: 12, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#60A5FA"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>
          <div style={{ position: 'absolute', top: '42%', right: '-2%', width: '20px', height: '20px', zIndex: 12, filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.25))' }}>
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#93C5FD"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
          </div>

        </div>
      </div>

      {/* ========================================================== */}
      {/* 6. DARK NAVY LILY FLOWER AT VERY BOTTOM RIGHT CORNER       */}
      {/* Shifted right into the corner (di pojok kanan bawah)       */}
      {/* ========================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(-8px, -1.2vh, -2px)',
          right: 'clamp(-30px, -5vw, -16px)',
          zIndex: 25,
          width: 'clamp(120px, 30vw, 158px)',
          height: 'clamp(130px, 33vw, 172px)',
          transform: 'rotate(10deg)',
          filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.65))',
          pointerEvents: 'none'
        }}
      >
        <img
          src="/blue_lily.png"
          alt="Blue Floral Accent"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* ========================================================== */}
      {/* 6. LUXURIOUS SCALLOPED WHITE LACE TRIM ACROSS BOTTOM       */}
      {/* Delicate, refined size, overlaying bottom edge of envelope */}
      {/* ========================================================== */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'clamp(52px, 7.2vh, 66px)',
        zIndex: 20,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {/* Top Ruffle Arc Layer */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(16px, 2.2vh, 20px)',
          left: 0,
          right: 0,
          height: 'clamp(36px, 5vh, 46px)',
          backgroundImage: 'radial-gradient(circle at 18px 0px, transparent 16px, #FFFFFF 17px)',
          backgroundSize: '36px 36px',
          backgroundRepeat: 'repeat-x',
          filter: 'drop-shadow(0 -3px 6px rgba(0,0,0,0.28))'
        }} />

        {/* Bottom Eyelet Strip */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'clamp(20px, 2.8vh, 26px)',
          background: '#FFFFFF',
          backgroundImage: `
            radial-gradient(circle at 7px 7px, #06225a 2px, transparent 2.5px),
            radial-gradient(circle at 7px 0px, transparent 7px, #FFFFFF 8px)
          `,
          backgroundSize: '14px 14px, 14px 8px',
          backgroundRepeat: 'repeat-x'
        }} />
      </div>

    </div>
  );
}
