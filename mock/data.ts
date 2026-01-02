// Datos mock para el sistema Pulley Group

export type Scenario = 'conservador' | 'base' | 'optimista';
export type Horizon = 5 | 10 | 20;

// Tipos para Vida Mensual
export type MovementType = 'ingreso' | 'egreso';
export type MovementCategory = 'fijo' | 'variable' | 'extraordinario';

export interface MonthlyMovement {
  id: string;
  type: MovementType;
  concept: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: MovementCategory;
  isRecurrent?: boolean;
  note?: string;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpenses: number;
  netResult: number;
  averageMonthly: number;
  minimumExpense: number;
  variation: number;
}

export interface Concept {
  id: string;
  name: string;
  type: MovementType;
  category: MovementCategory;
  isRecurrent: boolean;
  frequency?: 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'libre';
  estimatedAmount?: number;
  lastUsed?: string; // YYYY-MM-DD
}

export interface ProjectionData {
  scenario: Scenario;
  horizon: Horizon;
  nominal: number;
  real: number;
}

export interface PatrimonialState {
  total: number;
  monthlyResult: number;
  annualResult: number;
  liquidity: number;
}

export interface Distribution {
  productive: number;
  passive: number;
  liquidity: number;
  longTerm: number;
}

// Interfaz legacy para compatibilidad con componentes existentes
// Se mantiene temporalmente, pero se recomienda usar Inversion de mock/inversiones.ts
export interface Investment {
  id: string;
  name: string;
  type: string;
  capital: number;
  result: number;
  roiNominal: number;
  roiReal: number;
  status?: 'active' | 'closed'; // Para compatibilidad con filtros
}

export interface EmmaFund {
  currentCapital: number;
  progress: number;
  monthlyContribution: number;
  projection18: number;
  projection25: number;
}

// Mock data
export const mockProjections: ProjectionData = {
  scenario: 'base',
  horizon: 10,
  nominal: 12500000,
  real: 9850000,
};

// Mock base: inversiones + liquidez (sin activos)
// Los activos se suman dinámicamente en los componentes
export const mockPatrimonialState: PatrimonialState = {
  total: 8500000, // Base: inversiones + liquidez (los activos se suman dinámicamente)
  monthlyResult: 125000,
  annualResult: 1450000,
  liquidity: 450000,
};

export const mockDistribution: Distribution = {
  productive: 6200000,
  passive: 850000,
  liquidity: 450000,
  longTerm: 1000000,
};

export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Fondo Renta Variable',
    type: 'Fondo',
    capital: 2500000,
    result: 450000,
    roiNominal: 18.0,
    roiReal: 12.5,
  },
  {
    id: '2',
    name: 'Bonos Gobierno',
    type: 'Bonos',
    capital: 1800000,
    result: 180000,
    roiNominal: 10.0,
    roiReal: 4.5,
  },
  {
    id: '3',
    name: 'Acciones Tech',
    type: 'Acciones',
    capital: 1200000,
    result: 240000,
    roiNominal: 20.0,
    roiReal: 14.5,
  },
  {
    id: '4',
    name: 'Inmueble Comercial',
    type: 'Inmueble',
    capital: 700000,
    result: 70000,
    roiNominal: 10.0,
    roiReal: 4.5,
  },
];

export const mockEmmaFund: EmmaFund = {
  currentCapital: 3200000,
  progress: 64.0,
  monthlyContribution: 150000,
  projection18: 8500000,
  projection25: 12000000,
};

