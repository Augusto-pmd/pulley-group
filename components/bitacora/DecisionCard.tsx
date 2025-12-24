import Link from 'next/link';
import Card from '../Card';
import { getDecisionTypeLabel } from '@/mock/data';
import type { Decision } from '@/mock/data';

interface DecisionCardProps {
  decision: Decision;
}

export default function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <Link href={`/bitacora/${decision.id}`} className="block">
      <Card className="hover:shadow-card-hover transition-shadow duration-fast cursor-pointer">
        <div className="grid grid-cols-2 gap-6">
          {/* Columna Izquierda: Fecha y Tipo */}
          <div>
            {/* Fecha - 13px, peso 400, gris */}
            <div className="text-body text-gray-text-tertiary mb-2">
              {decision.date}
            </div>
            {/* Tipo de Decisión - 18px, peso 600 */}
            <div className="text-[18px] font-semibold text-black">
              {getDecisionTypeLabel(decision.type)}
            </div>
          </div>

          {/* Columna Derecha: Inversión e Impacto */}
          <div className="text-right">
            {/* Inversión Asociada (si aplica) */}
            {decision.investmentId && decision.investmentName ? (
              <div className="mb-2">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  INVERSIÓN
                </div>
                <Link
                  href={`/investments/${decision.investmentId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-body-large text-blue-system hover:text-blue-hover transition-colors duration-fast"
                >
                  {decision.investmentName}
                </Link>
              </div>
            ) : null}

            {/* Impacto Esperado - 13px, peso 400, gris */}
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                IMPACTO ESPERADO
              </div>
              <div className="text-body text-gray-text-tertiary">
                {decision.expectedImpact}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

