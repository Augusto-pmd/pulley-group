'use client';

import { useState } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import ScenarioComparison from '@/components/projections/ScenarioComparison';
import TemporalEvolution from '@/components/projections/TemporalEvolution';
import IPCImpact from '@/components/projections/IPCImpact';
import InvestmentBridge from '@/components/projections/InvestmentBridge';
import EmmaBridge from '@/components/projections/EmmaBridge';
import type { Scenario, Horizon } from '@/mock/data';

export default function ProjectionsPage() {
  // Estado sincronizado con la barra de proyecciones (mock)
  const [scenario, setScenario] = useState<Scenario>('base');
  const [horizon, setHorizon] = useState<Horizon>(10);

  return (
    <>
      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Proyecciones"
          description="Escenarios futuros de tu patrimonio para planificar decisiones de largo plazo"
          status={{
            label: 'Escenario',
            value: scenario.charAt(0).toUpperCase() + scenario.slice(1),
            color: 'info',
          }}
          primaryAction={{
            label: 'Editar supuestos',
            onClick: () => {
              // Mock: mostrar panel de edición de supuestos
              alert('Panel de edición de supuestos (mock)');
            },
          }}
        />
      </div>

      {/* CAPA 2: CONTEXTO - Comparativa de escenarios */}
      <div className="mb-10">
        <ScenarioComparison horizon={horizon} />
      </div>

      {/* CAPA 3: DETALLE / HISTORIAL - Análisis detallado */}
      <div className="mb-10">
        <TemporalEvolution scenario={scenario} horizon={horizon} />
      </div>

      <div className="mb-10">
        <IPCImpact scenario={scenario} horizon={horizon} />
      </div>

      <div className="mb-10">
        <InvestmentBridge horizon={horizon} />
      </div>

      <div>
        <EmmaBridge horizon={horizon} />
      </div>
    </>
  );
}

