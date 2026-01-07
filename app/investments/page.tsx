'use client';

import { useState, useEffect } from 'react';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentFilters from '@/components/InvestmentFilters';
import InvestmentEventForm from '@/components/investment/InvestmentEventForm';
import AddInvestmentForm from '@/components/investment/AddInvestmentForm';
import RadialCard from '@/components/circular/RadialCard';
import RadialList from '@/components/circular/RadialList';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { type Inversion } from '@/mock/inversiones';
import type { Investment } from '@/mock/data';
import {
  getInvestments,
  createInvestment,
  getInvestmentEvents,
  deleteInvestment,
  type ApiInvestment,
} from '@/lib/api';

// Función de transformación entre tipos de API y tipos del mock
function apiInvestmentToInversion(apiInvestment: ApiInvestment): Inversion {
  return {
    id: apiInvestment.id,
    nombre: apiInvestment.name,
    tipo: apiInvestment.type,
    fechaInicio: apiInvestment.startDate.split('T')[0],
    montoObjetivo: apiInvestment.targetAmountUSD,
    plazoEstimado: 60, // No está en la API, usar valor por defecto
    tipoRetorno: 'mixta', // No está en la API, usar valor por defecto
    estadoFiscal: 'declarado', // No está en la API, usar valor por defecto
    fechaCreacion: apiInvestment.startDate.split('T')[0],
  };
}

// Función para convertir ApiInvestment + eventos a Investment (para InvestmentCard)
async function apiInvestmentToInvestment(apiInvestment: ApiInvestment): Promise<Investment> {
  // Calcular capital, result, ROI SOLO desde eventos reales
  const events = apiInvestment.events || [];
  let capital = 0;
  let result = 0;

  events.forEach((event) => {
    if (event.type === 'aporte') {
      capital += event.amountUSD;
      result += event.amountUSD;
    } else if (event.type === 'retiro') {
      capital -= event.amountUSD;
      result -= event.amountUSD;
    } else if (event.type === 'ajuste') {
      // Ajuste modifica el resultado pero no el capital
      result += event.amountUSD;
    }
  });

  // NO usar targetAmountUSD como capital inicial - solo eventos reales
  // Si no hay eventos, capital = 0

  // Calcular ROI solo si hay capital real
  const roiNominal = capital > 0 ? (result / capital) * 100 : 0;
  // ROI Real requiere IPC real, no supuestos - por ahora 0 hasta que haya backend de IPC
  const roiReal = 0;

  return {
    id: apiInvestment.id,
    name: apiInvestment.name,
    type: apiInvestment.type === 'financiera' ? 'Financiera' : 'Inmobiliaria',
    capital,
    result,
    roiNominal,
    roiReal,
    status: 'active',
  };
}

