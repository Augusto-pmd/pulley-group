import Card from '../Card';
import { formatCurrency } from '@/mock/data';

interface Flow {
  date: string;
  type: string;
  amount: number;
  balance: number;
  description?: string;
}

interface InvestmentFlowsProps {
  investmentId: string;
}

// Mock: datos de flujos
const mockFlows: Flow[] = [
  { date: '15/03/2022', type: 'Aporte', amount: 1000000, balance: 1000000, description: 'Aporte inicial' },
  { date: '15/06/2022', type: 'Aporte', amount: 500000, balance: 1500000 },
  { date: '15/09/2022', type: 'Dividendo', amount: 75000, balance: 1575000 },
  { date: '15/12/2022', type: 'Aporte', amount: 500000, balance: 2075000 },
  { date: '15/03/2023', type: 'Dividendo', amount: 100000, balance: 2175000 },
  { date: '15/06/2023', type: 'Aporte', amount: 325000, balance: 2500000 },
];

export default function InvestmentFlows({ investmentId }: InvestmentFlowsProps) {
  const totalContributions = mockFlows
    .filter((f) => f.type === 'Aporte')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalWithdrawals = mockFlows
    .filter((f) => f.type === 'Retiro')
    .reduce((sum, f) => sum + Math.abs(f.amount), 0);
  const totalIncome = mockFlows
    .filter((f) => f.type === 'Dividendo' || f.type === 'Interés')
    .reduce((sum, f) => sum + f.amount, 0);
  const currentBalance = mockFlows[mockFlows.length - 1]?.balance || 0;

  const formatSignedValue = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  return (
    <Card>
      {/* Resumen de Flujos */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL APORTES
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrency(totalContributions)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL RETIROS
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrency(totalWithdrawals)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            TOTAL INGRESOS
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div>
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
            SALDO ACTUAL
          </div>
          <div className="text-[20px] font-semibold font-mono-numbers text-black">
            {formatCurrency(currentBalance)}
          </div>
        </div>
      </div>

      {/* Tabla de Flujos */}
      <div>
        {/* Header de Tabla */}
        <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4">
          <div className="w-[120px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            FECHA
          </div>
          <div className="w-[140px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            TIPO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            MONTO
          </div>
          <div className="w-[160px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            SALDO
          </div>
          <div className="flex-1 text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
            DESCRIPCIÓN
          </div>
        </div>

        {/* Filas */}
        {mockFlows.map((flow, index) => (
          <div
            key={index}
            className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast"
          >
            <div className="w-[120px] text-body-large text-black">{flow.date}</div>
            <div className="w-[140px] text-body-large text-black">{flow.type}</div>
            <div className="w-[160px] text-right text-body-large font-mono-numbers text-black">
              {formatSignedValue(flow.amount)}
            </div>
            <div className="w-[160px] text-right text-body-large font-mono-numbers text-black">
              {formatCurrency(flow.balance)}
            </div>
            <div className="flex-1 text-body text-gray-text-tertiary">
              {flow.description || '-'}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

