'use client';

import { useMemo, useEffect, useState } from 'react';
import PatrimonialState from '@/components/PatrimonialState';
import Distribution from '@/components/Distribution';
import EmmaFund from '@/components/EmmaFund';
import InvestmentsRanking from '@/components/InvestmentsRanking';
import Alerts from '@/components/Alerts';
import DashboardActions from '@/components/DashboardActions';
import { getAssets, getInvestments, getMovements, getMonths, type ApiAsset, type ApiInvestment, type ApiMovement } from '@/lib/api';
import { getCurrentMonth } from '@/mock/month-status';

export default function Dashboard() {
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [investments, setInvestments] = useState<ApiInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [apiAssets, apiInvestments] = await Promise.all([
          getAssets(),
          getInvestments(),
        ]);
        setAssets(Array.isArray(apiAssets) ? apiAssets : []);
        setInvestments(Array.isArray(apiInvestments) ? apiInvestments : []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setAssets([]);
        setInvestments([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calcular patrimonio neto de activos (valor - pasivos)
  const patrimonioNetoActivos = useMemo(() => {
    try {
      if (!Array.isArray(assets) || assets.length === 0) {
        return 0;
      }
      const total = assets.reduce((sum, asset) => {
        const latestValuation = asset.valuations && asset.valuations.length > 0
          ? asset.valuations[0].valueUSD
          : 0;
        const liabilityAmount = asset.liability?.remainingAmountUSD || 0;
        return sum + latestValuation - liabilityAmount;
      }, 0);
      return isNaN(total) ? 0 : total;
    } catch (error) {
      console.error('Error calculating patrimonio neto:', error);
      return 0;
    }
  }, [assets]);

  // Calcular capital total de inversiones
  const capitalInversiones = useMemo(() => {
    try {
      return investments.reduce((sum, inv) => {
        // Calcular capital desde eventos
        const capital = inv.events?.reduce((acc, event) => {
          if (event.type === 'aporte') return acc + event.amountUSD;
          if (event.type === 'retiro') return acc - event.amountUSD;
          return acc;
        }, 0) || 0;
        return sum + capital;
      }, 0);
    } catch (error) {
      console.error('Error calculating capital inversiones:', error);
      return 0;
    }
  }, [investments]);

  // Calcular patrimonio total
  const totalPatrimony = useMemo(() => {
    return patrimonioNetoActivos + capitalInversiones;
  }, [patrimonioNetoActivos, capitalInversiones]);

  // Cargar movimientos para calcular resultados mensuales/anuales
  const [allMovements, setAllMovements] = useState<ApiMovement[]>([]);
  
  useEffect(() => {
    async function loadAllMovements() {
      try {
        const months = await getMonths();
        const movementsPromises = months.map(async (month) => {
          const movements = await getMovements(month.year, month.month);
          return Array.isArray(movements) ? movements : [];
        });
        const allMovs = await Promise.all(movementsPromises);
        setAllMovements(allMovs.flat());
      } catch (error) {
        console.error('Error loading all movements:', error);
        setAllMovements([]);
      }
    }
    loadAllMovements();
  }, []);

  // Calcular resultados mensuales y anuales
  const currentMonth = getCurrentMonth();
  const [currentYear, currentMonthNum] = currentMonth.split('-').map(Number);
  
  const monthlyResult = useMemo(() => {
    return allMovements
      .filter((m) => {
        const [year, month] = m.date.split('T')[0].split('-').map(Number);
        return year === currentYear && month === currentMonthNum;
      })
      .reduce((sum, m) => {
        return sum + (m.type === 'ingreso' ? m.amountUSD : -m.amountUSD);
      }, 0);
  }, [allMovements, currentYear, currentMonthNum]);

  const annualResult = useMemo(() => {
    return allMovements
      .filter((m) => {
        const [year] = m.date.split('T')[0].split('-').map(Number);
        return year === currentYear;
      })
      .reduce((sum, m) => {
        return sum + (m.type === 'ingreso' ? m.amountUSD : -m.amountUSD);
      }, 0);
  }, [allMovements, currentYear]);

  // Datos para PatrimonialState
  const patrimonialStateData = useMemo(() => ({
    total: totalPatrimony,
    monthlyResult,
    annualResult,
    liquidity: 0, // Por ahora 0, se puede calcular desde movimientos pendientes
  }), [totalPatrimony, monthlyResult, annualResult]);

  // Datos para Distribution
  const distributionData = useMemo(() => ({
    productive: capitalInversiones || 0, // Inversiones productivas
    passive: 0, // Por ahora no hay inversiones pasivas separadas
    liquidity: 0, // Liquidez (por ahora 0, se puede calcular desde movimientos)
    longTerm: 0, // Fondo Emma (por ahora 0)
  }), [capitalInversiones]);

  // Datos para EmmaFund (cero por ahora)
  const emmaFundData = useMemo(() => ({
    currentCapital: 0,
    progress: 0,
    projection18: 0,
    projection25: 0,
    monthlyContribution: 0,
  }), []);

  // Transformar inversiones para InvestmentsRanking
  const investmentsForRanking = useMemo(() => {
    try {
      return investments.map((inv) => {
        const events = inv.events || [];
        let capital = 0;
        let result = 0;

        events.forEach((event) => {
          if (event.type === 'aporte') {
            capital += event.amountUSD;
            result += event.amountUSD;
          } else if (event.type === 'retiro') {
            capital -= event.amountUSD;
            result -= event.amountUSD;
          } else if (event.type === 'ajuste') {
            result += event.amountUSD;
          }
        });

        const roiNominal = capital > 0 ? (result / capital) * 100 : 0;
        const roiReal = roiNominal * 0.7; // Simplificado

        return {
          id: inv.id,
          name: inv.name || 'Sin nombre',
          type: inv.type === 'financiera' ? 'Financiera' : 'Inmobiliaria',
          capital,
          result,
          roiNominal,
          roiReal,
          status: 'active' as const,
        };
      });
    } catch (error) {
      console.error('Error transforming investments:', error);
      return [];
    }
  }, [investments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-gray-text-tertiary">Cargando dashboard...</div>
      </div>
    );
  }

  try {
    return (
      <>
        {/* CAPA 1: ACCIÓN - Pendientes y acciones principales */}
        <div className="mb-10">
          <DashboardActions />
        </div>

        {/* CAPA 2: CONTEXTO - Estado patrimonial y distribución */}
        <div className="mb-10">
          <PatrimonialState data={patrimonialStateData} />
        </div>

        {/* Distribución y Emma - Grid 2 columnas */}
        <div className="grid grid-cols-2 gap-5 mb-10">
          <Distribution 
            data={distributionData} 
            total={totalPatrimony || 0} 
            activosNetos={patrimonioNetoActivos || 0} 
          />
          <EmmaFund data={emmaFundData} />
        </div>

        {/* CAPA 3: DETALLE / HISTORIAL - Ranking y alertas */}
        <div className="mb-10">
          <InvestmentsRanking investments={investmentsForRanking} />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error rendering Dashboard:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-red-600">
          Error al cargar el dashboard. Por favor, recarga la página.
        </div>
      </div>
    );
  }
}

