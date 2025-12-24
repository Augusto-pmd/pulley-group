import Link from 'next/link';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import { mockEmmaMilestones } from '@/mock/data';
import { mockPatrimonialState } from '@/mock/data';
import type { Horizon } from '@/mock/data';

interface EmmaProjectionsBridgeProps {
  horizon: Horizon;
}

export default function EmmaProjectionsBridge({ horizon }: EmmaProjectionsBridgeProps) {
  // Mock: calcular contribución según horizonte
  const getEmmaProjection = (h: Horizon) => {
    if (h === 5) return mockEmmaMilestones[0].nominal * 0.3; // 18 años * 0.3
    if (h === 10) return mockEmmaMilestones[0].nominal * 0.6; // 18 años * 0.6
    return mockEmmaMilestones[1].nominal; // 25 años
  };

  const contribution = getEmmaProjection(horizon);
  const projectedValue = getEmmaProjection(horizon);
  
  // Mock: calcular porcentaje del patrimonio proyectado
  const totalProjected = mockPatrimonialState.total * 1.5; // Mock: patrimonio proyectado
  const percentage = (projectedValue / totalProjected) * 100;

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">RELACIÓN CON PATRIMONIO GENERAL</h3>
        <p className="text-body text-gray-text-tertiary">
          Contribución a las proyecciones globales
        </p>
      </div>

      {/* Grid 2x2 */}
      <div className="pt-6 grid grid-cols-2 gap-12">
        {/* Elemento 1: Contribución a Proyecciones */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            CONTRIBUCIÓN
          </div>
          <CurrencyDisplay 
            value={contribution} 
            size="large" 
            showSecondary={true}
            originalCurrency="USD"
          />
          <div className="text-body text-gray-text-tertiary">
            A las proyecciones de {horizon} años
          </div>
        </div>

        {/* Elemento 2: Porcentaje del Patrimonio */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            % DEL PATRIMONIO
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2] mb-1">
            {formatPercentage(percentage)}
          </div>
          <div className="text-body text-gray-text-tertiary">
            En {horizon} años
          </div>
        </div>

        {/* Elemento 3: Valor Proyectado */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            VALOR PROYECTADO
          </div>
          <CurrencyDisplay 
            value={projectedValue} 
            size="large" 
            showSecondary={true}
            originalCurrency="USD"
          />
          <div className="text-body text-gray-text-tertiary">
            A {horizon} años
          </div>
        </div>
      </div>

      {/* Link a Proyecciones */}
      <div className="mt-8 text-right">
        <Link
          href="/projections"
          className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
        >
          Ver proyecciones globales →
        </Link>
      </div>
    </Card>
  );
}

