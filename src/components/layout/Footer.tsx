import React from 'react';
import Link from 'next/link';
import { Car, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        
        <div className={styles.footerBrand}>
          <div className={styles.logo}>
            <Car size={24} color="var(--primary)" />
            Sewa<span>Mobil</span>
          </div>
          <p className={styles.brandDesc}>
            Platform penyewaan mobil nomor satu dengan pengalaman pengguna terbaik, jaminan aman menggunakan Escrow Midtrans, dan e-KYC instant.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
            <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
            <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className={styles.footerTitle}>Perusahaan</h4>
          <div className={styles.footerLinks}>
            <Link href="#">Tentang Kami</Link>
            <Link href="#">Karir</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Mitra Bisnis</Link>
          </div>
        </div>

        <div>
          <h4 className={styles.footerTitle}>Dukungan</h4>
          <div className={styles.footerLinks}>
            <Link href="#">Help Center</Link>
            <Link href="#">Syarat & Ketentuan</Link>
            <Link href="#">Kebijakan Privasi</Link>
            <Link href="#">FAQ</Link>
          </div>
        </div>

        <div>
           <h4 className={styles.footerTitle}>Hubungi Kami</h4>
           <div className={styles.footerLinks}>
             <a href="mailto:support@sewamobil.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Mail size={16} /> support@sewamobil.com
             </a>
             <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
               Jl. Sudirman No 123, Jakarta<br />
               Indonesia, 12190
             </p>
           </div>
        </div>

      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} SewaMobil Premium. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Indonesian (ID)</span>
        </div>
      </div>
    </footer>
  );
}