export default function InvestmentsPage() {
  const { activeDomain, setDomainContent } = useCircularNavigation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar inversiones desde la API
  useEffect(() => {
    async function loadInvestments() {
      try {
        setLoading(true);
        setError(null);
        const apiInvestments = await getInvestments();
        // Asegurar que apiInvestments es un array antes de mapear
        const transformedInvestments = Array.isArray(apiInvestments)
          ? apiInvestments.map(apiInvestmentToInversion)
          : [];
        setInversiones(transformedInvestments);
      } catch (err: any) {
        console.error('Error loading investments:', err);
        setError(err.message || 'Error al cargar inversiones');
        // En caso de error, establecer array vacío para evitar errores de renderizado
        setInversiones([]);
      } finally {
        setLoading(false);
      }
    }

    loadInvestments();
  }, []);

  // Estado para inversiones transformadas para InvestmentCard
  const [investmentsForCard, setInvestmentsForCard] = useState<Investment[]>([]);

  // Cargar inversiones transformadas para InvestmentCard
  useEffect(() => {
    async function loadInvestmentsForCard() {
      try {
        const apiInvestments = await getInvestments();
        // Asegurar que apiInvestments es un array antes de mapear
        if (Array.isArray(apiInvestments) && apiInvestments.length > 0) {
          const transformed = await Promise.all(
            apiInvestments.map(apiInvestmentToInvestment)
          );
          setInvestmentsForCard(transformed);
        } else {
          setInvestmentsForCard([]);
        }
      } catch (err) {
        console.error('Error loading investments for card:', err);
        setInvestmentsForCard([]);
      }
    }

    if (inversiones.length > 0) {
      loadInvestmentsForCard();
    } else {
      setInvestmentsForCard([]);
    }
  }, [inversiones]);

  const totalInvestments = inversiones.length;

  const handleCreateInvestment = () => {
    setShowAddForm(true);
    setShowEventForm(false);
  };

  const handleRegisterEvent = () => {
    // Solo permitir registrar eventos si hay inversiones creadas
    if (inversiones.length === 0) {
      alert('Primero debes crear una inversión antes de registrar eventos.');
      return;
    }
    setShowEventForm(true);
    setShowAddForm(false);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedInvestmentId(null);
  };

  const handleDeleteInvestment = async (id: string) => {
    try {
      // Recargar inversiones desde la API
      const apiInvestments = await getInvestments();
      const transformedInvestments = Array.isArray(apiInvestments)
        ? apiInvestments.map(apiInvestmentToInversion)
        : [];
      setInversiones(transformedInvestments);
      
      // Recargar inversiones para InvestmentCard
      const transformedForCard = await Promise.all(
        apiInvestments.map(apiInvestmentToInvestment)
      );
      setInvestmentsForCard(transformedForCard);
    } catch (err: any) {
      console.error('Error deleting investment:', err);
      setError(err.message || 'Error al eliminar inversión');
    }
  };

  const handleSaveInvestment = async () => {
    // La creación se maneja en AddInvestmentForm, aquí solo recargamos
    try {
      const apiInvestments = await getInvestments();
      // Asegurar que apiInvestments es un array antes de mapear
      const transformedInvestments = Array.isArray(apiInvestments)
        ? apiInvestments.map(apiInvestmentToInversion)
        : [];
      setInversiones(transformedInvestments);
      
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('investment-changed'));
      
      // Recargar también para InvestmentCard
      if (Array.isArray(apiInvestments) && apiInvestments.length > 0) {
        const transformed = await Promise.all(
          apiInvestments.map(apiInvestmentToInvestment)
        );
        setInvestmentsForCard(transformed);
      } else {
        setInvestmentsForCard([]);
      }
      
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error refreshing investments:', err);
      setError(err.message || 'Error al actualizar inversiones');
    }
  };

  const handleSaveEvent = async () => {
    // La creación se maneja en InvestmentEventForm, aquí solo recargamos
    try {
      const apiInvestments = await getInvestments();
      // Asegurar que apiInvestments es un array antes de mapear
      const transformedInvestments = Array.isArray(apiInvestments)
        ? apiInvestments.map(apiInvestmentToInversion)
        : [];
      setInversiones(transformedInvestments);
      
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('investment-changed'));
      
      // Recargar también para InvestmentCard
      if (Array.isArray(apiInvestments) && apiInvestments.length > 0) {
        const transformed = await Promise.all(
          apiInvestments.map(apiInvestmentToInvestment)
        );
        setInvestmentsForCard(transformed);
      } else {
        setInvestmentsForCard([]);
      }
      
      handleCloseEventForm();
    } catch (err: any) {
      console.error('Error refreshing investments:', err);
      setError(err.message || 'Error al actualizar inversiones');
    }
  };

  const totalCapital = investmentsForCard.reduce((sum, inv) => sum + inv.capital, 0);

  // Inyectar contenido en el contexto circular cuando el dominio está activo
  useEffect(() => {
    if (activeDomain === 'inversiones') {
      const content = (
        <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-body text-text-secondary">Cargando inversiones...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-body text-red-400">Error: {error}</div>
            </div>
          ) : showAddForm ? (
            <div className="p-8">
              <AddInvestmentForm
                onClose={handleCloseAddForm}
                onSave={handleSaveInvestment}
              />
            </div>
          ) : showEventForm ? (
            <div className="p-8">
              <InvestmentEventForm
                investmentId={selectedInvestmentId}
                onClose={handleCloseEventForm}
                onSave={handleSaveEvent}
              />
            </div>
          ) : (
            <div className="p-8">
              {/* ESTRUCTURA RADIAL: Capital total en el centro, inversiones orbitan */}
              <div className="relative min-h-[60vh] flex flex-col items-center">
                {/* CENTRO: Capital total de inversiones - Núcleo circular */}
                {totalCapital > 0 && (
                  <RadialCard className="mb-12" padding="large">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                        CAPITAL TOTAL INVERSIONES
                      </div>
                      <CurrencyDisplay 
                        value={totalCapital} 
                        size="display" 
                        showSecondary={false}
                      />
                      <div className="text-body text-text-secondary text-center mt-4" style={{ opacity: 0.5 }}>
                        {investmentsForCard.filter(inv => inv.capital > 0).length} {investmentsForCard.filter(inv => inv.capital > 0).length === 1 ? 'inversión' : 'inversiones'}
                      </div>
                    </div>
                  </RadialCard>
                )}

                {/* ORBITA: Lista de inversiones - Orbitan alrededor del centro */}
                {inversiones.length === 0 ? (
                  <RadialCard className="mt-8">
                    <div className="text-center py-8">
                      <div className="text-body text-text-secondary mb-2" style={{ opacity: 0.6 }}>
                        No hay inversiones creadas
                      </div>
                      <button
                        onClick={handleCreateInvestment}
                        className="mt-4 px-6 py-3 rounded-full text-body font-medium transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(181, 154, 106, 0.2)',
                          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                          border: '1px solid rgba(181, 154, 106, 0.4)',
                          color: '#F5F2EC',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        Crear primera inversión
                      </button>
                    </div>
                  </RadialCard>
                ) : (
                  <div className="w-full max-w-3xl space-y-4">
                    {inversiones.length > 0 && (
                      <div className="mb-6" style={{ opacity: 0.6 }}>
                        <InvestmentFilters />
                      </div>
                    )}
                    <div className="space-y-3">
                      {investmentsForCard
                        .filter((investment) => investment.capital > 0)
                        .map((investment) => (
                          <InvestmentCard 
                            key={investment.id} 
                            investment={investment}
                            onDelete={handleDeleteInvestment}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botones flotantes para acciones */}
              <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
                {inversiones.length > 0 && (
                  <button
                    onClick={handleRegisterEvent}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(181, 154, 106, 0.25)',
                      backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
                      border: '2px solid rgba(181, 154, 106, 0.4)',
                      color: '#F5F2EC',
                      backdropFilter: 'blur(12px)',
                    }}
                    title="Registrar evento"
                  >
                    <span className="text-xl">📊</span>
                  </button>
                )}
                <button
                  onClick={handleCreateInvestment}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.25)',
                    backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
                    border: '2px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(12px)',
                  }}
                  title="Crear inversión"
                >
                  <span className="text-2xl">+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      );
      
      setDomainContent('inversiones', content);
    } else {
      setDomainContent('inversiones', null);
    }
  }, [activeDomain, inversiones, investmentsForCard, loading, error, showAddForm, showEventForm, selectedInvestmentId, totalCapital, setDomainContent]);

  // Renderizar contenido directamente - el Ring es decorativo pero el contenido debe ser visible
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-body text-text-secondary">Cargando inversiones...</div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-body text-red-400">Error: {error}</div>
        </div>
      );
    }
    if (showAddForm) {
      return (
        <div className="p-8">
          <AddInvestmentForm
            onClose={handleCloseAddForm}
            onSave={handleSaveInvestment}
          />
        </div>
      );
    }
    if (showEventForm) {
      return (
        <div className="p-8">
          <InvestmentEventForm
            investmentId={selectedInvestmentId}
            onClose={handleCloseEventForm}
            onSave={handleSaveEvent}
          />
        </div>
      );
    }
    return (
      <div className="p-8">
        <div className="relative min-h-[60vh] flex flex-col items-center">
          {totalCapital > 0 && (
            <RadialCard className="mb-12" padding="large">
              <div className="flex flex-col items-center justify-center">
                <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                  CAPITAL TOTAL INVERSIONES
                </div>
                <CurrencyDisplay 
                  value={totalCapital} 
                  size="display" 
                  showSecondary={false}
                />
                <div className="text-body text-text-secondary text-center mt-4" style={{ opacity: 0.5 }}>
                  {investmentsForCard.filter(inv => inv.capital > 0).length} {investmentsForCard.filter(inv => inv.capital > 0).length === 1 ? 'inversión' : 'inversiones'}
                </div>
              </div>
            </RadialCard>
          )}
          {inversiones.length === 0 ? (
            <RadialCard className="mt-8">
              <div className="text-center py-8">
                <div className="text-body text-text-secondary mb-2" style={{ opacity: 0.6 }}>
                  No hay inversiones creadas
                </div>
                <button
                  onClick={handleCreateInvestment}
                  className="mt-4 px-6 py-3 rounded-full text-body font-medium transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.2)',
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                    border: '1px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Crear primera inversión
                </button>
              </div>
            </RadialCard>
          ) : (
            <div className="w-full max-w-3xl space-y-4">
              {inversiones.length > 0 && (
                <div className="mb-6" style={{ opacity: 0.6 }}>
                  <InvestmentFilters />
                </div>
              )}
              <div className="space-y-3">
                {investmentsForCard
                  .filter((investment) => investment.capital > 0)
                  .map((investment) => (
                    <InvestmentCard 
                      key={investment.id} 
                      investment={investment}
                      onDelete={handleDeleteInvestment}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
          {inversiones.length > 0 && (
            <button
              onClick={handleRegisterEvent}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: 'rgba(181, 154, 106, 0.25)',
                backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
                border: '2px solid rgba(181, 154, 106, 0.4)',
                color: '#F5F2EC',
                backdropFilter: 'blur(12px)',
              }}
              title="Registrar evento"
            >
              <span className="text-xl">📊</span>
            </button>
          )}
          <button
            onClick={handleCreateInvestment}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: 'rgba(181, 154, 106, 0.25)',
              backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
              border: '2px solid rgba(181, 154, 106, 0.4)',
              color: '#F5F2EC',
              backdropFilter: 'blur(12px)',
            }}
            title="Crear inversión"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      </div>
    );
  };

  return <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>{renderContent()}</div>;
}

