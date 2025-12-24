import ModuleHeader from '@/components/ModuleHeader';
import ContextHeader from '@/components/ContextHeader';
import FlowSummary from '@/components/flows/FlowSummary';
import FlowList from '@/components/flows/FlowList';
import FlowFilters from '@/components/flows/FlowFilters';
import FlowIndicators from '@/components/flows/FlowIndicators';
import { mockFlows } from '@/mock/data';
import type { Flow } from '@/mock/data';

export default function FlowsPage() {
  // Mock: filtrar flujos (sin lógica real, solo estructura)
  const ingresos = mockFlows.filter((f) => f.type === 'ingreso');
  const gastos = mockFlows.filter((f) => f.type === 'gasto');
  const aportes = mockFlows.filter((f) => f.type === 'aporte');
  const retiros = mockFlows.filter((f) => f.type === 'retiro');

  const totalFlows = mockFlows.length;

  return (
    <>
      {/* Navegación contextual (Nivel 2) - Módulo secundario */}
      <div className="mb-6">
        <ContextHeader
          module={{ label: 'Dashboard', href: '/' }}
          entity={{ label: 'Flujos' }}
        />
      </div>

      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Flujos"
          description="Movimientos de dinero que entran y salen de tu patrimonio"
          status={{
            label: 'Total',
            value: `${totalFlows} movimientos`,
            color: 'info',
          }}
          primaryAction={{
            label: 'Filtrar',
            onClick: () => {
              // Scroll a filtros
              document.getElementById('flow-filters')?.scrollIntoView({ behavior: 'smooth' });
            },
          }}
        />
      </div>

      {/* CAPA 2: CONTEXTO - Resumen y filtros */}
      <div id="flow-filters" className="mb-6">
        <FlowFilters />
      </div>

      <div className="mb-8">
        <FlowSummary flows={mockFlows} />
      </div>

      {/* CAPA 3: DETALLE / HISTORIAL - Lista de flujos */}
      <div className="space-y-8">
          {/* Ingresos */}
          {ingresos.length > 0 && (
            <FlowList title="INGRESOS" flows={ingresos} showInvestment={true} />
          )}

          {/* Gastos */}
          {gastos.length > 0 && (
            <FlowList title="GASTOS" flows={gastos} showInvestment={false} />
          )}

          {/* Aportes */}
          {aportes.length > 0 && (
            <FlowList title="APORTES" flows={aportes} showInvestment={true} />
          )}

          {/* Retiros */}
          {retiros.length > 0 && (
            <FlowList title="RETIROS" flows={retiros} showInvestment={true} />
          )}
        </div>

      <div className="mt-8">
        <FlowIndicators flows={mockFlows} />
      </div>
    </>
  );
}

