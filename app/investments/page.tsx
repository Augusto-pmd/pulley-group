'use client';

import { useState, useEffect } from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentFilters from '@/components/InvestmentFilters';
import ModuleHeader from '@/components/ModuleHeader';
import InvestmentEventForm from '@/components/investment/InvestmentEventForm';
import AddInvestmentForm from '@/components/investment/AddInvestmentForm';
import Card from '@/components/Card';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-gray-text-tertiary">Cargando inversiones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Inversiones"
          description="Proyectos de inversión con objetivo, plazo y criterio de evaluación"
          status={{
            label: 'Estado',
            value: `${totalInvestments} inversiones activas`,
            color: 'success',
          }}
          primaryAction={{
            label: inversiones.length === 0 ? 'Crear inversión' : 'Registrar evento',
            onClick: inversiones.length === 0 ? handleCreateInvestment : handleRegisterEvent,
          }}
          secondaryAction={
            inversiones.length > 0
              ? {
                  label: 'Crear inversión',
                  onClick: handleCreateInvestment,
                }
              : undefined
          }
        />
      </div>

      {/* CAPA 2: ZONA DE EDICIÓN (CLARA Y GUIADA) - Crear inversión */}
      {showAddForm && (
        <div className="mb-10">
          <AddInvestmentForm
            onClose={handleCloseAddForm}
            onSave={handleSaveInvestment}
          />
        </div>
      )}

      {/* CAPA 2: ZONA DE EDICIÓN (CLARA Y GUIADA) - Registrar evento */}
      {showEventForm && !showAddForm && (
        <div className="mb-10">
          <InvestmentEventForm
            investmentId={selectedInvestmentId}
            onClose={handleCloseEventForm}
            onSave={handleSaveEvent}
          />
        </div>
      )}

      {/* CAPA 3: CONTEXTO Y RESULTADO - Solo cuando no se está editando */}
      {!showEventForm && !showAddForm && (
        <>
          {/* ESTRUCTURA RADIAL: Capital total en el centro, inversiones orbitan */}
          <div className="relative min-h-[60vh] flex flex-col items-center">
            {/* CENTRO: Capital total de inversiones - Núcleo del anillo */}
            {investmentsForCard.length > 0 && (
              <div className="mb-12 w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                    CAPITAL TOTAL INVERSIONES
                  </div>
                  <div className="text-center">
                    <CurrencyDisplay 
                      value={investmentsForCard.reduce((sum, inv) => sum + inv.capital, 0)} 
                      size="display" 
                      showSecondary={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ORBITA: Lista de inversiones - Orbitan alrededor del centro */}
            <div className="w-full max-w-3xl space-y-4">
              {/* Filtros discretos - No compiten con el centro */}
              {inversiones.length > 0 && (
                <div className="mb-6" style={{ opacity: 0.6 }}>
                  <InvestmentFilters />
                </div>
              )}

              {inversiones.length === 0 ? (
            <Card padding="large">
              <div className="text-center py-12">
                <p className="text-body-large text-gray-text-primary mb-2">
                  No hay inversiones creadas
                </p>
                <p className="text-body text-gray-text-tertiary mb-6">
                  Crea tu primera inversión para comenzar a registrar eventos.
                </p>
                <button
                  onClick={handleCreateInvestment}
                  className="px-6 py-3 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
                >
                  Crear primera inversión
                </button>
              </div>
            </Card>
          ) : (
                <div className="space-y-3">
                  {investmentsForCard
                    .filter((investment) => investment.capital > 0) // Solo mostrar inversiones con capital real
                    .map((investment) => (
                      <InvestmentCard 
                        key={investment.id} 
                        investment={investment}
                        onDelete={handleDeleteInvestment}
                      />
                    ))}
                  {investmentsForCard.filter((investment) => investment.capital === 0).length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-body text-text-secondary mb-2" style={{ opacity: 0.6 }}>
                        {investmentsForCard.filter((investment) => investment.capital === 0).length} inversión(es) sin eventos registrados
                      </p>
                      <p className="text-body-small text-text-secondary" style={{ opacity: 0.4 }}>
                        Registra aportes o retiros para ver estas inversiones en el listado.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

