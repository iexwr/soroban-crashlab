'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="container-full page-padding fade-in">
      <div className="mb-4 sm:mb-6">
        <h1 className="heading-page">Settings</h1>
        <p className="text-meta mt-0.5 sm:mt-1">System configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { href: '/settings/alerting', title: 'Alerting', desc: 'Configure notification presets and alert thresholds', icon: '◉' },
          { href: '/settings/reporting', title: 'Reporting', desc: 'Report generation templates and export preferences', icon: '⊞' },
          { href: '/settings/accessibility', title: 'Accessibility', desc: 'Keyboard navigation, screen reader and contrast settings', icon: '◈' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card card-padding card-interactive flex items-start gap-3 sm:gap-4 text-decoration-none">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0" style={{ background: '#E7F0F9', color: '#0A66C2' }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-meta mt-0.5 text-xs sm:text-sm">{item.desc}</p>
            </div>
            <span className="text-meta shrink-0">→</span>
          </Link>
        ))}
        <div className="card card-padding flex items-start gap-4" style={{ opacity: 0.6 }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#F0F0F0', color: '#666666' }}>
            ⚙
          </div>
          <div className="flex-1">
            <h3 className="font-semibold" style={{ color: '#191919' }}>API Configuration</h3>
            <p className="text-meta mt-1">Coming soon - Backend URL, rate limits and authentication</p>
          </div>
        </div>
      </div>

      <div className="card card-padding">
        <h3 className="font-semibold text-sm mb-4" style={{ color: '#666666' }}>Current Configuration</h3>
        <div className="space-y-3">
          {[
            { label: 'API URL', value: process.env.NEXT_PUBLIC_API_URL || 'Not configured (using mock data)' },
            { label: 'Environment', value: process.env.NEXT_PUBLIC_VERCEL_ENV || 'Development' },
            { label: 'Mock Data', value: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false' ? 'Enabled' : 'Disabled', color: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA !== 'false' ? '#057642' : '#CC1016' },
          ].map((info) => (
            <div key={info.label} className="flex justify-between items-center py-1">
              <span className="text-meta">{info.label}</span>
              <span className="text-sm font-medium" style={{ color: info.color || '#191919' }}>{info.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
