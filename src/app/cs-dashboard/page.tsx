"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Car, Calendar, ShieldCheck, CheckCircle, 
  XCircle, Clock, AlertCircle, LayoutDashboard,
  Users
} from 'lucide-react';
import styles from './dashboard.module.css';

// --- MOCK DATA ---
const MOCK_CARS_STOCK = [
  { id: 1, name: 'Toyota Avanza', type: 'MVP Keluarga', stock: 5, total: 5, status: 'Available', image: '🚗' },
  { id: 4, name: 'Toyota Innova Zenix', type: 'Premium MVP', stock: 2, total: 3, status: 'Available', image: '🚙' },
  { id: 7, name: 'Toyota Alphard', type: 'Luxury MVP', stock: 0, total: 2, status: 'Rented', image: '🚐' },
  { id: 9, name: 'Mercedes-Benz S-Class', type: 'Luxury Sedan', stock: 1, total: 1, status: 'Available', image: '🏎️' },
];

const MOCK_SCHEDULES = [
  { id: 'BK-001', user: 'Budi Santoso', car: 'Toyota Avanza', startDate: '2026-04-06', endDate: '2026-04-09', status: 'Active' },
  { id: 'BK-002', user: 'Siti Aminah', car: 'Toyota Alphard', startDate: '2026-04-08', endDate: '2026-04-10', status: 'Upcoming' },
  { id: 'BK-003', user: 'Andi Wijaya', car: 'Toyota Innova Zenix', startDate: '2026-04-01', endDate: '2026-04-05', status: 'Completed' },
];

const INITIAL_KYC = [
  { id: 'KYC-101', user: 'Rina Marlina', email: 'rina.marlina@example.com', date: '2026-04-06 10:30', status: 'Pending' },
  { id: 'KYC-102', user: 'Ahmad Faiz', email: 'ahmad.faiz@example.com', date: '2026-04-05 14:15', status: 'Approved' },
  { id: 'KYC-103', user: 'Surya Dharma', email: 'surya.d@example.com', date: '2026-04-06 09:00', status: 'Pending' },
];

