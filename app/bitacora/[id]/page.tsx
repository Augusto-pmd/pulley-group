import Link from 'next/link';
import ContextHeader from '@/components/ContextHeader';
import DecisionDetail from '@/components/bitacora/DecisionDetail';
import { mockDecisions, getDecisionTypeLabel } from '@/mock/data';

interface BitacoraDetailPageProps {
  params: {
    id: string;
  };
}

export default function BitacoraDetailPage({ params }: BitacoraDetailPageProps) {
  const decision = mockDecisions.find((d) => d.id === params.id);

  if (!decision) {
    return (
      <div className="text-center py-16">
        <h1 className="text-heading-1 font-semibold text-gray-text-primary mb-4">
          Decisión no encontrada
        </h1>
        <Link
          href="/bitacora"
          className="text-body-large text-blue-system hover:text-blue-hover transition-colors duration-fast"
        >
          Volver a la Bitácora
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Navegación contextual (Nivel 2) */}
      <div className="mb-6">
        <ContextHeader
          module={{ label: 'Bitácora', href: '/bitacora' }}
          entity={{ label: getDecisionTypeLabel(decision.type) }}
        />
      </div>

      {/* Vista Detalle de Decisión */}
      <DecisionDetail decision={decision} />
    </>
  );
}

