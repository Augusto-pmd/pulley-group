'use client';

import { useState } from 'react';
import Card from './Card';
import { formatCurrency, formatPercentage } from '@/mock/data';
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

  // Mock: ordenar inversiones según sortBy
  const sortedInvestments = [...investments].sort((a, b) => {
    switch (sortBy) {
      case 'roiNominal':
        return b.roiNominal - a.roiNominal;
      case 'roiReal':
        return b.roiReal - a.roiReal;
      case 'capital':
        return b.capital - a.capital;
      case 'result':
        return b.result - a.result;
      default:
        return 0;
    }
  });

  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  return (
    <Card padding="normal" className="p-0">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-divider">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-heading-3 font-semibold text-black">RANKING DE INVERSIONES</h3>
        </div>
        <p className="text-body-small text-gray-text-tertiary">
          Rendimiento último período interanual
        </p>
      </div>
      <div className="px-6 py-4 border-b border-gray-divider flex items-center justify-end">
        {/* Selector de ordenamiento */}
        <div className="flex items-center gap-2">
          {sortOptions.map((option, index) => (
            <div key={option.value} className="flex items-center">
              <button
                onClick={() => setSortBy(option.value)}
                className={`text-body transition-colors duration-fast ${
                  sortBy === option.value
                    ? 'text-black font-semibold'
                    : 'text-gray-text-tertiary hover:text-black'
                }`}
              >
                {option.label}
              </button>
              {index < sortOptions.length - 1 && (
                <span className="text-body text-gray-border px-2">|</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div>
        {/* Header de tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="flex-1 text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            INVERSIÓN
          </div>
          <div className="w-[120px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            TIPO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            CAPITAL
          </div>
          <div className="w-[140px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            RESULTADO
          </div>
          <div className="w-[120px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            ROI NOMINAL
          </div>
          <div className="w-[120px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            ROI REAL
          </div>
        </div>

        {/* Filas */}
        {sortedInvestments.map((investment) => (
          <div
            key={investment.id}
            className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="flex-1 text-body-large text-black">{investment.name}</div>
            <div className="w-[120px] text-body text-gray-text-tertiary">{investment.type}</div>
            <div className="w-[160px] text-right text-body-large font-mono-numbers text-black">
              {formatCurrency(investment.capital)}
            </div>
            <div className="w-[140px] text-right text-body-large font-mono-numbers text-black">
              {formatSignedValue(investment.result)}
            </div>
            <div
              className={`w-[120px] text-right text-body-large font-mono-numbers ${
                sortBy === 'roiNominal' ? 'font-semibold text-black' : 'font-normal text-black'
              }`}
            >
              {formatPercentage(investment.roiNominal)}
            </div>
            <div
              className={`w-[120px] text-right text-body-large font-mono-numbers ${
                sortBy === 'roiReal' ? 'font-semibold text-black' : 'font-normal text-gray-text-tertiary'
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
