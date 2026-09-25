import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { romanticSynth } from '../utils/audioSynth';

const INITIAL_VOUCHERS = [
  {
    id: 'meal',
    title: 'FREE MEAL',
    subtitle: 'Traktir makan sepuasnya 1x tempat pilihanmu',
    icon: '🍔',
    category: 'Kuliner',
    code: 'GIFT-MEAL-01'
  },
  {
    id: 'movie',
    title: 'MOVIE NIGHT',
    subtitle: 'Nonton film bioskop pilihanmu (tiket + popcorn aku bayarin)',
    icon: '🎬',
    category: 'Hiburan',
    code: 'GIFT-CINE-02'
  },
  {
    id: 'wish',
    title: 'ONE WISH',
    subtitle: 'Minta 1 permintaan apa saja dariku tanpa ditolak',
    icon: '✨',
    category: 'Spesial',
    code: 'GIFT-WISH-03'
  },
  {
    id: 'no-arg',
    title: 'NO ARGUMENT DAY',
    subtitle: 'Hari bebas debat seharian, kamu selalu menang & selalu benar',
    icon: '🤫',
    category: 'Spesial',
    code: 'GIFT-PEACE-04'
  },
  {
    id: 'massage',
    title: 'FREE MASSAGE',
    subtitle: 'Pijat relaksasi pundak/punggung 30 menit kalau capek kerja',
    icon: '💆‍♂️',
    category: 'Relaksasi',
    code: 'GIFT-HEAL-05'
  },
  {
    id: 'game',
    title: 'GAME TIME',
    subtitle: 'Bebas push rank/main game seharian tanpa diganggu ngambek',
    icon: '🎮',
    category: 'Hiburan',
    code: 'GIFT-GAME-06'
  }
];

export default function ScreenVouchers({ onBack, onRestart }) {
  const [claimedVouchers, setClaimedVouchers] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_claimed_vouchers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleClaim = (voucher) => {
    if (claimedVouchers[voucher.id]) return;

    romanticSynth.playStampSound();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#F6E27A', '#10B981']
    });

    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const updated = {
      ...claimedVouchers,
      [voucher.id]: {
        claimedAt: dateStr,
        title: voucher.title
      }
    };
    setClaimedVouchers(updated);
    try {
      localStorage.setItem('birthday_claimed_vouchers', JSON.stringify(updated));
    } catch (e) {
      console.log('Local storage error:', e);
    }
  };

  const handleResetVouchers = () => {
    if (window.confirm('Reset semua kupon agar bisa diklaim ulang?')) {
      setClaimedVouchers({});
      try {
        localStorage.removeItem('birthday_claimed_vouchers');
      } catch {
        // Ignored
      }
    }
  };

  return (
    <div className="denim-bg" style={{
      width: '100%',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px 60px 20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '920px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '28px'
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
            fontWeight: '600'
          }}>
            <Ticket size={16} /> Birthday Gifts
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.1,
            marginTop: '4px'
          }}>
            Exclusive Vouchers
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginTop: '6px', maxWidth: '600px' }}>
            Kupon cinta yang berlaku selamanya! Ketuk "Klaim" saat ingin menukarkannya atau screenshot sebagai bukti kado ❤️
          </p>
        </div>

        {/* Voucher Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {INITIAL_VOUCHERS.map((v) => {
            const isClaimed = !!claimedVouchers[v.id];

            return (
              <div
                key={v.id}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #182e50 0%, #0d1e38 100%)',
                  border: '1.5px dashed var(--color-gold)',
                  borderRadius: '16px',
                  padding: '22px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease'
                }}
              >
                {/* Perforated ticket side notches */}
                <div style={{
                  position: 'absolute',
                  left: '-12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0B2046',
                  borderRight: '1.5px dashed var(--color-gold)'
                }} />
                <div style={{
                  position: 'absolute',
                  right: '-12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0B2046',
                  borderLeft: '1.5px dashed var(--color-gold)'
                }} />

                {/* Left Info */}
                <div style={{ flex: 1, paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: 'var(--color-gold-light)',
                      background: 'rgba(212, 175, 55, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      letterSpacing: '0.5px'
                    }}>
                      {v.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontFamily: 'monospace' }}>
                      {v.code}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: '800',
                    fontSize: '1.25rem',
                    color: '#FFFFFF',
                    letterSpacing: '0.5px',
                    margin: '2px 0 6px 0'
                  }}>
                    {v.title}
                  </h3>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#CBD5E1',
                    lineHeight: '1.4'
                  }}>
                    {v.subtitle}
                  </p>

                  {/* Claim Button or Claimed badge */}
                  <div style={{ marginTop: '12px' }}>
                    {!isClaimed ? (
                      <button
                        onClick={() => handleClaim(v)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                          color: '#0B2046',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(212, 175, 55, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Ticket size={15} /> Klaim Kupon
                      </button>
                    ) : (
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#34D399',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle2 size={15} /> Digunakan tgl {claimedVouchers[v.id]?.claimedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Icon & Stamp */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '70px',
                  position: 'relative'
                }}>
                  <span style={{ fontSize: '2.8rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}>
                    {v.icon}
                  </span>

                  {/* Ink Stamp Overlay when claimed */}
                  {isClaimed && (
                    <div
                      className="stamp-active"
                      style={{
                        position: 'absolute',
                        border: '3px solid #EF4444',
                        color: '#EF4444',
                        fontWeight: '900',
                        fontSize: '0.78rem',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        pointerEvents: 'none'
                      }}
                    >
                      TERPAKAI
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset Vouchers Option */}
        {Object.keys(claimedVouchers).length > 0 && (
          <button
            onClick={handleResetVouchers}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            <RotateCcw size={14} /> Reset kupon yang sudah dipakai
          </button>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
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
            <span>Kembali ke Foto</span>
          </button>

          <button
            onClick={onRestart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 30px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              color: '#FFFFFF',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s var(--ease-spring)'
            }}
          >
            <RotateCcw size={18} />
            <span>Selesai (Ke Halaman Awal)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
