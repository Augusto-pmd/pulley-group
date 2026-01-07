'use client';

import { useState, useEffect } from 'react';
import { useNavigationState } from '@/contexts/NavigationStateContext';
import ModuleHeader from '@/components/ModuleHeader';
import FiscalStatusPanel from '@/components/vista-contador/FiscalStatusPanel';
import FiscalObligations from '@/components/vista-contador/FiscalObligations';
import FiscalExport from '@/components/vista-contador/FiscalExport';
import FiscalConceptTags from '@/components/vista-contador/FiscalConceptTags';
import { getEstadoMonotributo, getEstadoIIBB, getEstadoBienesPersonales, getObligacionesFiscales } from '@/mock/fiscal';

export default function VistaContadorPage() {
  const { enterContexto } = useNavigationState();
  const [selectedTab, setSelectedTab] = useState<'estado' | 'obligaciones' | 'conceptos' | 'export'>('estado');

  // Activar estado CONTEXTO al montar
  useEffect(() => {
    enterContexto();
  }, [enterContexto]);

  const estadoMonotributo = getEstadoMonotributo('C'); // Mock: categoría C
  const estadoIIBB = getEstadoIIBB();
  const estadoBP = getEstadoBienesPersonales();
  const obligaciones = getObligacionesFiscales();

  return (
    <>
      {/* CAPA 1: ACCIÓN - Header del módulo */}
      <div className="mb-8">
        <ModuleHeader
          title="Vista Contador"
          description="Interpretación fiscal de tus datos reales"
          status={{
            label: 'Estado',
            value: 'Interpretación automática',
            color: 'info',
          }}
        />
      </div>

      {/* Tabs de navegación */}
      <div className="mb-8">
        <div className="flex gap-4 border-b border-gray-divider">
          <button
            onClick={() => setSelectedTab('estado')}
            className={`px-4 py-2 text-body font-medium transition-colors duration-fast ${
              selectedTab === 'estado'
                ? 'text-gray-text-primary border-b-2 border-blue-system'
                : 'text-gray-text-tertiary hover:text-gray-text-primary'
            }`}
          >
            Estado Fiscal
          </button>
          <button
            onClick={() => setSelectedTab('obligaciones')}
            className={`px-4 py-2 text-body font-medium transition-colors duration-fast ${
              selectedTab === 'obligaciones'
                ? 'text-gray-text-primary border-b-2 border-blue-system'
                : 'text-gray-text-tertiary hover:text-gray-text-primary'
            }`}
          >
            Obligaciones
          </button>
          <button
            onClick={() => setSelectedTab('conceptos')}
            className={`px-4 py-2 text-body font-medium transition-colors duration-fast ${
              selectedTab === 'conceptos'
                ? 'text-gray-text-primary border-b-2 border-blue-system'
                : 'text-gray-text-tertiary hover:text-gray-text-primary'
            }`}
          >
            Etiquetas Fiscales
          </button>
          <button
            onClick={() => setSelectedTab('export')}
            className={`px-4 py-2 text-body font-medium transition-colors duration-fast ${
              selectedTab === 'export'
                ? 'text-gray-text-primary border-b-2 border-blue-system'
                : 'text-gray-text-tertiary hover:text-gray-text-primary'
            }`}
          >
            Export Contador
          </button>
        </div>
      </div>

      {/* Contenido según tab */}
      {selectedTab === 'estado' && (
        <FiscalStatusPanel
          estadoMonotributo={estadoMonotributo}
          estadoIIBB={estadoIIBB}
          estadoBP={estadoBP}
        />
      )}

      {selectedTab === 'obligaciones' && (
        <FiscalObligations obligaciones={obligaciones} />
      )}

      {selectedTab === 'conceptos' && (
        <FiscalConceptTags />
      )}

      {selectedTab === 'export' && (
        <FiscalExport />
      )}
    </>
  );
}

