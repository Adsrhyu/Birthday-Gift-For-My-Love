import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2, Sparkles, Heart, Gift } from 'lucide-react';
import { burstOutlineHearts } from '../utils/heartBurst';
import { romanticSynth } from '../utils/audioSynth';

const DAY_ACTIVITIES = [
  {
    id: 'jogging',
    title: 'Jogging Date',
    icon: '🏃‍♂️🌿',
    tag: 'Sehat & Semangat',
    description: 'Lari pagi santai berdua, menghirup udara segar, dan memulai hari ulang tahunmu dengan penuh energi positif serta langkah ceria.'
  },
  {
    id: 'cooking',
    title: 'Cooking Date',
    icon: '🍳👩‍🍳',
    tag: 'Dapur Penuh Tawa',
    description: 'Masak menu favorit berdua di dapur, saling bantu nyiapin bahan sambil bercanda, lalu makan bersama hasil kreasi masakan kita.'
  },
  {
    id: 'movie',
    title: 'Movie Date',
    icon: '🎬🍿',
    tag: 'Santai & Seru',
    description: 'Nonton film atau series favorit sambil santai berdua, ditemani cemilan lezat, dan menikmati quality time yang hangat serta nyaman.'
  },
  {
    id: 'skripsi',
    title: 'Skripsi Date',
    icon: '📚✍️',
    tag: 'Full Support & Cinta',
    description: 'Nemenin dan semangatin kamu ngerjain skripsi dengan penuh cinta, dukungan mental tanpa henti sampai kamu tuntas sidang dan wisuda!'
  }
];

const BONUS_REWARDS = [
  {
    id: 'massage-bonus',
    title: 'Bonus Pijatan selama 10 Menit',
    icon: '💆‍♂️✨',
    category: 'Relaksasi Spesial',
    validity: 'Hanya hari ini',
    description: 'Pijatan lembut dan relaksasi pundak serta punggung selama 10 menit penuh saat kamu merasa lelah setelah seharian beraktivitas.'
  },
  {
    id: 'hug-bonus',
    title: 'Bonus Pelukan Hangat dari Aku',
    icon: '🤗❤️',
    category: 'Unlimited Love',
    validity: 'Berlaku Selamanya',
    description: 'Pelukan hangat paling tulus, nyaman, dan menenangkan kapanpun kamu butuh tempat bersandar, berlaku selamanya tanpa batas waktu.'
  }
];

