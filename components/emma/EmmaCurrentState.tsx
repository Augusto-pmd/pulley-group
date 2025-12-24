import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { mockEmmaCurrentState } from '@/mock/data';

export default function EmmaCurrentState() {
  const formatTimeElapsed = () => {
    const { elapsedYears, elapsedMonths } = mockEmmaCurrentState;
    if (elapsedYears === 0) {
      return `${elapsedMonths} meses`;
    }
    if (elapsedMonths === 0) {
      return `${elapsedYears} años`;
    }
    return `${elapsedYears} años ${elapsedMonths} meses`;
  };

  return (
    <Card padding="large">
      <div className="grid grid-cols-2 gap-12">
        {/* Fila 1: Capital Acumulado y Aporte Mensual */}
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            CAPITAL ACUMULADO
          </div>
          <CurrencyDisplay 
            value={mockEmmaCurrentState.currentCapital} 
            size="large" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            APORTE MENSUAL
          </div>
          <CurrencyDisplay 
            value={mockEmmaCurrentState.monthlyContribution} 
            size="medium" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        {/* Fila 2: Aporte Inicial y Tiempo Transcurrido */}
        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            APORTE INICIAL
          </div>
          <CurrencyDisplay 
            value={mockEmmaCurrentState.initialContribution} 
            size="regular" 
            showSecondary={true}
            originalCurrency="USD"
          />
        </div>

        <div className="mt-8">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TIEMPO TRANSCURRIDO
          </div>
          <div className="text-[24px] font-semibold font-mono-numbers text-black leading-[1.2]">
            {formatTimeElapsed()}
          </div>
        </div>
      </div>
    </Card>
  );
}

