"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Shield, LogOut, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode') === 'true';
    setIsAdmin(adminMode);

    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Add scroll listener for Navbar visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      const password = window.prompt('Enter Admin Password:');
      if (password === 'rifky123') {
        setIsAdmin(true);
        localStorage.setItem('adminMode', 'true');
        window.location.reload();
      } else if (password !== null) {
        alert('Incorrect password!');
      }
      setClickCount(0);
    }

    setTimeout(() => setClickCount(0), 2000);
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminMode');
    window.location.reload();
  };

  return (
    <nav className={`navbar ${isVisible ? '' : 'navbar-hidden'}`}>
      <div className="container">

        {/* Left Side: Logo & Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '28px', height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            boxShadow: '0 0 15px var(--primary-glow)'
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Link href="/" className="nav-brand text-gradient" style={{ display: 'flex', alignItems: 'center' }}>
              Rifky Akbar Utomo Putra
              <span
                onClick={handleSecretClick}
                style={{ color: 'var(--text-main)', cursor: 'default' }}
                title="."
              >
                .
              </span>
            </Link>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1', fontWeight: 500 }}>
              Creative Developer & UI/UX Designer
            </span>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/projects" className={`nav-link ${pathname === '/projects' ? 'active' : ''}`}>
            Projects
          </Link>
          <Link href="/certifications" className={`nav-link ${pathname === '/certifications' ? 'active' : ''}`}>
            Certifications
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '8px', borderRadius: '50%', border: 'none' }}
            title="Toggle Theme"
          >
            {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAdmin && (
            <button
              onClick={logoutAdmin}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <LogOut size={14} /> Exit
            </button>
          )}
          <a
            href="#contact"
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)' }}
          >
            Contact Me
          </a>
        </div>

      </div>
    </nav>
  );
}
