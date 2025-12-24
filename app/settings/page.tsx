import ContextHeader from '@/components/ContextHeader';
import IPCTable from '@/components/settings/IPCTable';
import ProjectionAssumptions from '@/components/settings/ProjectionAssumptions';
import TimeHorizons from '@/components/settings/TimeHorizons';
import BaseCurrency from '@/components/settings/BaseCurrency';
import ExchangeRatesTable from '@/components/settings/ExchangeRatesTable';
import SuggestedExchangeRate from '@/components/settings/SuggestedExchangeRate';
import SettingsWarnings from '@/components/settings/SettingsWarnings';

export default function SettingsPage() {
  return (
    <>
      {/* Navegación contextual (Nivel 2) - Módulo secundario */}
      <div className="mb-6">
        <ContextHeader
          module={{ label: 'Dashboard', href: '/' }}
          entity={{ label: 'Ajustes' }}
        />
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-display-3 text-gray-text-primary mb-1">Ajustes</h1>
        <p className="text-body-large text-gray-text-tertiary">
          Supuestos del sistema
        </p>
      </div>

        {/* IPC */}
        <div className="mb-10">
          <IPCTable />
        </div>

        {/* Supuestos de Proyección */}
        <div className="mb-10">
          <ProjectionAssumptions />
        </div>

        {/* Horizontes Temporales */}
        <div className="mb-10">
          <TimeHorizons />
        </div>

        {/* Tipo de Cambio Sugerido del Día */}
        <div className="mb-10">
          <SuggestedExchangeRate />
        </div>

        {/* Tipos de Cambio */}
        <div className="mb-10">
          <ExchangeRatesTable />
        </div>

        {/* Moneda Base */}
        <div className="mb-10">
          <BaseCurrency />
        </div>

      {/* Advertencias - Espaciado: 64px entre secciones */}
      <div>
        <SettingsWarnings />
      </div>
    </>
  );
}

