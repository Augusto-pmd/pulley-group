'use client';

import { useState } from 'react';
import InvestmentCard from '@/components/InvestmentCard';
import InvestmentFilters from '@/components/InvestmentFilters';
import ModuleHeader from '@/components/ModuleHeader';
import InvestmentEventForm from '@/components/investment/InvestmentEventForm';
import AddInvestmentForm from '@/components/investment/AddInvestmentForm';
import { getInversionesActivas } from '@/mock/inversiones';
import { mockInvestments } from '@/mock/data'; // Legacy: usado para convertir Inversion a Investment en InvestmentCard

export default function InvestmentsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  
  const inversiones = getInversionesActivas();
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

  const handleSaveInvestment = () => {
    setShowAddForm(false);
    // Refrescar lista de inversiones (en real, esto actualizaría el estado)
  };

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
            onSave={() => {
              handleCloseEventForm();
              // Mock: aquí se guardaría el evento
            }}
          />
        </div>
      )}

      {/* CAPA 3: CONTEXTO Y RESULTADO - Solo cuando no se está editando */}
      {!showEventForm && !showAddForm && (
        <>
          {/* Filtros y orden */}
          {inversiones.length > 0 && (
            <div className="mb-6">
              <InvestmentFilters />
            </div>
          )}

          {/* Lista de inversiones */}
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
            <div className="space-y-4">
              {inversiones.map((inversion) => {
                // Convertir Inversion a Investment para compatibilidad con InvestmentCard
                const investment: typeof mockInvestments[0] = {
                  id: inversion.id,
                  name: inversion.nombre,
                  type: inversion.tipo === 'financiera' ? 'Financiera' : 'Inmobiliaria',
                  capital: inversion.montoObjetivo, // Mock: usar monto objetivo como capital
                  result: 0, // Mock: se calcularía desde eventos
                  roiNominal: 0, // Mock: se calcularía desde eventos
                  roiReal: 0, // Mock: se calcularía desde eventos
                  status: 'active',
                };
                return <InvestmentCard key={inversion.id} investment={investment} />;
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}

