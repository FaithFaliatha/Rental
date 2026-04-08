"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Loader2 } from 'lucide-react';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState("");
  
  const [formData, setFormData] = useState({
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
      // Ambil data users yang pernah register (jika ada)
      const existingUsersStr = localStorage.getItem('mockUsers');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : {};
      
      const isRegisteredUser = existingUsers[formData.email]?.password === formData.password;

      const emailLower = formData.email.trim().toLowerCase();

      // Mock Authentication 
      if (
        (emailLower === 'faith@gmail.com' && formData.password === '654321') ||
        (emailLower === 'okta@gmail.com' && formData.password === '654321') ||
        isRegisteredUser
      ) {
        // Success Mock Logic
        localStorage.setItem('userLog', emailLower);
        alert('Login berhasil! Selamat datang.');
        if (emailLower === 'faith@gmail.com') {
          window.location.href = '/cs-dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
         throw new Error('Email atau kata sandi salah');
      }
      
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || 'Gagal masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Selamat Datang</h1>
          <p className={styles.authSubtitle}>Masuk untuk melanjutkan pesanan Anda.</p>
        </div>

        {errorStr && <div className={styles.errorBox}>{errorStr}</div>}

        <form onSubmit={handleSubmit}>
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
              className={styles.formInput} 
              placeholder="Masukkan kata sandi"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
            {loading ? "Menautkan..." : "Masuk"}
          </button>
        </form>


        <div className={styles.authFooter}>
          Belum punya akun? 
          <Link href="/register" className={styles.authLink}>Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
}