export interface Alert {
  id: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

// Mock alerts (pueden estar vacías)
export const mockAlerts: Alert[] = [
  {
    id: '1',
    message: 'Falta registrar un movimiento del mes pasado',
    action: {
      label: 'Registrar',
      href: '/flows',
    },
  },
  {
    id: '2',
    message: 'El aporte mensual a Emma no se ha realizado este mes',
  },
];

// Formatear números como moneda
// DEPRECATED: Usar formatCurrencyUSD o formatCurrencyDual de exchange-rates.ts
// Mantenido para compatibilidad temporal
export function formatCurrency(value: number): string {
  // Por defecto, asumir que el valor viene en ARS y convertir a USD
  const { convertArsToUsdCurrent, formatCurrencyUSD, formatCurrencyDual, convertUsdToArsCurrent } = require('./exchange-rates');
  const usdValue = convertArsToUsdCurrent(value);
  const arsValue = value;
  return formatCurrencyDual(usdValue, arsValue);
}

// Datos mock eliminados - usar API real
export const mockConcepts: Concept[] = [];
export const mockMonthlyMovements: MonthlyMovement[] = [];
export const mockMonthlySummary: MonthlySummary = {
  month: '',
  totalIncome: 0,
  totalExpenses: 0,
  netResult: 0,
  averageMonthly: 0,
  minimumExpense: 0,
  variation: 0,
};

// Formatear porcentajes
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Tipos de flujo
export type FlowType = 'ingreso' | 'gasto' | 'aporte' | 'retiro';

export interface Flow {
  id: string;
  date: string;
  type: FlowType;
  description: string;
  amount: number;
  investmentId?: string;
  investmentName?: string;
}

// Mock data para flujos
export const mockFlows: Flow[] = [
  // Ingresos
  { id: '1', date: '15/03', type: 'ingreso', description: 'Salario', amount: 500000 },
  { id: '2', date: '20/03', type: 'ingreso', description: 'Dividendo Fondo Renta Variable', amount: 75000, investmentId: '1', investmentName: 'Fondo Renta Variable' },
  { id: '3', date: '25/03', type: 'ingreso', description: 'Alquiler', amount: 150000 },
  { id: '4', date: '15/04', type: 'ingreso', description: 'Salario', amount: 500000 },
  { id: '5', date: '20/04', type: 'ingreso', description: 'Interés Bonos Gobierno', amount: 15000, investmentId: '2', investmentName: 'Bonos Gobierno' },
  
  // Gastos
  { id: '6', date: '05/03', type: 'gasto', description: 'Supermercado', amount: 80000 },
  { id: '7', date: '10/03', type: 'gasto', description: 'Servicios', amount: 25000 },
  { id: '8', date: '15/03', type: 'gasto', description: 'Gastos recurrentes', amount: 50000 },
  { id: '9', date: '05/04', type: 'gasto', description: 'Supermercado', amount: 85000 },
  { id: '10', date: '10/04', type: 'gasto', description: 'Servicios', amount: 25000 },
  
  // Aportes
  { id: '11', date: '15/03', type: 'aporte', description: 'Aporte inicial', amount: 500000, investmentId: '1', investmentName: 'Fondo Renta Variable' },
  { id: '12', date: '15/04', type: 'aporte', description: 'Aporte mensual', amount: 325000, investmentId: '1', investmentName: 'Fondo Renta Variable' },
  { id: '13', date: '20/04', type: 'aporte', description: 'Aporte adicional', amount: 200000, investmentId: '3', investmentName: 'Acciones Tech' },
  
  // Retiros
  { id: '14', date: '25/03', type: 'retiro', description: 'Retiro parcial', amount: 100000, investmentId: '2', investmentName: 'Bonos Gobierno' },
];

// Calcular totales por tipo
export function getFlowTotals(flows: Flow[]) {
  return {
    ingresos: flows.filter(f => f.type === 'ingreso').reduce((sum, f) => sum + f.amount, 0),
    gastos: flows.filter(f => f.type === 'gasto').reduce((sum, f) => sum + f.amount, 0),
    aportes: flows.filter(f => f.type === 'aporte').reduce((sum, f) => sum + f.amount, 0),
    retiros: flows.filter(f => f.type === 'retiro').reduce((sum, f) => sum + f.amount, 0),
  };
}

// Datos mock para proyecciones
export interface ScenarioProjection {
  scenario: Scenario;
  horizon: Horizon;
  nominal: number;
  real: number;
}

export interface TemporalEvolution {
  year: number;
  nominal: number;
  real: number;
  variation: number;
}

// Mock: proyecciones por escenario y horizonte
export const mockScenarioProjections: Record<Scenario, Record<Horizon, ScenarioProjection>> = {
  conservador: {
    5: { scenario: 'conservador', horizon: 5, nominal: 10500000, real: 8900000 },
    10: { scenario: 'conservador', horizon: 10, nominal: 12500000, real: 9500000 },
    20: { scenario: 'conservador', horizon: 20, nominal: 16500000, real: 11000000 },
  },
  base: {
    5: { scenario: 'base', horizon: 5, nominal: 11500000, real: 9800000 },
    10: { scenario: 'base', horizon: 10, nominal: 14500000, real: 11200000 },
    20: { scenario: 'base', horizon: 20, nominal: 21000000, real: 14500000 },
  },
  optimista: {
    5: { scenario: 'optimista', horizon: 5, nominal: 13000000, real: 11000000 },
    10: { scenario: 'optimista', horizon: 10, nominal: 17000000, real: 13500000 },
    20: { scenario: 'optimista', horizon: 20, nominal: 28000000, real: 20000000 },
  },
};

// Mock: evolución temporal (año a año)
export function getTemporalEvolution(scenario: Scenario, horizon: Horizon): TemporalEvolution[] {
  const baseCapital = mockPatrimonialState.total;
  const evolution: TemporalEvolution[] = [{ year: 0, nominal: baseCapital, real: baseCapital, variation: 0 }];
  
  // Mock: crecimiento progresivo
  for (let year = 1; year <= horizon; year++) {
    const growthRate = scenario === 'conservador' ? 0.05 : scenario === 'optimista' ? 0.12 : 0.08;
    const inflationRate = 0.25; // Mock: 25% anual
    
    const prevNominal = evolution[year - 1].nominal;
    const nominal = Math.round(prevNominal * (1 + growthRate));
    const real = Math.round(nominal / Math.pow(1 + inflationRate, year));
    const variation = ((nominal - prevNominal) / prevNominal) * 100;
    
    evolution.push({ year, nominal, real, variation });
  }
  
  return evolution;
}

// Datos mock para Fondo Emma
export interface EmmaMilestone {
  years: number;
  capital: number; // Capital proyectado en USD
  progress: number; // % del objetivo
}

// Mock: proyecciones del Fondo Emma por hitos (solo capital proyectado)
export const mockEmmaMilestones: EmmaMilestone[] = [
  { years: 18, capital: 8500000, progress: 70.8 },
  { years: 25, capital: 12000000, progress: 100.0 },
  { years: 30, capital: 16500000, progress: 137.5 },
];

// Mock: estado actual del Fondo Emma
export interface EmmaCurrentState {
  currentCapital: number;
  initialContribution: number;
  monthlyContribution: number;
  elapsedYears: number;
  elapsedMonths: number;
}

export const mockEmmaCurrentState: EmmaCurrentState = {
  currentCapital: mockEmmaFund.currentCapital,
  initialContribution: 1000000, // Mock
  monthlyContribution: mockEmmaFund.monthlyContribution,
  elapsedYears: 2,
  elapsedMonths: 3,
};

// Mock: evolución temporal del Fondo Emma (año a año hasta 30 años)
export function getEmmaTemporalEvolution(): TemporalEvolution[] {
  const evolution: TemporalEvolution[] = [
    { year: 0, nominal: mockEmmaCurrentState.initialContribution, real: mockEmmaCurrentState.initialContribution, variation: 0 }
  ];
  
  const monthlyContribution = mockEmmaCurrentState.monthlyContribution;
  const annualContribution = monthlyContribution * 12;
  const interestRate = 0.10; // Mock: 10% anual
  const inflationRate = 0.25; // Mock: 25% anual
  
  for (let year = 1; year <= 30; year++) {
    const prevNominal = evolution[year - 1].nominal;
    // Interés compuesto + aporte anual
    const nominal = Math.round(prevNominal * (1 + interestRate) + annualContribution);
    const real = Math.round(nominal / Math.pow(1 + inflationRate, year));
    const variation = ((nominal - prevNominal) / prevNominal) * 100;
    
    evolution.push({ year, nominal, real, variation });
  }
  
  return evolution;
}

// Datos mock para Bitácora
export type DecisionType = 'inversion' | 'desinversion' | 'aumento-aporte' | 'pausa' | 'rebalanceo' | 'otra';

export interface Decision {
  id: string;
  date: string;
  type: DecisionType;
  investmentId?: string;
  investmentName?: string;
  expectedImpact: string;
  reason: string;
  context: string;
  alternatives: string[];
  expectedResult: string;
}

// Mock: decisiones de bitácora
export const mockDecisions: Decision[] = [
  {
    id: '1',
    date: '15/03/2022',
    type: 'inversion',
    investmentId: '1',
    investmentName: 'Fondo Renta Variable',
    expectedImpact: 'Aumento de exposición a renta variable',
    reason: 'Diversificación del portfolio y exposición a renta variable para crecimiento a mediano plazo',
    context: 'El portfolio estaba concentrado en activos de bajo riesgo. Se decidió diversificar con exposición a renta variable para mejorar el potencial de crecimiento.',
    alternatives: [
      'Mantener solo activos de bajo riesgo',
      'Invertir en bonos gubernamentales',
      'Esperar mejores condiciones de mercado'
    ],
    expectedResult: 'Crecimiento del capital a mediano plazo con exposición controlada al riesgo de mercado'
  },
  {
    id: '2',
    date: '20/06/2022',
    type: 'aumento-aporte',
    investmentId: '1',
    investmentName: 'Fondo Renta Variable',
    expectedImpact: 'Mayor exposición y potencial de crecimiento',
    reason: 'Rendimiento positivo y confianza en la estrategia del fondo',
    context: 'El fondo había mostrado rendimiento positivo en los primeros meses. Se decidió aumentar el capital invertido para aprovechar la tendencia.',
    alternatives: [
      'Mantener el capital actual',
      'Reducir la exposición',
      'Reinvertir en otra inversión'
    ],
    expectedResult: 'Mayor exposición y potencial de crecimiento del capital invertido'
  },
  {
    id: '3',
    date: '10/09/2022',
    type: 'inversion',
    investmentId: '2',
    investmentName: 'Bonos Gobierno',
    expectedImpact: 'Estabilidad y flujo de ingresos periódicos',
    reason: 'Búsqueda de estabilidad y flujo de ingresos periódicos para balancear el portfolio',
    context: 'Después de aumentar la exposición a renta variable, se decidió agregar activos de menor riesgo para balancear el portfolio.',
    alternatives: [
      'Mantener solo renta variable',
      'Invertir en otro fondo de renta variable',
      'Aumentar liquidez'
    ],
    expectedResult: 'Estabilidad del portfolio y flujo de ingresos periódicos por intereses'
  },
  {
    id: '4',
    date: '15/12/2022',
    type: 'rebalanceo',
    investmentId: undefined,
    investmentName: undefined,
    expectedImpact: 'Ajuste de distribución del patrimonio',
    reason: 'Reequilibrar la distribución del patrimonio según objetivos de largo plazo',
    context: 'El crecimiento desigual de las inversiones había desbalanceado la distribución original. Se decidió rebalancear para mantener la estrategia.',
    alternatives: [
      'Mantener la distribución actual',
      'Vender posiciones ganadoras',
      'Esperar a que se rebalancee naturalmente'
    ],
    expectedResult: 'Distribución del patrimonio alineada con objetivos de largo plazo'
  },
  {
    id: '5',
    date: '20/03/2023',
    type: 'inversion',
    investmentId: '3',
    investmentName: 'Acciones Tech',
    expectedImpact: 'Exposición a sector tecnológico con alto potencial de crecimiento',
    reason: 'Exposición a sector tecnológico con alto potencial de crecimiento a largo plazo',
    context: 'Se identificó una oportunidad en el sector tecnológico. Se decidió abrir una posición pequeña para exposición controlada.',
    alternatives: [
      'No invertir en el sector',
      'Esperar mejores condiciones',
      'Invertir a través de un fondo sectorial'
    ],
    expectedResult: 'Exposición controlada al sector tecnológico con potencial de crecimiento superior'
  }
];

// Función para obtener el label del tipo de decisión
export function getDecisionTypeLabel(type: DecisionType): string {
  const labels: Record<DecisionType, string> = {
    'inversion': 'INVERSIÓN',
    'desinversion': 'DESINVERSIÓN',
    'aumento-aporte': 'AUMENTO DE APORTE',
    'pausa': 'PAUSA',
    'rebalanceo': 'REBALANCEO',
    'otra': 'OTRA DECISIÓN'
  };
  return labels[type];
}

// Datos mock para Settings
export interface IPCData {
  year: number;
  months: number[]; // 12 valores, uno por mes
}

export interface ProjectionAssumptions {
  conservador: number; // % anual
  base: number; // % anual
  optimista: number; // % anual
}

export interface TimeHorizons {
  '5': boolean;
  '10': boolean;
  '20': boolean;
}

export type Currency = 'ARS' | 'USD' | 'EUR';

// Mock: datos de IPC (últimos 3 años)
export const mockIPCData: IPCData[] = [
  {
    year: 2024,
    months: [20.6, 13.2, 11.0, 8.8, 4.2, 4.6, 4.2, 3.2, 2.8, 2.5, 2.0, 1.8]
  },
  {
    year: 2023,
    months: [6.0, 6.6, 7.7, 8.4, 7.8, 6.0, 6.3, 12.4, 12.7, 8.3, 12.8, 25.5]
  },
  {
    year: 2022,
    months: [3.9, 4.7, 6.7, 6.0, 5.1, 5.3, 7.4, 7.0, 6.2, 6.3, 4.9, 5.1]
  }
];

// Mock: supuestos de proyección
export const mockProjectionAssumptions: ProjectionAssumptions = {
  conservador: 5.0,
  base: 8.0,
  optimista: 12.0
};

// Mock: horizontes temporales
export const mockTimeHorizons: TimeHorizons = {
  '5': true,
  '10': true,
  '20': true
};

// Mock: moneda base
export const mockBaseCurrency: Currency = 'ARS';

