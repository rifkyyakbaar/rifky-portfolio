export default function Footer({ profile }: { profile: any }) {
  if (!profile) return null;
  return (
    <footer style={{ position: 'relative', width: '100%' }}>
      <div className="glass-panel reveal" style={{ padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px', background: 'var(--panel-bg)', border: 'none', borderRadius: '0', borderTop: '1px solid var(--panel-border)', marginTop: '0', width: '100%', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#333' }}>
            <img src={profile.footerImage || 'https://via.placeholder.com/80'} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{profile.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{profile.title}</p>
            <p style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{profile.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="social-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
          )}
          {profile.phone && (
            <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} className="social-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
          )}
          {Array.isArray(profile.social) && profile.social.map((s: any, idx: number) => (
            <a key={idx} href={s.url} target="_blank" rel="noreferrer" className="social-circle">
              <img 
                src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${s.platform.toLowerCase().replace(/\s+/g, '')}.svg`}
                style={{ width: '18px', height: '18px', filter: 'invert(1)' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                alt={s.platform}
              />
            </a>
          ))}
        </div>
      </div>
      <div style={{ padding: '24px 48px', width: '100%', background: 'var(--panel-bg)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        © 2025 {profile.name}
      </div>
    </footer>
  );
}
