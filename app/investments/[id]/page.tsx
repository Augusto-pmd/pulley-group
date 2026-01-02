'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import ContextHeader from '@/components/ContextHeader';
import Tabs from '@/components/Tabs';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import InvestmentSummary from '@/components/investment/InvestmentSummary';
import InvestmentFlows from '@/components/investment/InvestmentFlows';
import InvestmentPerformance from '@/components/investment/InvestmentPerformance';
import InvestmentProjection from '@/components/investment/InvestmentProjection';
import InvestmentNotes from '@/components/investment/InvestmentNotes';
import type { Investment } from '@/mock/data';
import { getInvestment, getInvestmentEvents, deleteInvestment, type ApiInvestment } from '@/lib/api';

interface InvestmentDetailPageProps {
  params: {
    id: string;
  };
}

// Función para convertir ApiInvestment + eventos a Investment
async function apiInvestmentToInvestment(apiInvestment: ApiInvestment): Promise<Investment> {
  // Si no hay eventos cargados, cargarlos
  let events = apiInvestment.events;
  if (!events) {
    events = await getInvestmentEvents(apiInvestment.id);
  }

  // Calcular capital, result, ROI SOLO desde eventos reales
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

export default function InvestmentDetailPage({ params }: InvestmentDetailPageProps) {
  const router = useRouter();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadInvestment() {
      try {
        setLoading(true);
        const apiInvestment = await getInvestment(params.id);
        const transformed = await apiInvestmentToInvestment(apiInvestment);
        setInvestment(transformed);
        setError(null);
      } catch (err: any) {
        console.error('Error loading investment:', err);
        setError(err.message || 'Error al cargar inversión');
      } finally {
        setLoading(false);
      }
    }

    loadInvestment();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-gray-text-tertiary">Cargando inversión...</div>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="text-center py-16">
        <h1 className="text-heading-1 font-semibold text-gray-text-primary mb-4">
          Inversión no encontrada
        </h1>
        {error && (
          <p className="text-body text-red-600 mb-4">{error}</p>
        )}
        <Link
          href="/investments"
          className="text-body-large text-blue-system hover:text-blue-hover transition-colors duration-fast"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Navegación contextual (Nivel 2) */}
      <div className="mb-6">
        <ContextHeader
          module={{ label: 'Inversiones', href: '/investments' }}
          entity={{ label: investment.name }}
        />
      </div>

      {/* Encabezado de la inversión */}
      <div className="mb-8">
        <Card padding="large">
          <div className="flex items-start justify-between">
            <div>
              {/* Nombre de Inversión */}
              <h1 className="text-display-2 text-gray-text-primary mb-1">
                {investment.name}
              </h1>
              {/* Tipo y Estado */}
              <div className="text-body-large text-gray-text-tertiary">
                {investment.type} · Activa
              </div>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-body-small text-red-600 hover:bg-red-50 rounded-button border border-red-200 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eliminar
            </button>
          </div>
        </Card>
      </div>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        title="Eliminar inversión"
        message="¿Estás seguro de que deseas eliminar esta inversión? Se eliminarán también todos los eventos asociados (aportes, retiros, ajustes)."
        itemName={investment.name}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            await deleteInvestment(investment.id);
            router.push('/investments');
          } catch (error) {
            console.error('Error deleting investment:', error);
            alert('Error al eliminar la inversión. Por favor, intenta nuevamente.');
            setIsDeleting(false);
            setShowDeleteConfirm(false);
          }
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

        {/* Pestañas */}
        <Tabs
          defaultTab="resumen"
          tabs={[
            {
              id: 'resumen',
              label: 'Resumen',
              content: <InvestmentSummary investment={investment} />,
            },
            {
              id: 'flujos',
              label: 'Flujos',
              content: <InvestmentFlows investmentId={investment.id} />,
            },
            {
              id: 'rendimiento',
              label: 'Rendimiento',
              content: <InvestmentPerformance investment={investment} />,
            },
            {
              id: 'proyeccion',
              label: 'Proyección',
              content: <InvestmentProjection investment={investment} />,
            },
            {
              id: 'notas',
              label: 'Notas / Decisiones',
              content: <InvestmentNotes investmentId={investment.id} />,
            },
          ]}
        />
    </>
  );
}

