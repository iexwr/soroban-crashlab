'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/runs', label: 'Runs', icon: '⊞' },
  { href: '/analytics', label: 'Analytics', icon: '⊟' },
  { href: '/triage', label: 'Triage', icon: '⚠' },
  { href: '/logs', label: 'Logs', icon: '☰' },
  { href: '/integrations', label: 'Integrations', icon: '⊕' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
  { href: '/maintainer', label: 'Maintainer', icon: '⚑' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggle, mounted } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center px-4 border-b"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg)',
        borderColor: 'var(--border-color)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      <Link href="/" className="flex items-center gap-2 mr-6 text-decoration-none shrink-0 parallax-slow">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: '#0A66C2' }}
        >
          <span className="text-white font-bold text-sm">SC</span>
        </div>
        <span
          className="font-bold text-lg"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          CrashLab
        </span>
      </Link>

      <nav className="flex items-center h-full gap-1 flex-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="top-nav-link shrink-0"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottomColor: isActive ? 'var(--text-primary)' : 'transparent',
              }}
            >
              <span className="top-nav-icon text-sm">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 shrink-0 ml-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: theme === 'dark' ? '#1a1a1a' : '#EEF3F8' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            🔍
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Search runs...
          </span>
        </div>

        {mounted && (
          <button
            onClick={toggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all parallax-medium"
            style={{
              background: theme === 'dark' ? '#1a1a1a' : '#F4F2EE',
              color: theme === 'dark' ? '#e0e0e0' : '#191919',
              border: '1px solid var(--border-color)',
            }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
