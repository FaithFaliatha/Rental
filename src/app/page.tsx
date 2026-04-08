"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, MapPin, Calendar, Clock, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

const MOCK_CARS = [
  {
    id: 1,
    category: "Premium SUV",
    name: "Lexus RX 300",
    image: "https://images.unsplash.com/photo-1533473359331-01f4dfae2e7c?q=80&w=2070&auto=format&fit=crop",
    price: "3.500.000",
    seats: 5,
    transmission: "Automatic"
  },
  {
    id: 2,
    category: "Luxury MPV",
    name: "Toyota Alphard",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop",
    price: "4.500.000",
    seats: 7,
    transmission: "Automatic"
  },
  {
    id: 3,
    category: "Sport Sedan",
    name: "Porsche Panamera",
    image: "https://images.unsplash.com/photo-1503376760341-2e65d214a1a5?q=80&w=2070&auto=format&fit=crop",
    price: "9.500.000",
    seats: 4,
    transmission: "PDK"
  }
];

export default function Home() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem('userLog')?.toLowerCase();
      if (localUser === 'faith@gmail.com') {
        window.location.href = '/cs-dashboard';
      }
    }
  }, []);

  return (
    <div className={styles.main}>
      
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Perjalanan Berkelas, <br />
            <span style={{ color: "var(--primary)" }}>Tanpa Batas.</span>
          </h1>
          <p className={styles.subtitle}>
            Nikmati pengalaman menyewa mobil mewah dengan koleksi terlengkap, verifikasi e-KYC kilat, dan jaminan keamanan deposit Escrow oleh Midtrans.
          </p>
          
          {/* SEARCH WIDGET */}
          <div className={`${styles.bookingWidget} ${styles['hover-lift']}`}>
            <div className={styles.widgetGroup}>
              <span className={styles.widgetLabel}>Lokasi Ambil</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <MapPin size={18} color="var(--foreground-muted)" />
                <input type="text" placeholder="Pilih kota atau bandara..." className={styles.widgetInput} />
              </div>
            </div>
            
            <div className={styles.widgetGroup}>
              <span className={styles.widgetLabel}>Tgl Mulai</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <Calendar size={18} color="var(--foreground-muted)" />
                <input 
                  type="date" 
                  className={styles.widgetInput}
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
            </div>

            <div className={styles.widgetGroup}>
              <span className={styles.widgetLabel}>Tgl Akhir</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <Calendar size={18} color="var(--foreground-muted)" />
                <input 
                  type="date" 
                  className={styles.widgetInput}
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
            </div>

            <button className={styles.widgetBtn}>
              <Search size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Cari Mobil
            </button>
          </div>
        </div>
      </section>

      {/* RECOMMENDED CARS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Armada Premium Kami</h2>
          <p className={styles.sectionSubtitle}>Pilihan eksklusif untuk setiap momen berharga Anda.</p>
        </div>

        <div className={styles.carGrid}>
          {MOCK_CARS.map(car => (
            <div className={styles.carCard} key={car.id}>
              <div className={styles.carImageWrapper}>
                <Image src={car.image} alt={car.name} fill={true} className={styles.carImage} />
              </div>
              <div className={styles.carContent}>
                <span className={styles.carCategory}>{car.category}</span>
                <h3 className={styles.carTitle}>{car.name}</h3>
                
                <div className={styles.carFeatures}>
                  <span className={styles.featureItem}><Clock size={16} /> {car.transmission}</span>
                  <span className={styles.featureItem}>•</span>
                  <span className={styles.featureItem}>{car.seats} Kursi</span>
                </div>

                <div className={styles.carFooter}>
                  <div className={styles.carPrice}>
                    <span className={styles.priceLabel}>Mulai dari</span>
                    <span className={styles.priceValue}>Rp {car.price}<span style={{fontSize:'0.9rem', color:'var(--foreground-muted)', fontWeight:'normal'}}>/hari</span></span>
                  </div>
                  
                  <Link href="/checkout" className={styles.rentBtn}>
                    Sewa <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresWrap}>
        <div className={styles.sectionHeader}>
           <h2 className={styles.sectionTitle}>Kenapa SewaMobil?</h2>
           <p className={styles.sectionSubtitle}>Pengalaman penyewaan terdepan yang tidak Anda temukan di tempat lain.</p>
        </div>
        
        <div className={styles.featuresGrid}>
           <div className={styles.featureBox}>
             <div className={styles.iconWrap}>
               <Zap size={36} />
             </div>
             <h3 className={styles.featureTitle}>e-KYC Instan</h3>
             <p className={styles.featureDesc}>Verifikasi identitas dan dokumen Anda dalam hitungan detik didukung AI. Tanpa proses manual yang bertele-tele.</p>
           </div>
           
           <div className={styles.featureBox}>
             <div className={styles.iconWrap}>
               <ShieldCheck size={36} />
             </div>
             <h3 className={styles.featureTitle}>Escrow Midtrans</h3>
             <p className={styles.featureDesc}>Dana deposit (uang jaminan) Anda 100% tersimpan aman dan secara otomatis dikembalikan penuh di hari pengembalian mobil.</p>
           </div>

           <div className={styles.featureBox}>
             <div className={styles.iconWrap}>
               <CheckCircle size={36} />
             </div>
             <h3 className={styles.featureTitle}>Kondisi Prima</h3>
             <p className={styles.featureDesc}>Armada dibersihkan dan diinspeksi secara menyeluruh sebelum diserahkan demi kenyamanan super premium.</p>
           </div>
        </div>
      </section>

    </div>
  );
}
