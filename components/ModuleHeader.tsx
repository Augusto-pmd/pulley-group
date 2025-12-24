'use client';

import Link from 'next/link';
import Card from './Card';

interface ModuleHeaderProps {
  title: string;
  description: string;
  status?: {
    label: string;
    value: string;
    color?: 'default' | 'success' | 'warning' | 'info';
  };
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryActions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export default function ModuleHeader({
  title,
  description,
  status,
  primaryAction,
  secondaryAction,
  secondaryActions,
}: ModuleHeaderProps) {
  const statusColors = {
    default: 'text-gray-text-primary',
    success: 'text-green-success',
    warning: 'text-orange-warning',
    info: 'text-blue-system',
  };

  return (
    <Card padding="large">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-display-3 text-gray-text-primary mb-1">{title}</h1>
              <p className="text-body-large text-gray-text-tertiary">{description}</p>
            </div>
            
            {status && (
              <>
                <div className="h-10 w-px bg-gray-divider" />
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                    ESTADO
                  </div>
                  <div className={`text-heading-2 font-semibold ${statusColors[status.color || 'default']}`}>
                    {status.value}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 ml-6">
          {primaryAction && (
            <>
              {primaryAction.href ? (
                <Link
                  href={primaryAction.href}
                  className="px-4 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
                >
                  {primaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={primaryAction.onClick}
                  className="px-4 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
                >
                  {primaryAction.label}
                </button>
              )}
            </>
          )}
          
          {secondaryAction && (
            <div>
              {secondaryAction.href ? (
                <Link
                  href={secondaryAction.href}
                  className="px-3 py-1.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-3 py-1.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
          
          {secondaryActions && secondaryActions.length > 0 && (
            <>
              {secondaryActions.map((action, index) => (
                <div key={index}>
                  {action.href ? (
                    <Link
                      href={action.href}
                      className="px-3 py-1.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                    >
                      {action.label}
                    </Link>
                  ) : (
                    <button
                      onClick={action.onClick}
                      className="px-3 py-1.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                    >
                      {action.label}
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

