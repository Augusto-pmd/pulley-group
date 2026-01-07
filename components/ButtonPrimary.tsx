'use client';

import { ReactNode } from 'react';

interface ButtonPrimaryProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

export default function ButtonPrimary({ 
  children, 
  onClick, 
  href, 
  disabled = false,
  className = '' 
}: ButtonPrimaryProps) {
  const baseStyle = {
    // Material translúcido con luz cálida - oro como reflejo, no relleno
    backgroundColor: 'rgba(181, 154, 106, 0.2)',
    backgroundImage: `
      radial-gradient(circle at 30% 30%, 
        rgba(181, 154, 106, 0.3) 0%,
        rgba(181, 154, 106, 0.15) 40%,
        transparent 70%
      )
    `,
    border: '1px solid rgba(181, 154, 106, 0.4)',
    color: '#F5F2EC',
    backdropFilter: 'blur(8px)',
    boxShadow: `
      inset 0 0 15px rgba(181, 154, 106, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(181, 154, 106, 0.2)
    `,
  };

  const hoverStyle = {
    backgroundColor: 'rgba(181, 154, 106, 0.25)',
    backgroundImage: `
      radial-gradient(circle at 30% 30%, 
        rgba(181, 154, 106, 0.35) 0%,
        rgba(181, 154, 106, 0.2) 40%,
        transparent 70%
      )
    `,
    borderColor: 'rgba(181, 154, 106, 0.5)',
    boxShadow: `
      inset 0 0 20px rgba(181, 154, 106, 0.2),
      0 6px 16px rgba(0, 0, 0, 0.35),
      0 0 30px rgba(181, 154, 106, 0.15),
      0 0 0 1px rgba(181, 154, 106, 0.3)
    `,
  };

  const disabledStyle = {
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  const buttonClasses = `px-6 py-2.5 rounded-button text-body font-medium transition-all duration-300 ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        style={disabled ? { ...baseStyle, ...disabledStyle } : baseStyle}
        onMouseEnter={(e) => {
          if (!disabled) {
            Object.assign(e.currentTarget.style, hoverStyle);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            Object.assign(e.currentTarget.style, baseStyle);
          }
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={disabled ? { ...baseStyle, ...disabledStyle } : baseStyle}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, baseStyle);
        }
      }}
    >
      {children}
    </button>
  );
}

