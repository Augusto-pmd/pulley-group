'use client';

import { useState, useEffect } from 'react';
import { useModeFromPath } from '@/hooks/useModeFromPath';
import { useRingData } from '@/contexts/RingDataContext';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import { useNavigationState } from '@/contexts/NavigationStateContext';
import RadialCard from '@/components/circular/RadialCard';
import EmmaInitForm from '@/components/emma/EmmaInitForm';
import EmmaContributionForm from '@/components/emma/EmmaContributionForm';
import EmmaMovementsList from '@/components/emma/EmmaMovementsList';
import EmmaCurrentState from '@/components/emma/EmmaCurrentState';
import { getEmmaMovements, getEmmaState, getEmma } from '@/lib/api';

export default function EmmaPage() {
  useModeFromPath();
  const { setRingData } = useRingData();
  const { activeDomain, setDomainContent } = useCircularNavigation();
  const { enterContexto, enterAccion } = useNavigationState();
  const [hasMovements, setHasMovements] = useState<boolean | null>(null);
  const [showInitForm, setShowInitForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);

  // Activar estado CONTEXTO al montar
  useEffect(() => {
    enterContexto();
  }, [enterContexto]);

  // Activar estado ACCIÓN cuando se abre formulario
  useEffect(() => {
    if (showInitForm || showContributionForm) {
      enterAccion();
    } else {
      enterContexto();
    }
  }, [showInitForm, showContributionForm, enterAccion, enterContexto]);
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

  // Inyectar contenido en el contexto circular cuando el dominio está activo
  useEffect(() => {
    if (activeDomain === 'fondo') {
      const content = (
        <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-body text-text-secondary">Cargando...</div>
            </div>
          ) : !hasMovements && !showInitForm ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <RadialCard className="p-12">
                <div className="text-center">
                  <div className="text-body-large text-text-primary mb-4">
                    Fondo Emma no iniciado
                  </div>
                  <button
                    onClick={() => setShowInitForm(true)}
                    className="px-8 py-3 rounded-full text-body-large font-medium transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(181, 154, 106, 0.2)',
                      backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                      border: '1px solid rgba(181, 154, 106, 0.4)',
                      color: '#F5F2EC',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Iniciar fondo
                  </button>
                </div>
              </RadialCard>
            </div>
          ) : showInitForm ? (
            <div className="p-8">
              <EmmaInitForm
                onComplete={() => {
                  setShowInitForm(false);
                  window.location.reload();
                }}
                onCancel={() => setShowInitForm(false)}
              />
            </div>
          ) : showContributionForm ? (
            <div className="p-8">
              <EmmaContributionForm
                onComplete={() => {
                  setShowContributionForm(false);
                  window.location.reload();
                }}
                onCancel={() => setShowContributionForm(false)}
              />
            </div>
          ) : (
            <div className="p-8">
              {/* ESTRUCTURA RADIAL: El capital es el centro, movimientos orbitan */}
              <div className="relative min-h-[60vh] flex flex-col items-center justify-center">
                {/* CENTRO: Capital acumulado - Núcleo circular */}
                <div className="mb-16">
                  <EmmaCurrentState />
                </div>

                {/* ORBITA: Movimientos alrededor del centro */}
                <div className="w-full max-w-2xl">
                  <EmmaMovementsList />
                </div>
              </div>

              {/* Botón flotante para agregar aporte */}
              <div className="fixed bottom-8 right-8 z-[200]">
                <button
                  onClick={() => setShowContributionForm(true)}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.25)',
                    backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
                    border: '2px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(12px)',
                  }}
                  title="Agregar aporte"
                >
                  <span className="text-2xl">+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
      
      setDomainContent('fondo', content);
    } else {
      setDomainContent('fondo', null);
    }
  }, [activeDomain, loading, hasMovements, showInitForm, showContributionForm, setDomainContent]);

  // Renderizar contenido directamente - el Ring es decorativo pero el contenido debe ser visible
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-body text-text-secondary">Cargando...</div>
        </div>
      );
    }
    if (!hasMovements && !showInitForm) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <RadialCard className="p-12">
            <div className="text-center">
              <div className="text-body-large text-text-primary mb-4">
                Fondo Emma no iniciado
              </div>
              <button
                onClick={() => setShowInitForm(true)}
                className="px-8 py-3 rounded-full text-body-large font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(181, 154, 106, 0.2)',
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                  border: '1px solid rgba(181, 154, 106, 0.4)',
                  color: '#F5F2EC',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Iniciar fondo
              </button>
            </div>
          </RadialCard>
        </div>
      );
    }
    if (showInitForm) {
      return (
        <div className="p-8">
          <EmmaInitForm
            onComplete={() => {
              setShowInitForm(false);
              window.location.reload();
            }}
            onCancel={() => setShowInitForm(false)}
          />
        </div>
      );
    }
    if (showContributionForm) {
      return (
        <div className="p-8">
          <EmmaContributionForm
            onComplete={() => {
              setShowContributionForm(false);
              window.location.reload();
            }}
            onCancel={() => setShowContributionForm(false)}
          />
        </div>
      );
    }
    return (
      <div className="p-8">
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center">
          <div className="mb-16">
            <EmmaCurrentState />
          </div>
          <div className="w-full max-w-2xl">
            <EmmaMovementsList />
          </div>
        </div>
        <div 
          className="absolute bottom-4 right-4 z-[200]"
          style={{
            // Asegurar que esté dentro del viewport
            bottom: '16px',
            right: '16px',
          }}
        >
          <button
            onClick={() => setShowContributionForm(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: 'rgba(181, 154, 106, 0.25)',
              backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
              border: '2px solid rgba(181, 154, 106, 0.4)',
              color: '#F5F2EC',
              backdropFilter: 'blur(12px)',
            }}
            title="Agregar aporte"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="w-full h-full overflow-y-auto" 
      style={{ 
        maxHeight: '100vh',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {renderContent()}
    </div>
  );
}
