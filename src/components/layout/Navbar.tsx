"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Car, LogOut, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let unmounted = false;

    // Check initial session
    const getSession = async () => {
      // Prioritize Mock Login
      const localUser = localStorage.getItem('userLog');
      if (localUser && !unmounted) {
        setUserName(localUser.split('@')[0]);
        return;
      }

      // Fallback True Supabase login
      const { data: { session } } = await supabase.auth.getSession();
      if (!unmounted) {
        setUserName(session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || null);
      }
    };
    getSession();

    // Listen for auth changes (login, logout, register)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!unmounted && !localStorage.getItem('userLog')) {
        setUserName(session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || null);
      }
    });

    return () => {
      unmounted = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userLog');
    await supabase.auth.signOut();
    window.location.href = '/';
  };
  if (pathname && pathname.startsWith('/cs-dashboard')) {
    return null;
  }

  return (
    <header className={`${styles.navHeader} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        
        <Link href="/" className={styles.logo}>
          <Car size={28} color="var(--primary)" />
          Sewa<span>Mobil</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Beranda</Link>
          <Link href="/catalog" className={styles.navLink}>Katalog</Link>
          <Link href="/services" className={styles.navLink}>Layanan</Link>
          <Link href="/contact" className={styles.navLink}>Kontak</Link>
        </nav>

        <div className={styles.authButtons}>
          {userName ? (
            <>
              {userName?.toLowerCase() === 'okta' && (
                <Link href="/cs-dashboard" className={styles.navLink} style={{ margin: '0 1rem', color: 'var(--primary)', fontWeight: 'bold' }}>Dashboard CS</Link>
              )}
              <span style={{ color: 'var(--foreground)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={18} color="var(--primary)" /> Halo, {userName}
              </span>
              <button 
                onClick={handleLogout} 
                className={styles.loginBtn}
                style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem' }}
              >
                <LogOut size={16} /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>Masuk</Link>
              <Link href="/register" className={styles.registerBtn}>Daftar</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
