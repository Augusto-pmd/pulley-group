'use client';

import Link from 'next/link';
import Card from './Card';

interface ContextHeaderProps {
  module: {
    label: string;
    href: string;
  };
  entity?: {
    label: string;
  };
  showDashboard?: boolean;
}

export default function ContextHeader({ module, entity, showDashboard = true }: ContextHeaderProps) {
  return (
    <Card padding="compact">
      <div className="flex items-center gap-3">
        {/* Volver al Dashboard */}
        {showDashboard && (
          <>
            <Link
              href="/"
              className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
            >
              Dashboard
            </Link>
            <span className="text-body text-gray-text-disabled">/</span>
          </>
        )}
        
        {/* Módulo padre */}
        <Link
          href={module.href}
          className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
        >
          {module.label}
        </Link>
        
        {/* Subentidad (si existe) */}
        {entity && (
          <>
            <span className="text-body text-gray-text-disabled">/</span>
            <span className="text-body text-gray-text-primary font-medium">
              {entity.label}
            </span>
          </>
        )}
      </div>
    </Card>
  );
}

