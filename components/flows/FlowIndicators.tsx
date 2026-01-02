import Card from '../Card';
import { formatCurrency } from '@/utils/number-format';

interface FlowIndicatorsProps {
  flows: any[]; // Mock: usar tipo genérico
}

export default function FlowIndicators({ flows }: FlowIndicatorsProps) {
  // Indicadores reales - solo desde datos reales
  // Si no hay flujos reales, mostrar estado vacío
  if (!flows || flows.length === 0) {
    return (
      <Card>
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay datos suficientes para mostrar indicadores
        </div>
      </Card>
    );
  }

  // Calcular indicadores desde flujos reales (requiere backend real)
  // Por ahora, mostrar vacío hasta que haya backend de análisis
  const recurringExpenses: Array<{ concept: string; frequency: string; average: number }> = [];
  const incomePattern = {
    stable: [] as Array<{ concept: string; average: number }>,
    variable: [] as Array<{ concept: string; range: { min: number; max: number } }>,
  };
  const alerts: string[] = [];

  // Si no hay indicadores reales, mostrar estado vacío
  if (recurringExpenses.length === 0 && incomePattern.stable.length === 0 && incomePattern.variable.length === 0 && alerts.length === 0) {
    return (
      <Card>
        <div className="text-center text-body text-gray-text-tertiary py-8">
          No hay datos suficientes para calcular indicadores. Se requieren flujos reales de múltiples meses.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Gastos Recurrentes */}
      {recurringExpenses.length > 0 && (
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
      )}

      {/* Patrón de Ingresos */}
      {(incomePattern.stable.length > 0 || incomePattern.variable.length > 0) && (
        <div className="mb-8">
          <h4 className="text-body-large font-medium text-black mb-4">Patrón de Ingresos</h4>
          <div className="grid grid-cols-2 gap-6">
            {incomePattern.stable.length > 0 && (
              <div>
                <div className="text-body text-gray-text-tertiary mb-2">Estables</div>
                {incomePattern.stable.map((income, index) => (
                  <div key={index} className="text-body text-black mb-1">
                    {income.concept}: {formatCurrency(income.average)}
                  </div>
                ))}
              </div>
            )}
            {incomePattern.variable.length > 0 && (
              <div>
                <div className="text-body text-gray-text-tertiary mb-2">Variables</div>
                {incomePattern.variable.map((income, index) => (
                  <div key={index} className="text-body text-black mb-1">
                    {income.concept}: {formatCurrency(income.range.min)} - {formatCurrency(income.range.max)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

