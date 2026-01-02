'use client';

import Card from '../Card';
import { mockProjectionAssumptions } from '@/mock/data';
import { formatPercentage } from '@/utils/number-format';

export default function ProjectionAssumptions() {
  const scenarios = [
    {
      key: 'conservador' as const,
      label: 'CONSERVADOR',
      description: 'Rendimientos más bajos, menor riesgo',
      value: mockProjectionAssumptions.conservador,
    },
    {
      key: 'base' as const,
      label: 'BASE',
      description: 'Rendimientos esperados, riesgo moderado',
      value: mockProjectionAssumptions.base,
    },
    {
      key: 'optimista' as const,
      label: 'OPTIMISTA',
      description: 'Rendimientos más altos, mayor riesgo',
      value: mockProjectionAssumptions.optimista,
    },
  ];

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">SUPUESTOS DE PROYECCIÓN</h3>
        <p className="text-body text-gray-text-tertiary">
          Rendimientos esperados por escenario
        </p>
      </div>

      {/* Grid 3 Columnas */}
      <div className="pt-6 grid grid-cols-3 gap-12">
        {scenarios.map((scenario) => (
          <div key={scenario.key} className="text-center">
            {/* Header de Escenario */}
            <div className="text-body-large font-semibold text-black mb-4">
              {scenario.label}
            </div>

            {/* Explicación Conceptual */}
            <div className="text-body text-gray-text-tertiary mb-6">
              {scenario.description}
            </div>

            {/* Input de Supuesto */}
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                RENDIMIENTO ESPERADO
              </div>
              <input
                type="text"
                value={formatPercentage(scenario.value, 1)}
                readOnly
                className="w-full text-body-large font-mono-numbers text-black bg-white border border-gray-border rounded-button px-3 py-2 text-center focus:border-blue-system focus:outline-none transition-colors duration-fast"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Nota Conceptual */}
      <div className="mt-8 text-caption text-gray-text-disabled">
        Estos supuestos se aplican a todas las proyecciones del sistema. Ajustarlos cambiará todas las proyecciones futuras.
      </div>
    </Card>
  );
}

