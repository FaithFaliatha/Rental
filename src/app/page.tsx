"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, MapPin, Calendar, Clock, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

import { supabase } from '@/lib/supabase';

export default function Home() {
  const [cars, setCars] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase.from('cars').select('*').limit(3);
        if (data && !error) {
          setCars(data);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCars();
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
          {isLoading ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Memuat data mobil...</p>
          ) : cars.length > 0 ? (
            cars.map(car => (
              <div className={styles.carCard} key={car.id}>
                <div className={styles.carImageWrapper}>
                  <img src={car.image_url} alt={car.name} className={styles.carImage} loading="lazy" />
              </div>
              <div className={styles.carContent}>
                <span className={styles.carCategory}>{car.category}</span>
                <h3 className={styles.carTitle}>{car.name}</h3>
                
                <div className={styles.carFeatures}>
                  <span className={styles.featureItem}><Clock size={16} /> {car.transmission}</span>
                  <span className={styles.featureItem}>•</span>
                  <span className={styles.featureItem}>{car.capacity} Kursi</span>
                </div>

                <div className={styles.carFooter}>
                  <div className={styles.carPrice}>
                    <span className={styles.priceLabel}>Mulai dari</span>
                    <span className={styles.priceValue}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(car.price)}<span style={{fontSize:'0.9rem', color:'var(--foreground-muted)', fontWeight:'normal'}}>/hari</span></span>
                  </div>
                  
                  <Link href={`/checkout?carId=${car.id}`} className={styles.rentBtn}>
                    Sewa <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>Tidak ada mobil tersedia.</p>
        )}
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
