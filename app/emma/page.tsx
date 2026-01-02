'use client';

import { useState } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import Card from '@/components/Card';
import EmmaCurrentState from '@/components/emma/EmmaCurrentState';
import EmmaMilestones from '@/components/emma/EmmaMilestones';
import EmmaEvolution from '@/components/emma/EmmaEvolution';
import EmmaProjectionsBridge from '@/components/emma/EmmaProjectionsBridge';
import EmmaProjectionVariables from '@/components/emma/EmmaProjectionVariables';
import EmmaTramosHistory from '@/components/emma/EmmaTramosHistory';
import type { Horizon } from '@/mock/data';
import { emmaTramosMock, getTramoActual, emmaEstadoActual, type EmmaTramo } from '@/mock/emma-tramos';

export default function EmmaPage() {
  // Estado sincronizado con la barra de proyecciones (mock)
  const [horizon, setHorizon] = useState<Horizon>(10);
  const [tramos, setTramos] = useState<EmmaTramo[]>(emmaTramosMock);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const tramoActual = getTramoActual();

  // Guard clause: si no hay datos, mostrar estado vacío
  if (!tramos || tramos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card padding="large">
          <div className="text-center">
            <h2 className="text-heading-2 text-gray-text-primary mb-2">
              Sin datos disponibles
            </h2>
            <p className="text-body text-gray-text-tertiary">
              No hay tramos configurados para el Fondo Emma. Configura los tramos para comenzar.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Handler para actualizar tramo actual
  const handleUpdateTramo = (updates: Partial<EmmaTramo>) => {
    if (tramoActual) {
      setTramos(
        tramos.map((t) =>
          t.id === tramoActual.id
            ? { ...t, ...updates }
            : t
        )
      );
    }
  };

  // Handler para crear nuevo tramo (cierra el actual y crea uno nuevo)
  const handleCreateNewTramo = () => {
    if (tramoActual) {
      const hoy = new Date().toISOString().split('T')[0];
      
      // Cerrar tramo actual
      const tramoActualizado = tramos.map((t) =>
        t.id === tramoActual.id
          ? { ...t, fechaFin: hoy, fechaModificacion: hoy }
          : t
      );

      // Crear nuevo tramo
      const nuevoTramo: EmmaTramo = {
        id: `t-${Date.now()}`,
        fechaInicio: hoy,
        fechaFin: undefined,
        instrumento: tramoActual.instrumento, // Mantener valores por defecto
        rendimientoEsperado: tramoActual.rendimientoEsperado,
        inflacionAsumida: tramoActual.inflacionAsumida,
        aporteMensual: tramoActual.aporteMensual,
        capitalInicial: emmaEstadoActual.capitalAcumulado, // Capital actual como inicio
        nota: 'Nuevo tramo creado',
        fechaCreacion: hoy,
      };

      setTramos([...tramoActualizado, nuevoTramo]);
    }
  };

  return (
    <>
      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Fondo Emma"
          description="Proyecto patrimonial de largo plazo basado en interés compuesto"
          status={{
            label: 'Estado',
            value: 'Activo',
            color: 'success',
          }}
          primaryAction={{
            label: 'Ajustar variables',
            onClick: () => {
              setShowEditPanel(true);
            },
          }}
        />
      </div>

      {/* CAPA 2: ZONA DE EDICIÓN (CLARA Y GUIADA) - Mostrar directamente al accionar */}
      {showEditPanel && (
        <div className="mb-10">
          <EmmaProjectionVariables
            tramoActual={tramoActual}
            onUpdateTramo={(updates) => {
              handleUpdateTramo(updates);
              setShowEditPanel(false);
            }}
            onCreateNewTramo={() => {
              handleCreateNewTramo();
              setShowEditPanel(false);
            }}
            onClose={() => setShowEditPanel(false)}
            defaultEditing={true}
          />
        </div>
      )}

      {/* CAPA 3: CONTEXTO Y RESULTADO - Solo cuando no se está editando */}
      {!showEditPanel && (
        <div className="grid grid-cols-[1fr_400px] gap-6 mb-10">
          {/* Columna Principal */}
          <div>
            <div className="mb-10">
              <EmmaCurrentState />
            </div>
            
            <div className="mb-10">
              <EmmaMilestones />
            </div>

            <div className="mb-10">
              <EmmaEvolution />
            </div>

            <div>
              <EmmaProjectionsBridge horizon={horizon} />
            </div>
          </div>

          {/* Columna Lateral: Variables de Proyección (Solo lectura cuando no se edita) */}
          <div className="space-y-4">
            <EmmaProjectionVariables
              tramoActual={tramoActual}
              onUpdateTramo={handleUpdateTramo}
              onCreateNewTramo={handleCreateNewTramo}
              onClose={() => {}}
              defaultEditing={false}
            />
            <EmmaTramosHistory tramos={tramos} />
          </div>
        </div>
      )}
    </>
  );
}

