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
        className="h-full flex items-center justify-between px-6 max-w-[1920px] mx-auto mx-4 mt-2 rounded-capsule"
        style={{
          backgroundColor: '#1F2A33', // Azul petróleo muy oscuro - fondo técnico/headers
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
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
            ? 'text-text-primary font-medium relative'
            : 'text-text-secondary hover:text-text-primary'
        }`}
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

