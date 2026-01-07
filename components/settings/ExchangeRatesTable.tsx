'use client';

import { useState } from 'react';
import Card from '../Card';
import { exchangeRatesMock, getCurrentExchangeRate, type ExchangeRate } from '@/mock/exchange-rates';
import { formatCurrency, formatNumber, parseNumberAR } from '@/utils/number-format';

export default function ExchangeRatesTable() {
  const [rates, setRates] = useState<ExchangeRate[]>(exchangeRatesMock);
  const [isAdding, setIsAdding] = useState(false);
  const [newRate, setNewRate] = useState({
    fecha: new Date().toISOString().split('T')[0],
    usdToArs: getCurrentExchangeRate(),
    nota: '',
  });

  const handleAddRate = () => {
    if (newRate.fecha && newRate.usdToArs > 0) {
      const rate: ExchangeRate = {
        fecha: newRate.fecha,
        usdToArs: newRate.usdToArs,
        nota: newRate.nota || undefined,
        fechaCreacion: new Date().toISOString().split('T')[0],
      };
      setRates([...rates, rate].sort((a, b) => b.fecha.localeCompare(a.fecha)));
      setNewRate({
        fecha: new Date().toISOString().split('T')[0],
        usdToArs: getCurrentExchangeRate(),
        nota: '',
      });
      setIsAdding(false);
    }
  };

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-gray-text-primary mb-1">TIPOS DE CAMBIO</h3>
        <p className="text-body text-gray-text-tertiary">
          USD es la moneda base del sistema. ARS es moneda operativa contextual.
        </p>
      </div>

      {/* Tabla de Tipos de Cambio */}
      <div className="pt-6">
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[200px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            FECHA
          </div>
          <div className="w-[200px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            1 USD = X ARS
          </div>
          <div className="flex-1 text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            NOTA
          </div>
        </div>

        {/* Filas */}
        {rates.sort((a, b) => b.fecha.localeCompare(a.fecha)).map((rate) => (
          <div
            key={rate.fecha}
            className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="w-[200px] text-body-large text-gray-text-primary">
              {new Date(rate.fecha).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="w-[200px] text-right text-body-large font-mono-numbers text-gray-text-primary">
              {formatNumber(rate.usdToArs)} ARS
            </div>
            <div className="flex-1 text-body text-gray-text-tertiary">
              {rate.nota || '-'}
            </div>
          </div>
        ))}
      </div>

      {/* Agregar Nuevo Tipo de Cambio */}
      {isAdding ? (
        <div className="mt-6 pt-6 border-t border-gray-divider">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-body text-gray-text-primary mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={newRate.fecha}
                onChange={(e) => setNewRate({ ...newRate, fecha: e.target.value })}
                className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
              />
            </div>
            <div>
              <label className="block text-body text-gray-text-primary mb-2">
                1 USD = X ARS
              </label>
              <input
                type="number"
                value={newRate.usdToArs}
                onChange={(e) => {
                  const value = parseNumberAR(e.target.value);
                  setNewRate({ ...newRate, usdToArs: value ?? 0 });
                }}
                className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-body text-gray-text-primary mb-2">
                Nota (opcional)
              </label>
              <input
                type="text"
                value={newRate.nota}
                onChange={(e) => setNewRate({ ...newRate, nota: e.target.value })}
                className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                placeholder="Ej: Tipo de cambio oficial"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddRate}
              className="px-6 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
            >
              Agregar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={() => setIsAdding(true)}
            className="text-body text-blue-600 hover:text-blue-700 transition-colors duration-fast"
          >
            + Agregar tipo de cambio
          </button>
        </div>
      )}

      {/* Nota Explicativa */}
      <div className="mt-6 text-body-small text-gray-text-tertiary">
        El tipo de cambio no reescribe el pasado. Solo afecta la visualización actual y futura. Los eventos pasados mantienen su conversión histórica.
      </div>
    </Card>
  );
}

