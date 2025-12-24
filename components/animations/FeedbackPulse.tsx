'use client';

import { useEffect, useState } from 'react';

interface FeedbackPulseProps {
  children: React.ReactNode;
  trigger?: boolean;
  color?: 'green' | 'blue' | 'orange';
  duration?: number;
}

export default function FeedbackPulse({ 
  children, 
  trigger = false, 
  color = 'green',
  duration = 250 
}: FeedbackPulseProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const colorClasses = {
    green: 'rgba(52, 199, 89, 0.15)',
    blue: 'rgba(0, 122, 255, 0.15)',
    orange: 'rgba(255, 149, 0, 0.15)',
  };

  return (
    <div
      className="relative transition-all duration-fast"
      style={{
        transform: isPulsing ? 'scale(0.98)' : 'scale(1)',
        transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {children}
      {isPulsing && (
        <div
          className="absolute inset-0 rounded-card pointer-events-none"
          style={{
            backgroundColor: colorClasses[color],
            animation: `pulseFeedback ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            opacity: 0,
          }}
        />
      )}
      <style jsx>{`
        @keyframes pulseFeedback {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.02);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}

