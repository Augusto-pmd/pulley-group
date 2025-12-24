import Link from 'next/link';
import Card from '@/components/Card';
import ContextHeader from '@/components/ContextHeader';
import Tabs from '@/components/Tabs';
import InvestmentSummary from '@/components/investment/InvestmentSummary';
import InvestmentFlows from '@/components/investment/InvestmentFlows';
import InvestmentPerformance from '@/components/investment/InvestmentPerformance';
import InvestmentProjection from '@/components/investment/InvestmentProjection';
import InvestmentNotes from '@/components/investment/InvestmentNotes';
import { mockInvestments } from '@/mock/data';

interface InvestmentDetailPageProps {
  params: {
    id: string;
  };
}

export default function InvestmentDetailPage({ params }: InvestmentDetailPageProps) {
  const investment = mockInvestments.find((inv) => inv.id === params.id);

  if (!investment) {
    return (
      <div className="text-center py-16">
        <h1 className="text-heading-1 font-semibold text-gray-text-primary mb-4">
          Inversión no encontrada
        </h1>
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
          {/* Nombre de Inversión */}
          <h1 className="text-display-2 text-gray-text-primary mb-1">
            {investment.name}
          </h1>
          {/* Tipo y Estado */}
          <div className="text-body-large text-gray-text-tertiary">
            {investment.type} · Activa
          </div>
        </Card>
      </div>

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

