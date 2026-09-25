import React, { useState } from 'react';
import { Settings, X, Save, Image, Key, User, FileText, Check } from 'lucide-react';

export default function PersonalizerModal({ config, onSaveConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [partnerName, setPartnerName] = useState(config.partnerName || 'Sayangku');
  const [pin, setPin] = useState(config.pin === '2709' ? '3112' : (config.pin || '3112'));
  const [letterContent, setLetterContent] = useState(config.letterContent || '');
  const [mainPhoto, setMainPhoto] = useState(config.mainPhoto || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMainPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newConfig = {
      ...config,
      partnerName,
      pin,
      letterContent,
      mainPhoto: mainPhoto || config.mainPhoto
    };
    onSaveConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Gear Button (Bottom Left) */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 40,
          background: 'rgba(11, 32, 70, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          color: 'var(--color-gold-light)',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        title="Pengaturan Kado (Ubah Nama / Foto / Surat)"
      >
        <Settings size={18} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 15, 35, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setIsOpen(false)}
        >
          <div style={{
            background: '#0B2046',
            border: '2px solid var(--color-gold)',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '26px',
            color: '#F8FAFC',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              color: 'var(--color-gold)',
              marginBottom: '4px'
            }}>
              Pengaturan Kado Spesial
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
              Sesuaikan nama, foto, atau isi surat cinta agar kado ini semakin personal untuk pacarmu.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Partner Name */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-gold-light)', marginBottom: '6px' }}>
                  <User size={15} /> Panggilan / Nama Pacar
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Misal: Sayangku, Dimas, Rama"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* PIN */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-gold-light)', marginBottom: '6px' }}>
                  <Key size={15} /> Kode PIN Rahasia (4 Digit)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="3112"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    letterSpacing: '2px'
                  }}
                />
              </div>

              {/* Custom Photo Upload */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-gold-light)', marginBottom: '6px' }}>
                  <Image size={15} /> Ganti Foto Utama Berdua
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{
                    width: '100%',
                    fontSize: '0.85rem',
                    color: '#CBD5E1'
                  }}
                />
                {mainPhoto && (
                  <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-gold)' }}>
                    <img src={mainPhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Custom Letter Content */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-gold-light)', marginBottom: '6px' }}>
                  <FileText size={15} /> Pesan Surat Cinta Pribadi
                </label>
                <textarea
                  rows={6}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  placeholder="Tulis ucapan dan isi hatimu di sini..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: savedSuccess ? '#10B981' : 'linear-gradient(135deg, #F6E27A, #D4AF37)',
                  color: '#0B2046',
                  fontWeight: '700',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                  transition: 'background 0.3s ease'
                }}
              >
                {savedSuccess ? (
                  <>
                    <Check size={18} /> Tersimpan Berhasil!
                  </>
                ) : (
                  <>
                    <Save size={18} /> Simpan Pengaturan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
