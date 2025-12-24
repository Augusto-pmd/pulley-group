'use client';

import { useMemo } from 'react';
import Card from './Card';
import CurrencyDisplay from './CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import type { Distribution } from '@/mock/data';
import { getPatrimonioNetoActivosUsd } from '@/mock/activos';

interface DistributionProps {
  data: Distribution;
  total: number;
}

export default function Distribution({ data, total }: DistributionProps) {
  const activosNetos = useMemo(() => getPatrimonioNetoActivosUsd(), []);
  
  const categories = [
    { label: 'Activos', value: activosNetos },
    { label: 'Inversiones', value: data.productive + data.passive },
    { label: 'Liquidez', value: data.liquidity },
    { label: 'Fondo Emma', value: data.longTerm },
  ];

  return (
    <Card>
      {/* Header */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black">DISTRIBUCIÓN DEL PATRIMONIO</h3>
      </div>

      {/* Lista de categorías */}
      <div className="pt-6">
        {categories.map((category) => {
          const percentage = total > 0 && category.value > 0 ? (category.value / total) * 100 : 0;
          return (
            <div
              key={category.label}
              className="flex items-center justify-between py-4 hover:bg-gray-bg transition-colors duration-fast cursor-pointer"
            >
              <div className="text-body-large font-medium text-black">{category.label}</div>
              <div className="flex items-center gap-4">
                <CurrencyDisplay 
                  value={category.value} 
                  size="regular" 
                  showSecondary={false}
                />
                <div className="text-body-large text-gray-text-tertiary">
                  {formatPercentage(percentage)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

