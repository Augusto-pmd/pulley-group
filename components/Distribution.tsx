'use client';

import { useMemo } from 'react';
import Card from './Card';
import CurrencyDisplay from './CurrencyDisplay';
import { formatPercentage } from '@/utils/number-format';
import type { Distribution } from '@/mock/data';

interface DistributionProps {
  data: Distribution;
  total: number;
  activosNetos: number; // Recibir desde Dashboard en lugar de calcular desde mock
}

export default function Distribution({ data, total, activosNetos }: DistributionProps) {
  // Asegurar que activosNetos sea un número válido
  const activosNetosValue = typeof activosNetos === 'number' ? activosNetos : 0;
  
  const categories = [
    { label: 'Activos', value: activosNetosValue },
    { label: 'Inversiones', value: data.productive + data.passive },
    { label: 'Liquidez', value: data.liquidity },
    { label: 'Fondo Emma', value: data.longTerm },
  ];

  return (
    <Card>
      {/* Header */}
      <div className="pb-6 border-b mb-0" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
        <h3 className="text-heading-3 font-semibold text-text-primary">DISTRIBUCIÓN DEL PATRIMONIO</h3>
      </div>

      {/* Lista de categorías */}
      <div className="pt-6">
        {categories.map((category) => {
          const percentage = total > 0 && category.value > 0 ? (category.value / total) * 100 : 0;
          return (
            <div
              key={category.label}
              className="flex items-center justify-between py-4 transition-colors duration-fast cursor-pointer"
              style={{ 
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="text-body-large font-medium text-text-primary">{category.label}</div>
              <div className="flex items-center gap-4">
                <CurrencyDisplay 
                  value={category.value} 
                  size="regular" 
                  showSecondary={false}
                />
                <div className="text-body-large text-text-secondary">
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

