"use client";

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import styles from './page.module.css';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hubungi Kami</h1>
        <p className={styles.subtitle}>Tim kami siap membantu mengurus perjalanan kelas atas Anda. Silakan hubungi kami untuk pertanyaan khusus atau reservasi.</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Contact Information */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <MapPin size={24} />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Kantor Pusat</h3>
              <p className={styles.infoText}>
                Gedung Premium Lt. 12<br />
                Jl. Jend. Sudirman Kav. 98<br />
                Jakarta Selatan, 12920
              </p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <Phone size={24} />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Telepon Layanan</h3>
              <p className={styles.infoText}>
                <strong>Reservasi:</strong> +62 811 1234 5678<br />
                <strong>Darurat 24/7:</strong> +62 811 9876 5432
              </p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <Mail size={24} />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Email</h3>
              <p className={styles.infoText}>
                cs@sewamobilpremium.com<br />
                corporate@sewamobilpremium.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Kirim Pesan</h2>
          
          {success && (
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              Pesan berhasil dikirim. Kami akan membalas segera!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                className={styles.input} 
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Alamat Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                className={styles.input} 
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subjek</label>
              <input 
                type="text" 
                name="subject" 
                required 
                className={styles.input} 
                placeholder="Tujuan pesan (contoh: Tanya Harga)"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Pesan</label>
              <textarea 
                name="message" 
                required 
                className={styles.textarea} 
                placeholder="Tulis pesan Anda di sini..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Mengirim...</>
              ) : (
                <><Send size={20} /> Kirim Pesan</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
