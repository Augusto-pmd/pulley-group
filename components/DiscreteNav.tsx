'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DiscreteNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/vida-mensual', label: 'Vida Mensual' },
    { href: '/investments', label: 'Inversiones' },
    { href: '/activos', label: 'Activos' },
    { href: '/projections', label: 'Proyecciones' },
    { href: '/emma', label: 'Emma' },
  ];

  // Solo mostrar si no estamos en Dashboard
  if (pathname === '/') return null;

  return (
    <div className="mb-8">
      <nav className="flex items-center gap-1 text-body-small">
        <Link 
          href="/"
          className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
        >
          Dashboard
        </Link>
        {pathname !== '/' && (
          <>
            <span className="text-text-secondary/30">/</span>
            <span className="text-text-secondary">
              {navItems.find(item => pathname.startsWith(item.href) && item.href !== '/')?.label || 'Pulley'}
            </span>
          </>
        )}
      </nav>
    </div>
  );
}

