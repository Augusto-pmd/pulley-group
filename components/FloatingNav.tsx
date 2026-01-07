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
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-fast shadow-lg relative"
          style={{
            // Material translúcido con luz cálida en interacción
            backgroundColor: isOpen 
              ? 'rgba(181, 154, 106, 0.25)' 
              : 'rgba(31, 42, 51, 0.85)',
            backgroundImage: isOpen
              ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)'
              : 'none',
            border: '1px solid rgba(181, 154, 106, 0.3)',
            color: '#F5F2EC',
            backdropFilter: 'blur(12px)',
            boxShadow: isOpen
              ? `
                inset 0 0 20px rgba(181, 154, 106, 0.2),
                0 0 30px rgba(181, 154, 106, 0.25),
                0 4px 12px rgba(0, 0, 0, 0.3)
              `
              : `
                inset 0 0 10px rgba(0, 0, 0, 0.2),
                0 2px 8px rgba(0, 0, 0, 0.25)
              `,
          }}
          onMouseEnter={(e) => {
            setIsOpen(true);
            e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
            e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)';
            e.currentTarget.style.boxShadow = `
              inset 0 0 25px rgba(181, 154, 106, 0.25),
              0 0 40px rgba(181, 154, 106, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.3)
            `;
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.85)';
              e.currentTarget.style.backgroundImage = 'none';
              e.currentTarget.style.boxShadow = `
                inset 0 0 10px rgba(0, 0, 0, 0.2),
                0 2px 8px rgba(0, 0, 0, 0.25)
              `;
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
              // Capa translúcida con profundidad
              backgroundColor: 'rgba(31, 42, 51, 0.9)',
              backgroundImage: `
                radial-gradient(circle at top left, 
                  rgba(181, 154, 106, 0.05) 0%,
                  transparent 50%
                )
              `,
              border: '1px solid rgba(181, 154, 106, 0.2)',
              backdropFilter: 'blur(16px)',
              boxShadow: `
                inset 0 0 20px rgba(0, 0, 0, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(181, 154, 106, 0.1)
              `,
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
                    // Material con luz cálida en foco activo
                    backgroundColor: isActive 
                      ? 'rgba(181, 154, 106, 0.15)' 
                      : 'transparent',
                    backgroundImage: isActive
                      ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.2) 0%, transparent 70%)'
                      : 'none',
                    color: '#F5F2EC',
                    border: isActive 
                      ? '1px solid rgba(181, 154, 106, 0.25)'
                      : '1px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.08)';
                      e.currentTarget.style.backgroundImage = 'radial-gradient(circle at center, rgba(181, 154, 106, 0.1) 0%, transparent 70%)';
                      e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.backgroundImage = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
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

