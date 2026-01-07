'use client';

import { useState, useEffect } from 'react';
import DiscreteNav from '@/components/DiscreteNav';
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
          <div className="text-center text-body text-text-secondary">
            Cargando...
          </div>
        </Card>
      </div>
    );
  }

  // Si no hay movimientos, mostrar estado vacío con botón de inicio
  if (!hasMovements && !showInitForm) {
    return (
      <>
        <DiscreteNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card padding="large">
            <div className="text-center py-12">
              <div className="mb-8">
                <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 opacity-60">
                  FONDO EMMA
                </div>
                <h2 className="text-display-3 text-text-primary mb-6">
                  Este fondo aún no fue iniciado
                </h2>
                <p className="text-body text-text-secondary mb-8 opacity-80">
                  Configura los supuestos del fondo y registra el capital inicial para comenzar.
                </p>
              </div>
              <button
                onClick={() => setShowInitForm(true)}
                className="px-8 py-3 rounded-button text-body-large font-medium transition-colors duration-fast"
                style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0885A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B59A6A'}
              >
                Iniciar fondo
              </button>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Si se está mostrando el formulario de inicio
  if (showInitForm) {
    return (
      <>
        <DiscreteNav />
        <EmmaInitForm
          onComplete={() => {
            setShowInitForm(false);
            // Refrescar página para mostrar estado actualizado
            window.location.reload();
          }}
          onCancel={() => setShowInitForm(false)}
        />
      </>
    );
  }

  // Si se está mostrando el formulario de aportes
  if (showContributionForm) {
    return (
      <>
        <DiscreteNav />
        <EmmaContributionForm
          onComplete={() => {
            setShowContributionForm(false);
            // Refrescar página para mostrar estado actualizado
            window.location.reload();
          }}
          onCancel={() => setShowContributionForm(false)}
        />
      </>
    );
  }

  // Emma está iniciado, mostrar estado normal
  return (
    <>
      <DiscreteNav />
      
      {/* PLACA CENTRAL DOMINANTE - Estado actual */}
      <div className="mb-16">
        <EmmaCurrentState />
      </div>

      {/* MOVIMIENTOS - Secundario discreto */}
      <div className="mb-12">
        <EmmaMovementsList />
      </div>
    </>
  );
}