export default function ScreenVouchers({ onBack, onRestart }) {
  const [completedActivities, setCompletedActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_completed_activities');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [claimedBonuses, setClaimedBonuses] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_claimed_bonuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleActivity = (act) => {
    romanticSynth.playStampSound();
    burstOutlineHearts(window.innerWidth / 2, window.innerHeight * 0.65);

    const isDone = !!completedActivities[act.id];
    const updated = {
      ...completedActivities,
      [act.id]: !isDone
    };

    setCompletedActivities(updated);
    try {
      localStorage.setItem('birthday_completed_activities', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving activity status:', e);
    }
  };

  const handleClaimBonus = (bonus) => {
    if (claimedBonuses[bonus.id]) return;

    romanticSynth.playStampSound();
    burstOutlineHearts(window.innerWidth / 2, window.innerHeight * 0.7);

    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

    const updated = {
      ...claimedBonuses,
      [bonus.id]: {
        claimedAt: dateStr,
        title: bonus.title
      }
    };

    setClaimedBonuses(updated);
    try {
      localStorage.setItem('birthday_claimed_bonuses', JSON.stringify(updated));
    } catch (e) {
      console.log('Error saving bonus status:', e);
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Reset status kegiatan dan bonus agar bisa ditandai ulang?')) {
      setCompletedActivities({});
      setClaimedBonuses({});
      try {
        localStorage.removeItem('birthday_completed_activities');
        localStorage.removeItem('birthday_claimed_bonuses');
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
      padding: '40px 20px 70px 20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '920px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Header Title */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-gold-light)',
            fontSize: '0.82rem',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            fontWeight: '700',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(246, 226, 122, 0.3)',
            padding: '5px 14px',
            borderRadius: '999px',
            marginBottom: '10px'
          }}>
            <Sparkles size={15} /> Rencana Kegiatan Birthday
          </span>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.1rem, 5vw, 3.2rem)',
            fontWeight: '800',
            color: 'var(--color-gold)',
            lineHeight: 1.15,
            marginTop: '4px'
          }}>
            One Day Birthday Date Plan
          </h2>
          <p style={{
            color: '#CBD5E1',
            fontSize: '0.98rem',
            marginTop: '8px',
            maxWidth: '640px',
            lineHeight: 1.6
          }}>
            Rangkaian kegiatan manis yang akan kita lakukan berdua seharian penuh spesial di hari ulang tahunmu. Siap untuk menjelajahi hari indah kita? ❤️
          </p>
        </div>

        {/* Section 1: 4 Main Day Activities */}
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            paddingBottom: '10px'
          }}>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '1.15rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={19} color="var(--color-gold-light)" />
              <span>Agenda Seharian Kita</span>
            </h3>
            <span style={{
              color: 'var(--color-gold-light)',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              4 Kegiatan Spesial
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {DAY_ACTIVITIES.map((act, index) => {
              const isDone = !!completedActivities[act.id];

              return (
                <div
                  key={act.id}
                  style={{
                    position: 'relative',
                    background: isDone
                      ? 'linear-gradient(135deg, #132f54 0%, #09203f 100%)'
                      : 'linear-gradient(135deg, #182e50 0%, #0d1e38 100%)',
                    border: isDone
                      ? '1.5px solid rgba(52, 211, 153, 0.6)'
                      : '1.5px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '16px',
                    padding: '22px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    boxShadow: isDone
                      ? '0 8px 25px rgba(52, 211, 153, 0.15)'
                      : '0 10px 26px rgba(0,0,0,0.35)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Top Bar with Number & Tag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: 'var(--color-gold)',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(246, 226, 122, 0.25)',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        letterSpacing: '0.5px'
                      }}>
                        {`Kegiatan 0${index + 1}`}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '0.72rem',
                      color: 'var(--color-gold-light)',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontWeight: '600'
                    }}>
                      {act.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      fontSize: '2.5rem',
                      lineHeight: '1',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
                    }}>
                      {act.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        color: '#FFFFFF',
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        margin: '0 0 6px 0',
                        letterSpacing: '0.3px'
                      }}>
                        {act.title}
                      </h4>
                      <p style={{
                        color: '#CBD5E1',
                        fontSize: '0.88rem',
                        lineHeight: '1.5',
                        margin: 0
                      }}>
                        {act.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed rgba(255,255,255,0.1)',
                    paddingTop: '12px'
                  }}>
                    <button
                      onClick={() => handleToggleActivity(act)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isDone
                          ? 'rgba(52, 211, 153, 0.2)'
                          : 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                        color: isDone ? '#34D399' : '#0B2046',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isDone ? 'none' : '0 4px 12px rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Berhasil Dilaksanakan ❤️</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          <span>Lakukan Sekarang ✨</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Tambahan Bonus Spesial */}
        <div style={{
          width: '100%',
          maxWidth: '920px',
          margin: '12px auto 0 auto',
          background: 'linear-gradient(145deg, rgba(20, 39, 70, 0.85) 0%, rgba(10, 24, 46, 0.95) 100%)',
          border: '1.5px solid rgba(246, 226, 122, 0.45)',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          boxShadow: '0 12px 35px rgba(0,0,0,0.45), inset 0 0 25px rgba(212, 175, 55, 0.08)',
          boxSizing: 'border-box'
        }}>
          {/* Bonus Header */}
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FDE047',
              fontSize: '0.8rem',
              fontWeight: '800',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: 'rgba(253, 224, 71, 0.15)',
              border: '1px solid rgba(253, 224, 71, 0.35)',
              padding: '4px 14px',
              borderRadius: '999px',
              marginBottom: '6px'
            }}>
              <Gift size={15} /> Hadiah Ekstra
            </span>
            <h3 style={{
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: '800',
              margin: '4px 0'
            }}>
              Tambahan Bonus Spesial
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Bonus manis istimewa dari aku yang siap kamu klaim dan nikmati kapan saja:
            </p>
          </div>

          {/* 2 Bonus Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '18px',
            width: '100%',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            {BONUS_REWARDS.map((bonus) => {
              const isClaimed = !!claimedBonuses[bonus.id];

              return (
                <div
                  key={bonus.id}
                  style={{
                    position: 'relative',
                    background: 'rgba(15, 30, 56, 0.9)',
                    border: '1.5px dashed var(--color-gold)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{
                      fontSize: '2.6rem',
                      lineHeight: '1',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                    }}>
                      {bonus.icon}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: 'var(--color-gold-light)',
                          background: 'rgba(212, 175, 55, 0.15)',
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          {bonus.category}
                        </span>
                      </div>

                      <h4 style={{
                        color: '#FFFFFF',
                        fontSize: '1.15rem',
                        fontWeight: '800',
                        margin: '2px 0 6px 0',
                        letterSpacing: '0.3px'
                      }}>
                        {bonus.title}
                      </h4>

                      <p style={{
                        color: '#CBD5E1',
                        fontSize: '0.86rem',
                        lineHeight: '1.45',
                        margin: 0
                      }}>
                        {bonus.description}
                      </p>
                    </div>
                  </div>

                  {/* Claim Button / Status */}
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    borderTop: '1px dashed rgba(212, 175, 55, 0.25)',
                    paddingTop: '12px'
                  }}>
                    {!isClaimed ? (
                      <button
                        onClick={() => handleClaimBonus(bonus)}
                        style={{
                          padding: '7px 18px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                          color: '#0B2046',
                          fontWeight: '700',
                          fontSize: '0.84rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.35)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                      >
                        <Heart size={15} fill="#0B2046" />
                        <span style={{ whiteSpace: 'nowrap' }}>Klaim Bonus Ini</span>
                      </button>
                    ) : (
                      <span style={{
                        fontSize: '0.82rem',
                        color: '#34D399',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        <CheckCircle2 size={16} /> Diklaim tgl {claimedBonuses[bonus.id]?.claimedAt} ❤️
                      </span>
                    )}

                    <span style={{
                      fontSize: '0.74rem',
                      color: bonus.id === 'massage-bonus' ? '#FDE047' : '#94A3B8',
                      fontWeight: bonus.id === 'massage-bonus' ? '700' : '500',
                      fontStyle: 'italic',
                      background: bonus.id === 'massage-bonus' ? 'rgba(253, 224, 71, 0.12)' : 'transparent',
                      padding: bonus.id === 'massage-bonus' ? '3px 8px' : '0',
                      borderRadius: '6px',
                      border: bonus.id === 'massage-bonus' ? '1px solid rgba(253, 224, 71, 0.3)' : 'none',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}>
                      Masa Berlaku: {bonus.validity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Option if items modified */}
        {(Object.keys(completedActivities).length > 0 || Object.keys(claimedBonuses).length > 0) && (
          <button
            onClick={handleResetAll}
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
            <RotateCcw size={14} /> Reset pilihan kegiatan & bonus
          </button>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          width: '100%',
          justifyContent: 'center',
          marginTop: '10px'
        }}>
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
