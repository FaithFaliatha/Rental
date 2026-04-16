"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { UploadCloud, ShieldCheck, CreditCard, Calendar, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const carIdParam = searchParams.get('carId');
  const [car, setCar] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ktpFileName, setKtpFileName] = useState("");
  const [selfieFileName, setSelfieFileName] = useState("");
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchCar = async () => {
      if (carIdParam) {
        try {
          const { data, error } = await supabase.from('cars').select('*').eq('id', carIdParam).single();
          if (data && !error) {
            setCar(data);
          }
        } catch (err) {
          console.error("Error fetching car detail:", err);
        }
      }
    };
    fetchCar();
  }, [carIdParam]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  const carPricePerDay = car ? car.price : 0;
  const rentTotal = carPricePerDay * days;
  const tax = rentTotal * 0.11;
  const escrow = 100000; // Dana Titipan tetap
  const grandTotal = rentTotal + tax + escrow;

  const handlePayment = async () => {
    try {
      if (!car) {
        throw new Error("Mobil tidak valid. Silakan kembali ke katalog.");
      }
      if (!ktpFileName || !selfieFileName) {
        throw new Error("Mohon unggah dokumen KTP dan Selfie terlebih dahulu untuk verifikasi.");
      }
      if (!startDate || !endDate) {
        throw new Error("Mohon pilih tanggal pengambilan dan pengembalian.");
      }

      setIsLoading(true);
      setErrorMessage("");

      // Dummy payload for testing
      const payload = {
        userId: "00000000-0000-0000-0000-000000000000",
        carId: car.id.toString(),
        price: grandTotal,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        customerDetail: { name: "Test User", email: "test@example.com" }
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendapatkan token pembayaran");
      }

      // Bypass Snap UI jika ini adalah token simulasi/mock
      if (data.isMock) {
        Swal.fire({
          title: 'Simulasi Pembayaran Berhasil!',
          text: 'Transaksi berhasil di-bypass karena kunci API Midtrans Anda belum aktif. (Mode Demo / Sandbox)',
          icon: 'success',
          confirmButtonColor: 'var(--primary)',
          confirmButtonText: 'Tutup'
        });
        return;
      }

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
             Swal.fire({ title: 'Berhasil!', text: 'Pembayaran berhasil dikonfirmasi.', icon: 'success', confirmButtonColor: 'var(--primary)' });
          },
          onPending: function (result: any) {
             Swal.fire({ title: 'Menunggu', text: 'Menunggu pembayaran diselesaikan...', icon: 'info', confirmButtonColor: 'var(--primary)' });
          },
          onError: function (result: any) {
             Swal.fire({ title: 'Gagal', text: 'Pembayaran gagal diproses.', icon: 'error', confirmButtonColor: 'var(--primary)' });
          },
          onClose: function () {
             Swal.fire({
               title: 'Dibatalkan',
               text: 'Anda menutup popup tanpa menyelesaikan pembayaran.',
               icon: 'warning',
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 3000
             });
          }
        });
      } else {
        throw new Error("Midtrans script failed to load");
      }
    } catch (error: any) {
       setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith('SB-') ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
      />

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutWrapper}>
          
          <div className={styles.card}>
            <div>
              <h2 className={styles.sectionTitle}>Detail Penyewaan</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Lengkapi data penyewaan dan unggah dokumen e-KYC.</p>
            </div>

            <div className={styles.dateGroup}>
              <div className={styles.formGroup}>
                <label>Tanggal Pengambilan <Calendar size={14} style={{display:'inline', marginLeft:4}} /></label>
                <input 
                  type="date" 
                  className={styles.inputField} 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tanggal Pengembalian <Calendar size={14} style={{display:'inline', marginLeft:4}} /></label>
                <input 
                  type="date" 
                  className={styles.inputField}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} 
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Lokasi Penjemputan</label>
              <input type="text" placeholder="Contoh: Bandara Soekarno-Hatta / Alamat Rumah" className={styles.inputField} />
            </div>

            <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            <div>
              <h2 className={styles.sectionTitle}>Verifikasi e-KYC Manual</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Dokumen KTP dan Selfie Anda akan diverifikasi secara manual oleh tim kami untuk keamanan transaksi.</p>
              
              <div className={styles.dateGroup}>
                <label className={`${styles.uploadArea} ${ktpFileName ? styles.uploadedArea : ''}`}>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setKtpFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  {ktpFileName ? (
                    <>
                      <CheckCircle className={styles.uploadIconSuccess} />
                      <div style={{display:'flex', flexDirection:'column', gap:'0.25rem'}}>
                        <span className={styles.uploadTitle}>KTP Terunggah</span>
                        <span className={styles.uploadText}>{ktpFileName}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className={styles.uploadIcon} />
                      <div style={{display:'flex', flexDirection:'column', gap:'0.25rem'}}>
                        <span className={styles.uploadTitle}>Unggah KTP</span>
                        <span className={styles.uploadText}>Format JPG, PNG max 5MB</span>
                      </div>
                    </>
                  )}
                </label>

                <label className={`${styles.uploadArea} ${selfieFileName ? styles.uploadedArea : ''}`}>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelfieFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  {selfieFileName ? (
                    <>
                      <CheckCircle className={styles.uploadIconSuccess} />
                      <div style={{display:'flex', flexDirection:'column', gap:'0.25rem'}}>
                        <span className={styles.uploadTitle}>Selfie Terunggah</span>
                        <span className={styles.uploadText}>{selfieFileName}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className={styles.uploadIcon} />
                      <div style={{display:'flex', flexDirection:'column', gap:'0.25rem'}}>
                        <span className={styles.uploadTitle}>Foto Selfie (Wajah)</span>
                        <span className={styles.uploadText}>Harus terang dan jelas</span>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className={styles.card} style={{ height: 'fit-content' }}>
            
            {car ? (
              <div className={styles.carPreview} style={{ background: `url(${car.image_url}) center/cover`, minHeight: '150px', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                 <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 1 }}>
                   <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>{car.name}</div>
                   <div style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>{car.category} • {formatIDR(car.price)}/hari</div>
                 </div>
              </div>
            ) : (
              <div className={styles.carPreview} style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                 Mencari data mobil...
              </div>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <h2 className={styles.sectionTitle}>Ringkasan Pembayaran</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tarif Sewa ({days} Hari)</span>
                <span className={styles.summaryValue}>{formatIDR(rentTotal)}</span>
              </div>
              
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Pajak & Biaya Layanan (11%)</span>
                <span className={styles.summaryValue}>{formatIDR(tax)}</span>
              </div>

              <div className={styles.summaryItem} style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)' }}>
                <span className={styles.summaryLabel} style={{display:'flex', alignItems:'center', gap: '0.5rem', color: '#fbbf24'}}>
                  <AlertCircle size={16} /> Dana Titipan (Escrow)
                </span>
                <span className={styles.summaryValue}>{formatIDR(escrow)}</span>
              </div>

              <div className={styles.summaryItem} style={{ marginTop: '1rem', borderBottom: 'none' }}>
                <span className={styles.summaryLabel} style={{ color: '#fff' }}>Total Keseluruhan</span>
                <span className={styles.totalValue}>{formatIDR(grandTotal)}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '-0.5rem', fontStyle: 'italic' }}>
                *Dana titipan akan dikembalikan sepenuhnya setelah mobil dikembalikan tanpa kerusakan.
              </p>
            </div>

            {errorMessage && (
               <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', margin: '1rem 0' }}>
                 {errorMessage}
               </div>
            )}

            <button 
              className={styles.submitBtn} 
              onClick={handlePayment} 
              disabled={isLoading || !car}
              style={{ opacity: isLoading || !car ? 0.7 : 1, marginTop: '1.5rem' }}
            >
              {isLoading ? (
                <><Loader2 size={20} className="animate-spin" style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', animation: 'spin 1s linear infinite' }} /> Memproses...</>
              ) : (
                <><CreditCard size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} /> Lanjutkan Pembayaran</>
              )}
            </button>

            <div className={styles.securityBadge}>
              <ShieldCheck size={18} />
              <span>Pembayaran Aman oleh Midtrans</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
