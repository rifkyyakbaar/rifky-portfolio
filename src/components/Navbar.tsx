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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 8px' }}>

        {/* Left Side: Logo & Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom, #3b82f6, #1e3a8a)'
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Link href="/" style={{ color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
              Rifky Akbar Utomo Putra
              <span
                onClick={handleSecretClick}
                style={{ color: 'transparent', cursor: 'default', userSelect: 'none' }}
              >
                .
              </span>
            </Link>
            <span style={{ fontSize: '0.8rem', color: '#d1d5db', fontWeight: 400 }}>
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
          <Link href="/blogs" className={`nav-link ${pathname === '/blogs' ? 'active' : ''}`}>
            Blogs
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '20px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'rgba(0,0,0,0.3)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            title="Toggle Theme"
          >
            {isLightMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {isAdmin && (
            <button
              onClick={logoutAdmin}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <LogOut size={14} />
            </button>
          )}
          <a
            href="#contact"
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            Contact Me
          </a>
        </div>

      </div>
    </nav>
  );
}
