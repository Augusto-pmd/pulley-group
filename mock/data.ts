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

// Datos mock eliminados - solo se permiten datos reales verificables
// Si no hay datos reales, usar valores vacíos o cero
export const mockProjections: ProjectionData = {
  scenario: 'base',
  horizon: 10,
  nominal: 0,
  real: 0,
};

export const mockPatrimonialState: PatrimonialState = {
  total: 0,
  monthlyResult: 0,
  annualResult: 0,
  liquidity: 0,
};

export const mockDistribution: Distribution = {
  productive: 0,
  passive: 0,
  liquidity: 0,
  longTerm: 0,
};

export const mockInvestments: Investment[] = [];

export const mockEmmaFund: EmmaFund = {
  currentCapital: 0,
  progress: 0,
  monthlyContribution: 0,
  projection18: 0,
  projection25: 0,
};

export interface Alert {
  id: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

// Alertas reales - solo se muestran si hay datos reales que las generen
export const mockAlerts: Alert[] = [];

// Formatear números como moneda
// DEPRECATED: Usar formatCurrency de @/utils/number-format
// Mantenido para compatibilidad temporal - redirige al helper unificado
export function formatCurrency(value: number): string {
  const { formatCurrency: formatCurrencyUnified } = require('../utils/number-format');
  return formatCurrencyUnified(value, 0);
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

// Flujos reales - solo se muestran si hay datos reales desde la API
export const mockFlows: Flow[] = [];

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

// Proyecciones reales - solo se calculan desde datos reales
export const mockScenarioProjections: Record<Scenario, Record<Horizon, ScenarioProjection>> = {
  conservador: {
    5: { scenario: 'conservador', horizon: 5, nominal: 0, real: 0 },
    10: { scenario: 'conservador', horizon: 10, nominal: 0, real: 0 },
    20: { scenario: 'conservador', horizon: 20, nominal: 0, real: 0 },
  },
  base: {
    5: { scenario: 'base', horizon: 5, nominal: 0, real: 0 },
    10: { scenario: 'base', horizon: 10, nominal: 0, real: 0 },
    20: { scenario: 'base', horizon: 20, nominal: 0, real: 0 },
  },
  optimista: {
    5: { scenario: 'optimista', horizon: 5, nominal: 0, real: 0 },
    10: { scenario: 'optimista', horizon: 10, nominal: 0, real: 0 },
    20: { scenario: 'optimista', horizon: 20, nominal: 0, real: 0 },
  },
};

// Evolución temporal - solo se calcula desde datos reales
// Si no hay patrimonio real, retornar array vacío
export function getTemporalEvolution(scenario: Scenario, horizon: Horizon): TemporalEvolution[] {
  const baseCapital = mockPatrimonialState.total;
  
  // Si no hay capital real, no hay proyección
  if (baseCapital === 0) {
    return [];
  }
  
  // Solo calcular si hay datos reales (esto requiere backend real)
  // Por ahora, retornar vacío hasta que haya backend de proyecciones
  return [];
}

// Datos mock para Fondo Emma
export interface EmmaMilestone {
  years: number;
  capital: number; // Capital proyectado en USD
  progress: number; // % del objetivo
}

// Proyecciones del Fondo Emma - solo desde datos reales
export const mockEmmaMilestones: EmmaMilestone[] = [];

// Estado actual del Fondo Emma - solo desde datos reales
export interface EmmaCurrentState {
  currentCapital: number;
  initialContribution: number;
  monthlyContribution: number;
  elapsedYears: number;
  elapsedMonths: number;
}

export const mockEmmaCurrentState: EmmaCurrentState = {
  currentCapital: 0,
  initialContribution: 0,
  monthlyContribution: 0,
  elapsedYears: 0,
  elapsedMonths: 0,
};

// Evolución temporal del Fondo Emma - solo desde datos reales
// Si no hay datos reales, retornar array vacío
export function getEmmaTemporalEvolution(): TemporalEvolution[] {
  // Solo calcular si hay datos reales (esto requiere backend real)
  // Por ahora, retornar vacío hasta que haya backend de Emma
  return [];
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

// Decisiones de bitácora - solo desde datos reales
export const mockDecisions: Decision[] = [];

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

// Datos de IPC - solo desde datos reales (requiere backend o API externa)
export const mockIPCData: IPCData[] = [];

// Supuestos de proyección - solo desde datos reales configurados
export const mockProjectionAssumptions: ProjectionAssumptions = {
  conservador: 0,
  base: 0,
  optimista: 0
};

// Horizontes temporales - solo desde datos reales configurados
export const mockTimeHorizons: TimeHorizons = {
  '5': false,
  '10': false,
  '20': false
};

// Moneda base - solo desde datos reales configurados
export const mockBaseCurrency: Currency = 'USD';

