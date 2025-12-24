import Card from '../Card';
import { formatCurrency } from '@/mock/data';

interface FlowIndicatorsProps {
  flows: any[]; // Mock: usar tipo genérico
}

export default function FlowIndicators({ flows }: FlowIndicatorsProps) {
  // Mock: datos de indicadores
  const recurringExpenses = [
    { concept: 'Supermercado', frequency: 'Mensual', average: 82500 },
    { concept: 'Servicios', frequency: 'Mensual', average: 25000 },
    { concept: 'Gastos recurrentes', frequency: 'Mensual', average: 50000 },
  ];

  const incomePattern = {
    stable: [
      { concept: 'Salario', average: 500000 },
    ],
    variable: [
      { concept: 'Dividendos', range: { min: 15000, max: 75000 } },
      { concept: 'Alquiler', range: { min: 150000, max: 150000 } },
    ],
  };

  const alerts = [
    'Gasto inusual detectado este mes',
    'Aporte pendiente a Fondo Renta Variable',
  ];

  return (
    <Card>
      {/* Gastos Recurrentes */}
      <div className="mb-8">
        <h4 className="text-body-large font-medium text-black mb-4">Gastos Recurrentes</h4>
        <div className="space-y-3">
          {recurringExpenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="text-body text-black">{expense.concept}</div>
                <div className="text-body text-gray-text-tertiary">{expense.frequency}</div>
              </div>
              <div className="text-body font-mono-numbers text-gray-text-tertiary">
                {formatCurrency(expense.average)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patrón de Ingresos */}
      <div className="mb-8">
        <h4 className="text-body-large font-medium text-black mb-4">Patrón de Ingresos</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-body text-gray-text-tertiary mb-2">Estables</div>
            {incomePattern.stable.map((income, index) => (
              <div key={index} className="text-body text-black mb-1">
                {income.concept}: {formatCurrency(income.average)}
              </div>
            ))}
          </div>
          <div>
            <div className="text-body text-gray-text-tertiary mb-2">Variables</div>
            {incomePattern.variable.map((income, index) => (
              <div key={index} className="text-body text-black mb-1">
                {income.concept}: {formatCurrency(income.range.min)} - {formatCurrency(income.range.max)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas Suaves */}
      {alerts.length > 0 && (
        <div>
          <h4 className="text-body-large font-medium text-black mb-4">Atención</h4>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="text-body text-black">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

