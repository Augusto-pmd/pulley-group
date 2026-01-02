'use client';

import { useState } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface MonthSummaryToggleProps {
  eventos: EventoMensual[];
  promedioMensual: number;
}

export default function MonthSummaryToggle({ eventos, promedioMensual }: MonthSummaryToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Todos los cálculos en USD
  const totalEgresos = eventos.reduce((sum, e) => sum + e.montoUsd, 0);
  const variacion = promedioMensual > 0 ? ((totalEgresos - promedioMensual) / promedioMensual) * 100 : 0;

  const eventosPorCategoria = {
    fijo: eventos.filter((e) => e.categoria === 'fijo'),
    variable: eventos.filter((e) => e.categoria === 'variable'),
    extraordinario: eventos.filter((e) => e.categoria === 'extraordinario'),
  };

  const totalPorCategoria = {
    fijo: eventosPorCategoria.fijo.reduce((sum, e) => sum + e.montoUsd, 0),
    variable: eventosPorCategoria.variable.reduce((sum, e) => sum + e.montoUsd, 0),
    extraordinario: eventosPorCategoria.extraordinario.reduce((sum, e) => sum + e.montoUsd, 0),
  };

  const porcentajePorCategoria = {
    fijo: totalEgresos > 0 ? (totalPorCategoria.fijo / totalEgresos) * 100 : 0,
    variable: totalEgresos > 0 ? (totalPorCategoria.variable / totalEgresos) * 100 : 0,
    extraordinario: totalEgresos > 0 ? (totalPorCategoria.extraordinario / totalEgresos) * 100 : 0,
  };

  return (
    <Card padding="normal">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="text-heading-3 text-gray-text-primary font-medium">
            Ver resumen del mes
          </div>
          <div className="text-body text-gray-text-tertiary">
            Total: <CurrencyDisplay value={totalEgresos} size="regular" showSecondary={false} />
          </div>
        </div>
        <div className="text-body text-gray-text-tertiary">
          {isOpen ? '▼' : '▶'}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-divider space-y-4">
          {/* Resumen rápido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
                TOTAL EGRESOS
              </div>
              <CurrencyDisplay value={totalEgresos} size="large" showSecondary={true} />
            </div>
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
                VS PROMEDIO
              </div>
              <div className="text-number-medium number-glass">
                {variacion >= 0 ? '+' : ''}
                {formatPercentage(variacion)}
              </div>
            </div>
          </div>

          {/* Por categoría */}
          <div className="pt-3 border-t border-gray-divider">
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              POR CATEGORÍA
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-body-small text-gray-text-tertiary mb-1">Fijos</div>
                <CurrencyDisplay value={totalPorCategoria.fijo} size="regular" showSecondary={false} />
                <div className="text-body-small text-gray-text-tertiary mt-0.5">
                  {formatPercentage(porcentajePorCategoria.fijo)}
                </div>
              </div>
              <div>
                <div className="text-body-small text-gray-text-tertiary mb-1">Variables</div>
                <CurrencyDisplay value={totalPorCategoria.variable} size="regular" showSecondary={false} />
                <div className="text-body-small text-gray-text-tertiary mt-0.5">
                  {formatPercentage(porcentajePorCategoria.variable)}
                </div>
              </div>
              <div>
                <div className="text-body-small text-gray-text-tertiary mb-1">Extraordinarios</div>
                <CurrencyDisplay value={totalPorCategoria.extraordinario} size="regular" showSecondary={false} />
                <div className="text-body-small text-gray-text-tertiary mt-0.5">
                  {formatPercentage(porcentajePorCategoria.extraordinario)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

