import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, X } from 'lucide-react';

const MEMORIES = [
  { id: 1, image: '/couple_main.jpg', rotation: '-2deg' },
  { id: 2, image: '/couple_memory_1.jpg', rotation: '1.8deg' },
  { id: 3, image: '/all_img_2.jpg', rotation: '-2.2deg' },
  { id: 4, image: '/couple_memory_2.jpg', rotation: '2.5deg' },
  { id: 5, image: '/all_img_4.jpg', rotation: '-1.5deg' },
  { id: 6, image: '/couple_memory_3.jpg', rotation: '1.5deg' },
  { id: 7, image: '/all_img_6.jpg', rotation: '-2deg' },
  { id: 8, image: '/couple_memory_4.jpg', rotation: '2deg' },
  { id: 9, image: '/all_img_9.jpg', rotation: '-1.8deg' },
  { id: 10, image: '/couple_memory_5.jpg', rotation: '1.6deg' },
  { id: 11, image: '/couple_memory_6.jpg', rotation: '-1.2deg' },
  { id: 12, image: '/couple_memory_7.jpg', rotation: '2.2deg' }
];

export default function ScreenMemories({ onNext, onBack }) {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="denim-bg" style={{
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px 60px 16px',
      position: 'relative'
    }}>
      {/* Glowing frame styles */}
      <style>{`
        @keyframes frameGlowAnimation {
          0%, 100% {
            box-shadow: 0 0 12px rgba(246, 226, 122, 0.45), 0 0 24px rgba(212, 175, 55, 0.25), 0 10px 25px rgba(0, 0, 0, 0.65);
            border-color: rgba(246, 226, 122, 0.65);
          }
          50% {
            box-shadow: 0 0 18px rgba(255, 243, 191, 0.75), 0 0 32px rgba(246, 226, 122, 0.45), 0 12px 28px rgba(0, 0, 0, 0.75);
            border-color: rgba(255, 243, 191, 0.9);
          }
        }
        .glowing-photo-card {
          animation: frameGlowAnimation 3s ease-in-out infinite;
          border: 1.5px solid rgba(246, 226, 122, 0.65);
          background: #0d1e38;
          border-radius: 8px;
          position: relative;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .glowing-photo-card:hover {
          transform: translateY(-8px) scale(1.07) rotate(0deg) !important;
          box-shadow: 0 0 25px rgba(255, 243, 191, 0.95), 0 0 45px rgba(246, 226, 122, 0.7), 0 20px 40px rgba(0, 0, 0, 0.85) !important;
          border-color: #FFF3BF !important;
          z-index: 25;
        }
      `}</style>

      <div style={{
        maxWidth: '1080px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-gold-light)',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '700'
          }}>
            <Camera size={16} /> ADE SRI & RYAN
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.1,
            marginTop: '4px'
          }}>
            Our Memories
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '4px' }}>
            Setiap detik bersamamu adalah lembaran kenangan berharga ❤️
          </p>
        </div>

        {/* Aesthetic Scrapbook Collage Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(135px, 28vw, 195px), 1fr))',
          gap: '18px',
          width: '100%',
          padding: '12px 4px 20px 4px'
        }}>
          {MEMORIES.map((m) => (
            <div
              key={m.id}
              className="glowing-photo-card"
              style={{
                transform: `rotate(${m.rotation})`,
                padding: '8px 8px 12px 8px'
              }}
              onClick={() => setActiveModal(m)}
            >
              {/* Cute Washi Tape at Top */}
              <div className="washi-tape" style={{ width: '44px', height: '14px', top: '-7px' }} />

              {/* Photo Frame (no caption, glowing aesthetic) */}
              <div style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                borderRadius: '4px',
                background: '#07152b'
              }}>
                <img
                  src={m.image}
                  alt={`Memory ${m.id}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal for Full View */}
        {activeModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 15, 35, 0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModal(null)}
          >
            <div style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  background: 'rgba(11, 32, 70, 0.9)',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
                }}
              >
                <X size={20} />
              </button>

              <img
                src={activeModal.image}
                alt="Enlarged Memory"
                style={{
                  maxWidth: '100%',
                  maxHeight: '84vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  border: '2px solid rgba(246, 226, 122, 0.7)',
                  boxShadow: '0 0 30px rgba(246, 226, 122, 0.5), 0 25px 60px rgba(0,0,0,0.85)'
                }}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '14px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '1px solid #64748B',
              background: 'transparent',
              color: '#CBD5E1',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Surat</span>
          </button>

          <button
            onClick={onNext}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
              color: '#0B2046',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.2s var(--ease-spring)'
            }}
            className="pulse-gold-btn"
          >
            <span>Buka Hadiah Kupon 🎟️</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
