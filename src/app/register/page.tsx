"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Loader2 } from 'lucide-react';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorStr("");

    try {
      // Mock Registration bypass - Simpan ke localStorage
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulasi delay
      
      const existingUsersStr = localStorage.getItem('mockUsers');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : {};
      
      // Simpan data pendaftaran ke object di localStorage
      existingUsers[formData.email] = {
        password: formData.password,
        fullName: formData.fullName
      };
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
      
      alert('Pendaftaran berhasil! Silakan masuk.');
      router.push('/login');
      
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Buat Akun</h1>
          <p className={styles.authSubtitle}>Bergabung dengan platform penyewaan mobil terbaik.</p>
        </div>

        {errorStr && <div className={styles.errorBox}>{errorStr}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nama Lengkap</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              className={styles.formInput} 
              placeholder="Masukkan nama sesuai KTP"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Alamat Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className={styles.formInput} 
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Kata Sandi</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength={6}
              className={styles.formInput} 
              placeholder="Minimal 6 karakter"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus />}
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>


        <div className={styles.authFooter}>
          Sudah punya akun? 
          <Link href="/login" className={styles.authLink}>Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
