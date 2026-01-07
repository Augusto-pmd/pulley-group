'use client';

import { useState, useEffect } from 'react';
import { useModeFromPath } from '@/hooks/useModeFromPath';
import { useRingData } from '@/contexts/RingDataContext';
import Card from '@/components/Card';
import EmmaInitForm from '@/components/emma/EmmaInitForm';
import EmmaContributionForm from '@/components/emma/EmmaContributionForm';
import EmmaMovementsList from '@/components/emma/EmmaMovementsList';
import EmmaCurrentState from '@/components/emma/EmmaCurrentState';
import { getEmmaMovements, getEmmaState, getEmma } from '@/lib/api';

export default function EmmaPage() {
  useModeFromPath();
  const { setRingData } = useRingData();
  const [hasMovements, setHasMovements] = useState<boolean | null>(null);
  const [showInitForm, setShowInitForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emmaState, setEmmaState] = useState<any>(null);

  // Verificar si hay movimientos de Emma y cargar estado
  useEffect(() => {
    async function checkEmmaStatus() {
      try {
        setLoading(true);
        const movements = await getEmmaMovements();
        setHasMovements(movements.length > 0);
        
        if (movements.length > 0) {
          const state = await getEmmaState();
          setEmmaState(state);
          // Actualizar datos del Ring
          setRingData({
            emmaCapital: state?.currentCapital || 0,
          });
        } else {
          setRingData({
            emmaCapital: 0,
          });
        }
      } catch (error) {
        console.error('Error checking Emma status:', error);
        setHasMovements(false);
        setRingData({
          emmaCapital: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    checkEmmaStatus();
  }, [showInitForm, showContributionForm, setRingData]);

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

  // MODO FONDO: Si no iniciado, anillo apagado, solo botón
  if (!hasMovements && !showInitForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <button
            onClick={() => setShowInitForm(true)}
            className="px-8 py-3 rounded-button text-body-large font-medium transition-all duration-300"
            style={{
              backgroundColor: 'rgba(181, 154, 106, 0.2)',
              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
              border: '1px solid rgba(181, 154, 106, 0.4)',
              color: '#F5F2EC',
              backdropFilter: 'blur(8px)',
              boxShadow: 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
              e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.2) 40%, transparent 70%)';
              e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(181, 154, 106, 0.2), 0 6px 16px rgba(0, 0, 0, 0.35), 0 0 30px rgba(181, 154, 106, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
              e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)';
              e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
          >
            Iniciar fondo
          </button>
        </div>
      </div>
    );
  }

  // Si se está mostrando el formulario de inicio
  if (showInitForm) {
    return (
      <div className="max-w-2xl mx-auto pt-32">
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
      <div className="max-w-2xl mx-auto pt-32">
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

  // MODO FONDO: Anillo con pulso lento, contenido mínimo
  // Sin proyecciones gritadas, simboliza largo plazo
  // ESTRUCTURA RADIAL: El capital es el centro, movimientos orbitan
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center pt-32">
      {/* CENTRO: Capital acumulado - Núcleo del anillo */}
      <div className="mb-16">
        <EmmaCurrentState />
      </div>

      {/* ORBITA: Movimientos alrededor del centro */}
      <div className="w-full max-w-2xl">
        <EmmaMovementsList />
      </div>
    </div>
  );
}
