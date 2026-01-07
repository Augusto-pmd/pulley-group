'use client';

import { useState, useMemo } from 'react';
import Card from './Card';
import { formatCurrency, formatPercentage } from '@/utils/number-format';
import type { Investment } from '@/mock/data';

interface InvestmentsRankingProps {
  investments: Investment[];
}

type SortBy = 'roiNominal' | 'roiReal' | 'capital' | 'result';

export default function InvestmentsRanking({ investments }: InvestmentsRankingProps) {
  const [sortBy, setSortBy] = useState<SortBy>('roiNominal');

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'roiNominal', label: 'ROI Nominal' },
    { value: 'roiReal', label: 'ROI Real' },
    { value: 'capital', label: 'Capital' },
    { value: 'result', label: 'Resultado' },
  ];

  // Ordenar inversiones según sortBy
  const sortedInvestments = useMemo(() => {
    try {
      return [...(investments || [])].sort((a, b) => {
        switch (sortBy) {
          case 'roiNominal':
            return (b.roiNominal || 0) - (a.roiNominal || 0);
          case 'roiReal':
            return (b.roiReal || 0) - (a.roiReal || 0);
          case 'capital':
            return (b.capital || 0) - (a.capital || 0);
          case 'result':
            return (b.result || 0) - (a.result || 0);
          default:
            return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting investments:', error);
      return investments || [];
    }
  }, [investments, sortBy]);

  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  // Si no hay inversiones con capital real, mostrar estado vacío
  if (!investments || investments.length === 0 || investments.every(inv => inv.capital === 0)) {
    return (
      <Card padding="normal" className="p-0">
        <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
          <h3 className="text-heading-3 font-semibold text-text-primary">RANKING DE INVERSIONES</h3>
          <p className="text-body-small text-text-secondary mt-1">
            Rendimiento último período interanual
          </p>
        </div>
        <div className="px-6 py-12 text-center text-body text-text-secondary">
          No hay inversiones con eventos reales registrados. Registra aportes o retiros para ver el ranking.
        </div>
      </Card>
    );
  }

  return (
    <Card padding="normal" className="p-0">
      {/* Header */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-heading-3 font-semibold text-text-primary">RANKING DE INVERSIONES</h3>
        </div>
        <p className="text-body-small text-text-secondary">
          Rendimiento último período interanual
        </p>
      </div>
      <div className="px-6 py-4 border-b flex items-center justify-end" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-2">
          {sortOptions.map((option, index) => (
            <div key={option.value} className="flex items-center">
              <button
                onClick={() => setSortBy(option.value)}
                className={`text-body transition-colors duration-fast ${
                  sortBy === option.value
                    ? 'text-text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {option.label}
              </button>
              {index < sortOptions.length - 1 && (
                <span className="text-body px-2" style={{ color: 'rgba(142, 142, 138, 0.3)' }}>|</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div>
        {/* Header de tabla */}
        <div className="h-12 border-b flex items-center px-4" style={{ 
          backgroundColor: '#1F2A33',
          borderColor: 'rgba(142, 142, 138, 0.2)',
        }}>
          <div className="flex-1 text-body font-medium text-text-secondary uppercase tracking-wider">
            INVERSIÓN
          </div>
          <div className="w-[120px] text-body font-medium text-text-secondary uppercase tracking-wider">
            TIPO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-text-secondary uppercase tracking-wider">
            CAPITAL
          </div>
          <div className="w-[140px] text-right text-body font-medium text-text-secondary uppercase tracking-wider">
            RESULTADO
          </div>
          <div className="w-[120px] text-right text-body font-medium text-text-secondary uppercase tracking-wider">
            ROI NOMINAL
          </div>
          <div className="w-[120px] text-right text-body font-medium text-text-secondary uppercase tracking-wider">
            ROI REAL
          </div>
        </div>

        {/* Filas */}
        {sortedInvestments.map((investment) => (
          <div
            key={investment.id}
            className="h-12 flex items-center px-4 transition-colors duration-fast"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="flex-1 text-body-large text-text-primary">{investment.name}</div>
            <div className="w-[120px] text-body text-text-secondary">{investment.type}</div>
            <div className="w-[160px] text-right text-body-large font-mono-numbers text-text-primary">
              {formatCurrency(investment.capital)}
            </div>
            <div className="w-[140px] text-right text-body-large font-mono-numbers text-text-primary">
              {formatSignedValue(investment.result)}
            </div>
            <div
              className={`w-[120px] text-right text-body-large font-mono-numbers ${
                sortBy === 'roiNominal' ? 'font-semibold text-text-primary' : 'font-normal text-text-primary'
              }`}
            >
              {formatPercentage(investment.roiNominal)}
            </div>
            <div
              className={`w-[120px] text-right text-body-large font-mono-numbers ${
                sortBy === 'roiReal' ? 'font-semibold text-text-primary' : 'font-normal text-text-secondary'
              }`}
            >
              {formatPercentage(investment.roiReal)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
