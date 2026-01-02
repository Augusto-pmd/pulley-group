import Card from '../Card';
import { formatCurrency } from '@/utils/number-format';
import type { Scenario, Horizon } from '@/mock/data';
import { mockScenarioProjections } from '@/mock/data';

interface IPCImpactProps {
  scenario: Scenario;
  horizon: Horizon;
}

export default function IPCImpact({ scenario, horizon }: IPCImpactProps) {
  const projection = mockScenarioProjections[scenario][horizon];
  
  // Si no hay datos reales, mostrar estado vacío
  if (projection.nominal === 0 && projection.real === 0) {
    return (
      <Card padding="large">
        <div className="pb-6 border-b border-gray-divider mb-0">
          <h3 className="text-heading-3 font-semibold text-black mb-1">IMPACTO DEL IPC</h3>
          <p className="text-body text-gray-text-tertiary">
            Cómo la inflación afecta el poder adquisitivo de tu patrimonio
          </p>
        </div>
        <div className="pt-6 text-center text-body text-gray-text-tertiary">
          No hay proyecciones disponibles. Configure los supuestos en Settings.
        </div>
      </Card>
    );
  }
  
  const difference = projection.nominal - projection.real;

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">IMPACTO DEL IPC</h3>
        <p className="text-body text-gray-text-tertiary">
          Cómo la inflación afecta el poder adquisitivo de tu patrimonio
        </p>
      </div>

      {/* Comparación Visual - Grid 2 Columnas */}
      <div className="pt-6 grid grid-cols-2 gap-12">
        {/* Columna 1: Valor Nominal */}
        <div className="text-center">
          <div className="text-body font-medium text-gray-text-tertiary uppercase tracking-wider mb-2">
            VALOR NOMINAL
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2] mb-2">
            {formatCurrency(projection.nominal)}
          </div>
          <div className="text-body text-gray-text-disabled">
            Sin ajuste por inflación
          </div>
        </div>

        {/* Columna 2: Valor Real */}
        <div className="text-center">
          <div className="text-body font-medium text-gray-text-tertiary uppercase tracking-wider mb-2">
            VALOR REAL
          </div>
          <div className="text-[28px] font-semibold font-mono-numbers text-black leading-[1.2] mb-2">
            {formatCurrency(projection.real)}
          </div>
          <div className="text-body text-gray-text-disabled">
            Ajustado por inflación (IPC)
          </div>
        </div>
      </div>

      {/* Diferencia */}
      <div className="mt-8 text-center">
        <div className="text-body-large font-medium text-black mb-2">Diferencia</div>
        <div className="text-[20px] font-semibold font-mono-numbers text-black mb-2">
          {formatCurrency(difference)}
        </div>
        <div className="text-body text-gray-text-tertiary">
          Erosión del poder adquisitivo por inflación
        </div>
      </div>

      {/* Explicación Conceptual */}
      <div className="mt-8 text-body text-gray-text-tertiary">
        El valor nominal muestra el monto en pesos. El valor real muestra cuánto puedes comprar realmente con ese monto, considerando la inflación. La diferencia es la erosión del poder adquisitivo.
      </div>
    </Card>
  );
}

