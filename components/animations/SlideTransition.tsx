'use client';

import { useEffect, useState } from 'react';

interface SlideTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export default function SlideTransition({ 
  children, 
  isVisible,
  direction = 'up',
  duration = 300,
  className = '' 
}: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  const directionMap = {
    up: { from: 'translateY(12px)', to: 'translateY(0)' },
    down: { from: 'translateY(-12px)', to: 'translateY(0)' },
    left: { from: 'translateX(12px)', to: 'translateX(0)' },
    right: { from: 'translateX(-12px)', to: 'translateX(0)' },
  };

  const { from, to } = directionMap[direction];

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? to : from,
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {children}
    </div>
  );
}

