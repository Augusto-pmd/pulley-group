'use client';

import { useState } from 'react';
import Card from '../Card';
import { getSuggestedExchangeRate, setSuggestedExchangeRate } from '@/mock/exchange-rates';

export default function SuggestedExchangeRate() {
  // Mock: TC sugerido del día (editable, no aplicado automáticamente)
  const [suggestedRate, setSuggestedRate] = useState<number>(getSuggestedExchangeRate());

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-gray-text-primary mb-1">
          TIPO DE CAMBIO SUGERIDO DEL DÍA
        </h3>
        <p className="text-body text-gray-text-tertiary">
          Valor sugerido para nuevos eventos. No se aplica automáticamente sin confirmación.
        </p>
      </div>

      {/* Campo Editable */}
      <div className="pt-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-body text-gray-text-primary mb-1.5">
              1 USD = X ARS
            </label>
            <input
              type="number"
              value={suggestedRate}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setSuggestedRate(value);
                  setSuggestedExchangeRate(value); // Actualizar el valor global
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
              placeholder="1000"
              min="1"
              step="1"
            />
          </div>
          <div className="text-body-small text-gray-text-tertiary pb-2.5">
            Este valor se precargará al crear eventos en ARS, pero podrás editarlo en cada evento.
          </div>
        </div>
      </div>
    </Card>
  );
}

