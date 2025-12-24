import Link from 'next/link';
import Card from '../Card';
import { getDecisionTypeLabel } from '@/mock/data';
import type { Decision } from '@/mock/data';

interface DecisionDetailProps {
  decision: Decision;
}

export default function DecisionDetail({ decision }: DecisionDetailProps) {
  return (
    <Card padding="large">
      {/* Header de Decisión */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-black mb-1">
            {getDecisionTypeLabel(decision.type)}
          </h1>
          <div className="text-body text-gray-text-tertiary">
            {decision.date}
          </div>
        </div>
      </div>

      {/* Sección 1: Motivo */}
      <div className="mb-8">
        <h3 className="text-body-large font-medium text-black mb-3">MOTIVO</h3>
        <p className="text-body-large text-black">
          {decision.reason}
        </p>
      </div>

      {/* Sección 2: Contexto */}
      <div className="mb-8">
        <h3 className="text-body-large font-medium text-black mb-3">CONTEXTO</h3>
        <p className="text-body-large text-black">
          {decision.context}
        </p>
      </div>

      {/* Sección 3: Alternativas Consideradas */}
      <div className="mb-8">
        <h3 className="text-body-large font-medium text-black mb-3">ALTERNATIVAS CONSIDERADAS</h3>
        <ul className="space-y-2">
          {decision.alternatives.map((alternative, index) => (
            <li key={index} className="text-body-large text-black flex items-start">
              <span className="text-body-large text-gray-text-tertiary mr-2">·</span>
              <span>{alternative}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección 4: Resultado Esperado */}
      <div className="mb-8">
        <h3 className="text-body-large font-medium text-black mb-3">RESULTADO ESPERADO</h3>
        <p className="text-body-large text-black">
          {decision.expectedResult}
        </p>
      </div>

      {/* Link a Inversión (si aplica) */}
      {decision.investmentId && decision.investmentName && (
        <div className="text-right">
          <Link
            href={`/investments/${decision.investmentId}`}
            className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
          >
            Ver inversión →
          </Link>
        </div>
      )}
    </Card>
  );
}

