"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { UploadCloud, ShieldCheck, CreditCard, Calendar, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ktpFileName, setKtpFileName] = useState("");
  const [selfieFileName, setSelfieFileName] = useState("");

  const handlePayment = async () => {
    try {
      if (!ktpFileName || !selfieFileName) {
        throw new Error("Mohon unggah dokumen KTP dan Selfie terlebih dahulu untuk verifikasi.");
      }

      setIsLoading(true);
      setErrorMessage("");

      // Dummy payload for testing since we don't have authentications
      const payload = {
        userId: "00000000-0000-0000-0000-000000000000",
        carId: "00000000-0000-0000-0000-000000000000",
        price: 6995000,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
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

      // Membuka popup Snap Midtrans menggunakan Token yang didapat dari Backend API
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
             alert("Pembayaran berhasil!");
             console.log(result);
          },
          onPending: function (result: any) {
             alert("Menunggu pembayaran...");
             console.log(result);
          },
          onError: function (result: any) {
             alert("Pembayaran gagal!");
             console.log(result);
          },
          onClose: function () {
             alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
          }
        });
      } else {
        throw new Error("Midtrans script failed to load");
      }
    } catch (error: any) {
       console.error("Payment setup error:", error);
       setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith('SB-') ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
      />

      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutWrapper}>
          
          {/* Left Column: Forms */}
          <div className={styles.card}>
            <div>
              <h2 className={styles.sectionTitle}>Detail Penyewaan</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Lengkapi data penyewaan dan unggah dokumen e-KYC.</p>
            </div>

            {/* Dates */}
            <div className={styles.dateGroup}>
              <div className={styles.formGroup}>
                <label>Tanggal Pengambilan <Calendar size={14} style={{display:'inline', marginLeft:4}} /></label>
                <input 
                  type="date" 
                  className={styles.inputField} 
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tanggal Pengembalian <Calendar size={14} style={{display:'inline', marginLeft:4}} /></label>
                <input 
                  type="date" 
                  className={styles.inputField} 
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
                {/* KTP Upload */}
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

                {/* Selfie Upload */}
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

          {/* Right Column: Order Summary */}
          <div className={styles.card} style={{ height: 'fit-content' }}>
            
            <div className={styles.carPreview}>
               <div className={styles.carMockImage}>🚙</div>
               <div className={styles.carMockText}>Toyota Alphard Premium</div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Ringkasan Pembayaran</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tarif Sewa (3 Hari)</span>
                <span className={styles.summaryValue}>Rp 4.500.000</span>
              </div>
              
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Pajak & Biaya Layanan (11%)</span>
                <span className={styles.summaryValue}>Rp 495.000</span>
              </div>

              <div className={styles.summaryItem} style={{ borderBottom: '1px dashed rgba(255,255,255,0.2)' }}>
                <span className={styles.summaryLabel} style={{display:'flex', alignItems:'center', gap: '0.5rem', color: '#fbbf24'}}>
                  <AlertCircle size={16} /> Dana Titipan (Escrow)
                </span>
                <span className={styles.summaryValue}>Rp 2.000.000</span>
              </div>

              <div className={styles.summaryItem} style={{ marginTop: '1rem', borderBottom: 'none' }}>
                <span className={styles.summaryLabel} style={{ color: '#fff' }}>Total Keseluruhan</span>
                <span className={styles.totalValue}>Rp 6.995.000</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '-0.5rem', fontStyle: 'italic' }}>
                *Dana titipan akan dikembalikan sepenuhnya setelah mobil dikembalikan tanpa kerusakan.
              </p>
            </div>

            {errorMessage && (
               <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                 {errorMessage}
               </div>
            )}

            <button 
              className={styles.submitBtn} 
              onClick={handlePayment} 
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
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
