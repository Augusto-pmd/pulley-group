import Card from '../Card';

interface InvestmentNotesProps {
  investmentId: string;
}

// Mock: notas y decisiones
const mockNotes = 'Inversión de largo plazo en renta variable. Objetivo: crecimiento del capital a 10 años.';
const mockDecisions = [
  {
    date: '15/03/2022',
    decision: 'Inversión inicial',
    reason: 'Diversificación del portfolio y exposición a renta variable',
    expectedResult: 'Crecimiento del capital a mediano plazo',
  },
  {
    date: '15/06/2023',
    decision: 'Aumento de capital',
    reason: 'Rendimiento positivo y confianza en la estrategia',
    expectedResult: 'Mayor exposición y potencial de crecimiento',
  },
];

export default function InvestmentNotes({ investmentId }: InvestmentNotesProps) {
  return (
    <Card>
      {/* Sección: Notas */}
      <div className="mb-8">
        <h4 className="text-heading-3 font-semibold text-black mb-4">Notas</h4>
        <div className="bg-gray-bg border border-gray-border rounded-button p-4 min-h-[200px]">
          <p className="text-body-large text-black whitespace-pre-wrap">{mockNotes}</p>
        </div>
        <div className="text-caption text-gray-text-disabled mt-2">
          Última edición: 15/06/2023
        </div>
      </div>

      {/* Sección: Decisiones */}
      <div>
        <h4 className="text-heading-3 font-semibold text-black mb-4">Decisiones</h4>
        {mockDecisions.map((decision, index) => (
          <div
            key={index}
            className="bg-gray-bg border border-gray-border rounded-button p-4 mb-4 last:mb-0"
          >
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              {decision.date}
            </div>
            <div className="text-body-large font-medium text-black mb-2">
              {decision.decision}
            </div>
            <div className="text-body text-gray-text-tertiary mb-1">
              Razón: {decision.reason}
            </div>
            <div className="text-body text-gray-text-tertiary">
              Resultado esperado: {decision.expectedResult}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

