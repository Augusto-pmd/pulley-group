'use client';

import { useState } from 'react';
import Card from '../Card';
import { mockTimeHorizons } from '@/mock/data';

export default function TimeHorizons() {
  const [horizons, setHorizons] = useState(mockTimeHorizons);

  const toggleHorizon = (horizon: '5' | '10' | '20') => {
    setHorizons((prev) => ({
      ...prev,
      [horizon]: !prev[horizon],
    }));
  };

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">HORIZONTES TEMPORALES</h3>
        <p className="text-body text-gray-text-tertiary">
          Períodos de proyección disponibles globalmente
        </p>
      </div>

      {/* Lista de Horizontes */}
      <div className="pt-6">
        {(['5', '10', '20'] as const).map((horizon) => (
          <div
            key={horizon}
            className="h-12 flex items-center justify-between px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="text-body-large text-black">
              {horizon} años
            </div>
            {/* Toggle estilo macOS */}
            <button
              onClick={() => toggleHorizon(horizon)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-fast ${
                horizons[horizon] ? 'bg-blue-system' : 'bg-gray-border'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-fast ${
                  horizons[horizon] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Explicación del Uso Global */}
      <div className="mt-6 text-body text-gray-text-tertiary">
        Los horizontes habilitados estarán disponibles en todas las proyecciones del sistema: Dashboard, Inversiones, Proyecciones y Fondo Emma.
      </div>
    </Card>
  );
}

