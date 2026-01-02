'use client';

import { useState } from 'react';
import Card from '../Card';
import { formatCurrency } from '@/utils/number-format';
import { formatNumber } from '@/utils/number-format';
import type { Currency } from '@/mock/data';

export default function BaseCurrency() {
  // USD es la moneda base fija del sistema
  const [currency, setCurrency] = useState<Currency>('USD');

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'ARS', label: 'Pesos (ARS)', symbol: '$' },
    { value: 'USD', label: 'Dólares (USD)', symbol: 'US$' },
    { value: 'EUR', label: 'Euros (EUR)', symbol: '€' },
  ];

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-gray-text-primary mb-1">MONEDA BASE</h3>
        <p className="text-body text-gray-text-tertiary">
          USD es la moneda base del sistema. ARS es moneda operativa contextual.
        </p>
      </div>

      {/* Información de Moneda Base */}
      <div className="pt-6">
        <div className="text-body-large font-medium text-gray-text-primary mb-4">
          Moneda Base: USD (Dólares)
        </div>
        <div className="text-body text-gray-text-tertiary mb-4">
          El sistema usa USD como moneda base conceptual. Todos los valores se muestran en USD primero, con ARS como referencia secundaria.
        </div>
        <div className="p-4 bg-blue-50/30 rounded-lg border border-blue-200/20">
          <div className="text-body-small text-gray-text-primary font-medium mb-2">
            Ley de Moneda:
          </div>
          <ul className="text-body-small text-gray-text-tertiary space-y-1 list-disc list-inside">
            <li>USD = moneda base del sistema</li>
            <li>ARS = moneda de origen / carga</li>
            <li>Todo se compara y proyecta en USD</li>
          </ul>
        </div>
      </div>

      {/* Explicación del Impacto */}
      <div className="mt-6 text-body text-gray-text-tertiary">
        Esta configuración afecta cómo se muestran todos los valores en el sistema: Dashboard, Inversiones, Flujos, Proyecciones y Fondo Emma.
      </div>
    </Card>
  );
}