export default function CSDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Stok Mobil');
  const [kycData, setKycData] = useState(INITIAL_KYC);
  const [carsData, setCarsData] = useState(MOCK_CARS_STOCK);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Cek localStorage karena form login sementara pakai mock
      const localUser = localStorage.getItem('userLog')?.toLowerCase();
      
      let isCS = false;
      if (localUser === 'faith@gmail.com') {
        isCS = true;
      } else {
        // Fallback untuk mengecek Supabase jika login dari mekanisme lain
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user.email?.toLowerCase() === 'faith@gmail.com') {
          isCS = true;
        }
      }

      if (!isCS) {
        router.push('/login'); // Arahkan ke login jika bukan CS
      } else {
        setIsAuthorized(true);
      }
      setIsLoadingAuth(false);
    };
    checkAuth();
  }, [router]);

  const handleStockChange = (id: number, delta: number) => {
    setCarsData(prev => prev.map(car => {
      if (car.id === id) {
        const newStock = Math.max(0, Math.min(car.total, car.stock + delta));
        return {
          ...car,
          stock: newStock,
          status: newStock === 0 ? 'Rented' : 'Available'
        };
      }
      return car;
    }));
  };

  if (isLoadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617', color: '#fff' }}>
        <p>Memverifikasi akses CS...</p>
      </div>
    );
  }

  if (!isAuthorized) return null; // Fallback jika belum di-redirect

  const tabs = [
    { name: 'Stok Mobil', icon: <Car size={18} /> },
    { name: 'Jadwal Mobil', icon: <Calendar size={18} /> },
    { name: 'Verifikasi e-KYC', icon: <ShieldCheck size={18} /> }
  ];

  const handleKycStatus = (id: string, newStatus: string) => {
    setKycData(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
    alert(`Status Verifikasi ${id} berhasil diubah menjadi ${newStatus}.`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available': return <span className={`${styles.badge} ${styles.badgeAvailable}`}><CheckCircle size={14}/> Tersedia</span>;
      case 'Rented': return <span className={`${styles.badge} ${styles.badgeRented}`}><Clock size={14}/> Disewa</span>;
      case 'Active': return <span className={`${styles.badge} ${styles.badgeActive}`}><Car size={14}/> Berjalan</span>;
      case 'Upcoming': return <span className={`${styles.badge} ${styles.badgePending}`}><Calendar size={14}/> Mendatang</span>;
      case 'Completed': return <span className={`${styles.badge} ${styles.badgeCompleted}`}><CheckCircle size={14}/> Selesai</span>;
      case 'Pending': return <span className={`${styles.badge} ${styles.badgePending}`}><AlertCircle size={14}/> Menunggu</span>;
      case 'Approved': return <span className={`${styles.badge} ${styles.badgeAvailable}`}><CheckCircle size={14}/> Disetujui</span>;
      case 'Rejected': return <span className={`${styles.badge} ${styles.badgeRejected}`}><XCircle size={14}/> Ditolak</span>;
      default: return <span className={styles.badge}>{status}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customer Service Dashboard</h1>
        <p className={styles.subtitle}>Kelola inventaris kendaraan, jadwal penyewaan, dan verifikasi profil pengguna.</p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconBlue}`}>
            <Car />
          </div>
          <div className={styles.statContent}>
            <h3>Total Kendaraan Aktif</h3>
            <p>{carsData.reduce((acc, car) => acc + car.total, 0)} Unit</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconGreen}`}>
            <LayoutDashboard />
          </div>
          <div className={styles.statContent}>
            <h3>Penyewaan Berjalan</h3>
            <p>4 Mobil</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconYellow}`}>
            <Users />
          </div>
          <div className={styles.statContent}>
            <h3>Menunggu Verifikasi</h3>
            <p>{kycData.filter(k => k.status === 'Pending').length} Akun</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            className={`${styles.tabBtn} ${activeTab === tab.name ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={styles.contentCard}>
        
        {/* VIEW: STOK MOBIL */}
        {activeTab === 'Stok Mobil' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kendaraan</th>
                  <th>Kategori/Tipe</th>
                  <th>Status</th>
                  <th>Ketersediaan</th>
                </tr>
              </thead>
              <tbody>
                {carsData.map(car => (
                  <tr key={car.id}>
                    <td>
                      <div className={styles.flexCenter}>
                        <span className={styles.carImage}>{car.image}</span>
                        <span style={{ fontWeight: 500 }}>{car.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{car.type}</td>
                    <td>{getStatusBadge(car.status)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleStockChange(car.id, -1)}
                          disabled={car.stock <= 0}
                          style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', cursor: car.stock <= 0 ? 'not-allowed' : 'pointer' }}
                        >-</button>
                        <strong>{car.stock}</strong> <span style={{ color: '#94a3b8' }}>/ {car.total}</span>
                        <button 
                          onClick={() => handleStockChange(car.id, 1)}
                          disabled={car.stock >= car.total}
                          style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', color: '#fff', cursor: car.stock >= car.total ? 'not-allowed' : 'pointer' }}
                        >+</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW: JADWAL MOBIL */}
        {activeTab === 'Jadwal Mobil' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID Booking</th>
                  <th>Penyewa</th>
                  <th>Kendaraan</th>
                  <th>Tgl Pengambilan</th>
                  <th>Tgl Pengembalian</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SCHEDULES.map(schedule => (
                  <tr key={schedule.id}>
                    <td style={{ fontWeight: 600 }}>{schedule.id}</td>
                    <td>
                      <div className={styles.flexCenter}>
                        <div className={styles.avatar}>{schedule.user.charAt(0)}</div>
                        <span>{schedule.user}</span>
                      </div>
                    </td>
                    <td>{schedule.car}</td>
                    <td>{schedule.startDate}</td>
                    <td>{schedule.endDate}</td>
                    <td>{getStatusBadge(schedule.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW: VERIFIKASI E-KYC */}
        {activeTab === 'Verifikasi e-KYC' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID KYC</th>
                  <th>Customer Info</th>
                  <th>Waktu Pengajuan</th>
                  <th>Dokumen</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kycData.map(kyc => (
                  <tr key={kyc.id}>
                    <td style={{ fontWeight: 600 }}>{kyc.id}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 500 }}>{kyc.user}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{kyc.email}</span>
                      </div>
                    </td>
                    <td>{kyc.date}</td>
                    <td>
                      <div className={styles.kycImageWrapper}>
                        <div className={styles.kycThumb} title="Lihat KTP">KTP</div>
                        <div className={styles.kycThumb} title="Lihat Selfie">Selfie</div>
                      </div>
                    </td>
                    <td>{getStatusBadge(kyc.status)}</td>
                    <td>
                      {kyc.status === 'Pending' ? (
                        <div>
                          <button 
                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                            onClick={() => handleKycStatus(kyc.id, 'Approved')}
                          >
                            <CheckCircle size={14} /> Setujui
                          </button>
                          <button 
                            className={`${styles.actionBtn} ${styles.rejectBtn}`}
                            onClick={() => handleKycStatus(kyc.id, 'Rejected')}
                          >
                            <XCircle size={14} /> Tolak
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>Tidak ada aksi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
