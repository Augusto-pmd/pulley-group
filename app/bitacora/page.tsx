'use client';

import { useState } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import ContextHeader from '@/components/ContextHeader';
import DecisionCard from '@/components/bitacora/DecisionCard';
import DecisionFilters from '@/components/bitacora/DecisionFilters';
import { mockDecisions } from '@/mock/data';
import type { DecisionType } from '@/mock/data';

export default function BitacoraPage() {
  const [filter, setFilter] = useState<DecisionType | 'all'>('all');

  // Filtrar decisiones según el filtro activo
  const filteredDecisions = filter === 'all'
    ? mockDecisions
    : mockDecisions.filter((d) => d.type === filter);
  
  // Si no hay decisiones reales, mostrar mensaje
  if (mockDecisions.length === 0) {
    return (
      <>
        <div className="mb-6">
          <ContextHeader
            module={{ label: 'Dashboard', href: '/' }}
            entity={{ label: 'Bitácora' }}
          />
        </div>
        <div className="mb-8">
          <ModuleHeader
            title="Bitácora"
            description="Memoria patrimonial de decisiones tomadas"
            status={{
              label: 'Total',
              value: '0 decisiones',
              color: 'info',
            }}
          />
        </div>
        <div className="text-center py-16">
          <p className="text-body-large text-gray-text-primary mb-2">
            No hay decisiones registradas
          </p>
          <p className="text-body text-gray-text-tertiary">
            Registra decisiones patrimoniales importantes para mantener un historial de tu proceso de toma de decisiones.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navegación contextual (Nivel 2) - Módulo secundario */}
      <div className="mb-6">
        <ContextHeader
          module={{ label: 'Dashboard', href: '/' }}
          entity={{ label: 'Bitácora' }}
        />
      </div>

      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Bitácora"
          description="Memoria patrimonial de decisiones tomadas"
          status={{
            label: 'Total',
            value: `${mockDecisions.length} decisiones`,
            color: 'info',
          }}
          primaryAction={{
            label: 'Nueva decisión',
            onClick: () => {
              // Mock: abrir modal o navegar
              alert('Agregar nueva decisión (mock)');
            },
          }}
        />
      </div>

      {/* CAPA 2: CONTEXTO - Filtros */}
      <div className="mb-6">
        <DecisionFilters onFilterChange={setFilter} />
      </div>

      {/* CAPA 3: DETALLE / HISTORIAL - Lista cronológica */}
      <div className="space-y-4">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-body-large text-gray-text-tertiary">
                No hay decisiones de este tipo
              </p>
            </div>
          )}
        </div>
    </>
  );
}

