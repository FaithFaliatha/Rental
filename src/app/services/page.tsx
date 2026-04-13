"use client";

import React from 'react';
import { Shield, Clock, MapPin, Star, Key, Users, Calendar, Briefcase } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <Key size={32} color="#a5b4fc" />,
      title: "Sewa Lepas Kunci",
      description: "Nikmati privasi dan kebebasan penuh dengan menyetir sendiri. Semua unit kami dirawat 100% prima dan siap untuk perjalanan jauh.",
    },
    {
      icon: <Users size={32} color="#a5b4fc" />,
      title: "Sewa dengan Sopir",
      description: "Bersantai di kursi penumpang sambil diantar oleh profesional. Sopir kami berpengalaman, ramah, dan menguasai berbagai rute destinasi.",
    },
    {
      icon: <Calendar size={32} color="#a5b4fc" />,
      title: "Sewa Jangka Panjang",
      description: "Solusi mobilitas untuk perusahaan atau korporasi dengan tarif khusus yang kompetitif, asuransi penuh, dan mobil pengganti jika terjadi kendala.",
    },
    {
      icon: <Briefcase size={32} color="#a5b4fc" />,
      title: "Layanan VIP & Eksklusif",
      description: "Untuk acara pernikahan, tamu kebesaran, atau menjemput klien penting. Dilengkapi pengawalan khusus atau mobil yang ultra mewah.",
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      padding: '8rem 5% 4rem',
      maxWidth: '1400px',
      margin: '0 auto',
      color: 'var(--foreground)'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem'
        }}>
          Layanan Premium Kami
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Kami memahami setiap perjalanan memiliki cerita dan kebutuhan yang berbeda. Pilih layanan yang paling sesuai dengan gaya dan kebutuhan Anda, dan biarkan kami memberikan standar layanan VIP untuk memastikan kenyamanan Anda.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '6rem'
      }}>
        {services.map((service, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '1rem', background: 'rgba(99, 102, 241, 0.1)' }}>
              {service.icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
              {service.title}
            </h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: '#f8fafc' }}>
          Mengapa Memilih Kami?
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
            <Shield size={24} color="#a5b4fc" /> Keamanan Terjamin & Terverifikasi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
            <Clock size={24} color="#a5b4fc" /> Layanan Bantuan 24/7
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
            <MapPin size={24} color="#a5b4fc" /> Armada di Seluruh Indonesia
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#cbd5e1' }}>
            <Star size={24} color="#a5b4fc" /> Dipercaya oleh +5.000 Klien
          </div>
        </div>
      </div>

    </div>
  );
}
