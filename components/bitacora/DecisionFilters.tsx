'use client';

import { useState } from 'react';
import Card from '../Card';
import type { DecisionType } from '@/mock/data';
import { getDecisionTypeLabel } from '@/mock/data';

interface DecisionFiltersProps {
  onFilterChange?: (filter: DecisionType | 'all') => void;
}

export default function DecisionFilters({ onFilterChange }: DecisionFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<DecisionType | 'all'>('all');

  const filterOptions: (DecisionType | 'all')[] = [
    'all',
    'inversion',
    'desinversion',
    'aumento-aporte',
    'rebalanceo',
    'pausa',
    'otra',
  ];

  const handleFilterChange = (filter: DecisionType | 'all') => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const getFilterLabel = (filter: DecisionType | 'all'): string => {
    if (filter === 'all') return 'TODAS';
    return getDecisionTypeLabel(filter);
  };

  return (
    <Card className="py-4">
      <div className="flex items-center gap-2">
        {filterOptions.map((filter, index) => (
          <div key={filter} className="flex items-center">
            <button
              onClick={() => handleFilterChange(filter)}
              className={`text-body transition-colors duration-fast px-4 py-2 ${
                activeFilter === filter
                  ? 'text-black font-semibold'
                  : 'text-gray-text-tertiary hover:text-black'
              }`}
            >
              {getFilterLabel(filter)}
            </button>
            {index < filterOptions.length - 1 && (
              <span className="text-body text-gray-border px-2">|</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

