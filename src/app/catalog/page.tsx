"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Settings, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

const MOCK_CARS = [
  // Umum
  { id: 1, category: 'Umum', name: 'Toyota Avanza', type: 'MVP Keluarga', price: 450000, capacity: 7, transmission: 'Automatic', image: '🚗' },
  { id: 2, category: 'Umum', name: 'Honda Brio', type: 'City Car', price: 350000, capacity: 5, transmission: 'Automatic', image: '🚙' },
  { id: 3, category: 'Umum', name: 'Suzuki Ertiga', type: 'MVP Keluarga', price: 400000, capacity: 7, transmission: 'Manual', image: '🚘' },
  
  // Premium
  { id: 4, category: 'Premium', name: 'Toyota Innova Zenix', type: 'Premium MVP', price: 850000, capacity: 7, transmission: 'Automatic', image: '🚙' },
  { id: 5, category: 'Premium', name: 'Honda CR-V', type: 'Premium SUV', price: 900000, capacity: 5, transmission: 'Automatic', image: '🚘' },
  { id: 6, category: 'Premium', name: 'Mitsubishi Pajero Sport', type: 'Premium SUV', price: 1000000, capacity: 7, transmission: 'Automatic', image: '🚙' },

  // Exclusive
  { id: 7, category: 'Exclusive', name: 'Toyota Alphard', type: 'Luxury MVP', price: 2500000, capacity: 7, transmission: 'Automatic', image: '🚐' },
  { id: 8, category: 'Exclusive', name: 'Lexus LM', type: 'Ultra Luxury MVP', price: 4500000, capacity: 4, transmission: 'Automatic', image: '🚐' },
  { id: 9, category: 'Exclusive', name: 'Mercedes-Benz S-Class', type: 'Luxury Sedan', price: 5000000, capacity: 4, transmission: 'Automatic', image: '🏎️' },
  { id: 10, category: 'Exclusive', name: 'BMW 7 Series', type: 'Luxury Sedan', price: 4800000, capacity: 4, transmission: 'Automatic', image: '🏎️' },
];

export default function CatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const categories = ['Semua', 'Umum', 'Premium', 'Exclusive'];

  const filteredCars = activeTab === 'Semua' 
    ? MOCK_CARS 
    : MOCK_CARS.filter(c => c.category === activeTab);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleRentClick = (carId: number) => {
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
        {filteredCars.map(car => (
          <div key={car.id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              {car.image}
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
