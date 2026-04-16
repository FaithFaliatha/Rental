"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Settings, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

import { supabase } from '@/lib/supabase';

export default function CatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const categories = ['Semua', 'Umum', 'Premium', 'Exclusive'];

  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase.from('cars').select('*');
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

  const filteredCars = activeTab === 'Semua' 
    ? cars 
    : cars.filter(c => c.category === activeTab);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleRentClick = (carId: string) => {
    router.push(`/checkout?carId=${carId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Katalog Kendaraan</h1>
        <p className={styles.subtitle}>Pilih dari berbagai koleksi kendaraan berkualitas kami, mulai dari mobil keluarga hingga kendaraan eksklusif layaknya VIP.</p>
      </div>

      <div className={styles.tabs}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem 0' }}>Memuat katalog kendaraan...</div>
        ) : filteredCars.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem 0' }}>Kategori ini sedang kosong.</div>
        ) : filteredCars.map(car => (
          <div key={car.id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              <img src={car.image_url} alt={car.name} className={styles.carImage} loading="lazy" />
              <span className={`${styles.badge} ${car.category === 'Exclusive' ? styles.exclusiveBadge : car.category === 'Premium' ? styles.premiumBadge : ''}`}>
                {car.category}
              </span>
            </div>
            
            <div className={styles.content}>
              <h3 className={styles.carName}>{car.name}</h3>
              <p className={styles.carType}>{car.type}</p>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Users size={16} />
                  <span>{car.capacity} Kursi</span>
                </div>
                <div className={styles.feature}>
                  <Settings size={16} />
                  <span>{car.transmission}</span>
                </div>
              </div>

              <div className={styles.priceContainer}>
                <div>
                  <div className={styles.priceLabel}>Mulai dari</div>
                  <div className={styles.priceValue}>{formatPrice(car.price)}<span className={styles.pricePeriod}>/hari</span></div>
                </div>
                <button onClick={() => handleRentClick(car.id)} className={styles.rentBtn} aria-label="Sewa Sekarang">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
