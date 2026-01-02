'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // Navegación principal (Nivel 1) - Solo módulos principales
  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/vida-mensual', label: 'Vida Mensual' },
    { href: '/investments', label: 'Inversiones' },
    { href: '/activos', label: 'Activos' },
    { href: '/projections', label: 'Proyecciones' },
    { href: '/emma', label: 'Emma' },
    { href: '/futurologia', label: 'Futurología' },
    { href: '/vista-contador', label: 'Vista Contador' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-[100]">
      <div 
        className="h-full flex items-center justify-between px-6 max-w-[1920px] mx-auto mx-4 mt-2 rounded-capsule backdrop-blur-bar border border-white/30"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          // Gradiente interno sutil + tinte azul apenas perceptible
          backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.75) 0%, rgba(252, 253, 255, 0.6) 100%)',
          // Ambient shadow grande y difusa + borde luminoso azul muy sutil
          boxShadow: `
            0px 8px 40px rgba(0, 0, 0, 0.03),
            0px 2px 12px rgba(0, 0, 0, 0.015),
            0px 0px 0px 1px rgba(255, 255, 255, 0.3),
            0px 0px 0px 0.5px rgba(100, 150, 200, 0.07),
            inset 0px 1px 0px rgba(255, 255, 255, 0.5),
            inset 0px -1px 0px rgba(255, 255, 255, 0.3)
          `,
        }}
      >
        {/* Logo/Título izquierda - 24px desde el borde */}
        <div className="flex items-center">
            <Link 
            href="/" 
            className="text-[18px] font-semibold text-gray-text-primary hover:opacity-80 transition-opacity duration-fast"
          >
            Pulley Group
          </Link>
        </div>

        {/* Navegación central */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            // Detectar ruta activa: exacta o subruta
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
        className={`text-body transition-all duration-fast ${
          isActive
            ? 'text-gray-text-primary font-medium relative'
            : 'text-gray-text-tertiary hover:text-gray-text-primary'
        }`}
        style={isActive ? {
          textShadow: '0px 0px 8px rgba(100, 150, 200, 0.15)',
        } : {}}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones derecha - 24px desde el borde */}
        <div className="flex items-center">
          {/* Placeholder para acciones futuras */}
        </div>
      </div>
    </header>
  );
}

