export default function ComingSoon() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      color: 'var(--foreground)'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>Segera Hadir</h1>
      <p style={{ color: 'var(--foreground-muted)' }}>Halaman Layanan sedang dibuat.</p>
    </div>
  );
}
