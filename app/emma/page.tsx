'use client';

import { useState, useEffect } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import Card from '@/components/Card';
import EmmaCurrentState from '@/components/emma/EmmaCurrentState';
import EmmaInitForm from '@/components/emma/EmmaInitForm';
import EmmaContributionForm from '@/components/emma/EmmaContributionForm';
import EmmaMovementsList from '@/components/emma/EmmaMovementsList';
import { getEmmaMovements, getEmmaState, getEmma } from '@/lib/api';

export default function EmmaPage() {
  const [hasMovements, setHasMovements] = useState<boolean | null>(null);
  const [showInitForm, setShowInitForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay movimientos de Emma
  useEffect(() => {
    async function checkEmmaStatus() {
      try {
        setLoading(true);
        const movements = await getEmmaMovements();
        setHasMovements(movements.length > 0);
      } catch (error) {
        console.error('Error checking Emma status:', error);
        setHasMovements(false);
      } finally {
        setLoading(false);
      }
    }
    checkEmmaStatus();
  }, [showInitForm, showContributionForm]);

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card padding="large">
          <div className="text-center text-body text-gray-text-tertiary">
            Cargando...
          </div>
        </Card>
      </div>
    );
  }

  // Si no hay movimientos, mostrar estado vacío con botón de inicio
  if (!hasMovements && !showInitForm) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card padding="large">
          <div className="text-center">
            <h2 className="text-heading-2 text-gray-text-primary mb-4">
              Este fondo aún no fue iniciado
            </h2>
            <p className="text-body text-gray-text-tertiary mb-6">
              Configura los supuestos del fondo y registra el capital inicial para comenzar.
            </p>
            <button
              onClick={() => setShowInitForm(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-button text-body font-medium hover:bg-blue-700 transition-colors duration-fast"
            >
              Iniciar fondo
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Si se está mostrando el formulario de inicio
  if (showInitForm) {
    return (
      <div>
        <div className="mb-8">
          <ModuleHeader
            title="Fondo Emma"
            description="Proyecto patrimonial de largo plazo basado en interés compuesto"
          />
        </div>
        <EmmaInitForm
          onComplete={() => {
            setShowInitForm(false);
            // Refrescar página para mostrar estado actualizado
            window.location.reload();
          }}
          onCancel={() => setShowInitForm(false)}
        />
      </div>
    );
  }

  // Si se está mostrando el formulario de aportes
  if (showContributionForm) {
    return (
      <div>
        <div className="mb-8">
          <ModuleHeader
            title="Fondo Emma"
            description="Proyecto patrimonial de largo plazo basado en interés compuesto"
          />
        </div>
        <EmmaContributionForm
          onComplete={() => {
            setShowContributionForm(false);
            // Refrescar página para mostrar estado actualizado
            window.location.reload();
          }}
          onCancel={() => setShowContributionForm(false)}
        />
      </div>
    );
  }

  // Emma está iniciado, mostrar estado normal
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
            label: 'Agregar aporte',
            onClick: () => {
              setShowContributionForm(true);
            },
          }}
        />
      </div>

      {/* CAPA 2: CONTENIDO - Estado actual */}
      <div className="mb-10">
        <EmmaCurrentState />
      </div>

      {/* CAPA 3: MOVIMIENTOS - Lista editable */}
      <div className="mb-10">
        <EmmaMovementsList />
      </div>
    </>
  );
}
