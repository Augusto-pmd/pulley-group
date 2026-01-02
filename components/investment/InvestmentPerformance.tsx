import React from 'react';
import Card from '../Card';
import { formatPercentage } from '@/utils/number-format';
import type { Investment } from '@/mock/data';

interface InvestmentPerformanceProps {
  investment: Investment;
}

type PerformanceMonth = {
  date: string;
  roi: number;
};

// Helper para renderizar mejor/peor mes con type narrowing correcto
function renderPerformanceMonth(
  month: PerformanceMonth | null,
  label: string
): React.ReactNode {
  if (month === null) {
    return null;
  }
  return (
    <div>
      <div className="text-body text-gray-text-tertiary mb-1">{label}</div>
      <div className="text-body text-gray-text-tertiary">
        {month.date}: {formatPercentage(month.roi)}
      </div>
    </div>
  );
}

export default function InvestmentPerformance({ investment }: InvestmentPerformanceProps) {
  // Si no hay capital real, mostrar estado vacío
  if (investment.capital === 0) {
    return (
      <Card>
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay eventos registrados para calcular rendimiento. Registra aportes o retiros para ver métricas.
        </div>
      </Card>
    );
  }
  
  // Métricas de rendimiento - solo desde datos reales
  // Sin backend de análisis temporal, todos los valores son 0 hasta que haya datos reales
  const annualizedNominal = 0; // Requiere cálculo temporal real
  const annualizedReal = 0; // Requiere IPC real
  const monthlyVariation = 0; // Requiere eventos mensuales reales
  const annualVariation = 0; // Requiere eventos anuales reales
  
  // Mejor y peor mes - solo desde datos reales de análisis temporal
  // Si no hay eventos de múltiples meses, estos son null
  const bestMonth: PerformanceMonth | null = null; // Requiere análisis temporal real
  const worstMonth: PerformanceMonth | null = null; // Requiere análisis temporal real

  return (
    <Card>
      {/* Métricas Principales - Grid 2x3 */}
      <div className="grid grid-cols-2 gap-12 mb-8">
        {/* Fila 1 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ACUMULADO NOM
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiNominal)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ACUMULADO REAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(investment.roiReal)}
          </div>
        </div>

        {/* Fila 2 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ANUALIZADO NOM
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualizedNominal)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            ROI ANUALIZADO REAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualizedReal)}
          </div>
        </div>

        {/* Fila 3 */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VARIACIÓN MENSUAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(monthlyVariation)}
          </div>
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VARIACIÓN ANUAL
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatPercentage(annualVariation)}
          </div>
        </div>
      </div>

      {/* Mejor y Peor Mes - Solo si hay datos reales */}
      {bestMonth !== null || worstMonth !== null ? (
        <div className="grid grid-cols-2 gap-6">
          {renderPerformanceMonth(bestMonth, 'Mejor mes')}
          {renderPerformanceMonth(worstMonth, 'Peor mes')}
        </div>
      ) : null}
      
      {/* Mensaje si no hay métricas temporales */}
      {bestMonth === null && worstMonth === null && (
        <div className="mt-8 text-center text-body-small text-gray-text-tertiary">
          Se requieren eventos de múltiples meses para calcular variaciones mensuales y mejores/peores meses.
        </div>
      )}
    </Card>
  );
}

