import { ReactNode } from 'react';

interface PageFrameProps {
  children: ReactNode;
  maxWidth?: 'standard' | 'wide' | 'narrow';
  className?: string;
}

export default function PageFrame({ 
  children, 
  maxWidth = 'standard',
  className = '' 
}: PageFrameProps) {
  const maxWidthClasses = {
    standard: 'max-w-[1200px]',
    wide: 'max-w-[1400px]',
    narrow: 'max-w-[1000px]',
  };

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-8 ${className}`}>
      {children}
    </div>
  );
}

