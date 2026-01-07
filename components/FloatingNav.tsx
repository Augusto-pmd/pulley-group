'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⌂' },
  { href: '/vida-mensual', label: 'Vida Mensual', icon: '📅' },
  { href: '/investments', label: 'Inversiones', icon: '📈' },
  { href: '/activos', label: 'Activos', icon: '🏠' },
  { href: '/emma', label: 'Emma', icon: '💎' },
  { href: '/projections', label: 'Proyecciones', icon: '🔮' },
  { href: '/flows', label: 'Flujos', icon: '💸' },
  { href: '/futurologia', label: 'Futurología', icon: '🔮' },
  { href: '/bitacora', label: 'Bitácora', icon: '📝' },
  { href: '/vista-contador', label: 'Vista Contador', icon: '📊' },
  { href: '/settings', label: 'Ajustes', icon: '⚙️' },
];

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentItem = navItems.find(item => 
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
  );

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-8 right-8 z-[150]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-fast shadow-lg"
          style={{
            backgroundColor: isOpen ? '#B59A6A' : 'rgba(31, 42, 51, 0.9)',
            border: '1px solid rgba(181, 154, 106, 0.3)',
            color: '#F5F2EC',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B59A6A';
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.9)';
            }
          }}
        >
          <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Menú flotante */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-8 z-[149]"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div 
            className="rounded-container p-4 space-y-2 min-w-[200px]"
            style={{
              backgroundColor: 'rgba(31, 42, 51, 0.95)',
              border: '1px solid rgba(181, 154, 106, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-button text-body transition-colors duration-fast"
                  style={{
                    backgroundColor: isActive 
                      ? 'rgba(181, 154, 106, 0.2)' 
                      : 'transparent',
                    color: '#F5F2EC',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto text-caption text-text-secondary opacity-60">•</span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Separador */}
            <div className="my-2 h-px" style={{ backgroundColor: 'rgba(142, 142, 138, 0.2)' }} />

            {/* Ayuda */}
            <div className="px-4 py-2 text-caption text-text-secondary opacity-60">
              ⌘K para búsqueda
            </div>
          </div>
        </div>
      )}
    </>
  );
}

