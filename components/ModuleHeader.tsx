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
    default: 'text-text-primary',
    success: 'text-text-primary',
    warning: 'text-text-primary',
    info: 'text-text-primary',
  };

  return (
    <Card padding="large">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <div>
              <h1 className="text-display-3 text-text-primary mb-1">{title}</h1>
              <p className="text-body-large text-text-secondary">{description}</p>
            </div>
            
            {status && (
              <>
                <div className="h-10 w-px" style={{ backgroundColor: 'rgba(142, 142, 138, 0.2)' }} />
                <div>
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-1">
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
                  className="px-4 py-2 text-body font-medium rounded-button transition-all duration-300 relative"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.2)',
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                    border: '1px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                    e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.2) 40%, transparent 70%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(181, 154, 106, 0.2), 0 6px 16px rgba(0, 0, 0, 0.35), 0 0 30px rgba(181, 154, 106, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
                    e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  {primaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={primaryAction.onClick}
                  className="px-4 py-2 text-body font-medium rounded-button transition-all duration-300 relative"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.2)',
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                    border: '1px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                    e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.2) 40%, transparent 70%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(181, 154, 106, 0.2), 0 6px 16px rgba(0, 0, 0, 0.35), 0 0 30px rgba(181, 154, 106, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
                    e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)';
                  }}
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
                  className="px-3 py-1.5 text-body text-text-secondary transition-colors duration-fast"
                  style={{ color: '#8E8E8A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
                >
                  {secondaryAction.label}
                </Link>
              ) : (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-3 py-1.5 text-body text-text-secondary transition-colors duration-fast"
                  style={{ color: '#8E8E8A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
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
                      className="px-3 py-1.5 text-body text-text-secondary transition-colors duration-fast"
                  style={{ color: '#8E8E8A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
                    >
                      {action.label}
                    </Link>
                  ) : (
                    <button
                      onClick={action.onClick}
                      className="px-3 py-1.5 text-body text-text-secondary transition-colors duration-fast"
                  style={{ color: '#8E8E8A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
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

