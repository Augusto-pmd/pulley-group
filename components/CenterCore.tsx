'use client';

import { useNavigationState } from '@/contexts/NavigationStateContext';
import { useRingData } from '@/contexts/RingDataContext';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * CenterCore - El anillo central del sistema
 * Solo visible en estados observación y navegación
 */
export default function CenterCore() {
  const { state, enterNavegacion } = useNavigationState();
  const { ringData } = useRingData();
  const { patrimonioTotal = 0 } = ringData;

  // Solo visible en observación y navegación
  if (state !== 'observacion' && state !== 'navegacion') {
    return null;
  }

  const handleClick = () => {
    if (state === 'observacion') {
      enterNavegacion();
    }
  };

  return (
    <div
      data-center-core
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]"
      style={{
        pointerEvents: 'auto',
      }}
    >
      {/* Halo exterior */}
      <div
        className="w-96 h-96 rounded-full absolute inset-0 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(181, 154, 106, 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      {/* Anillo principal */}
      <div
        className="w-96 h-96 rounded-full flex items-center justify-center transition-all duration-1000 cursor-pointer group"
        onClick={handleClick}
        style={{
          border: '2px solid rgba(181, 154, 106, 0.3)',
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(181, 154, 106, 0.06) 0%,
              rgba(214, 195, 163, 0.04) 40%,
              transparent 70%
            )
          `,
          boxShadow: `
            inset 0 0 30px rgba(181, 154, 106, 0.1),
            0 0 40px rgba(181, 154, 106, 0.12),
            0 0 80px rgba(181, 154, 106, 0.08),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `,
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.7)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 40px rgba(181, 154, 106, 0.25),
            0 0 60px rgba(181, 154, 106, 0.3),
            0 0 100px rgba(181, 154, 106, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.3)';
          e.currentTarget.style.boxShadow = `
            inset 0 0 30px rgba(181, 154, 106, 0.1),
            0 0 40px rgba(181, 154, 106, 0.12),
            0 0 80px rgba(181, 154, 106, 0.08),
            0 4px 20px rgba(0, 0, 0, 0.3)
          `;
        }}
      >
        {/* Contenido: SOLO patrimonio total */}
        <div className="text-center relative z-10">
          <CurrencyDisplay value={patrimonioTotal} size="display" showSecondary={false} />
        </div>
      </div>
    </div>
  );
}

