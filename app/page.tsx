'use client';

import { useMemo } from 'react';
import PatrimonialState from '@/components/PatrimonialState';
import Distribution from '@/components/Distribution';
import EmmaFund from '@/components/EmmaFund';
import InvestmentsRanking from '@/components/InvestmentsRanking';
import Alerts from '@/components/Alerts';
import DashboardActions from '@/components/DashboardActions';
import { getPatrimonioNetoActivosUsd } from '@/mock/activos';
import {
  mockPatrimonialState,
  mockDistribution,
  mockEmmaFund,
  mockInvestments,
  mockAlerts,
} from '@/mock/data';

export default function Dashboard() {
  // Calcular patrimonio total incluyendo activos (patrimonio neto: valor - pasivos)
  const totalPatrimony = useMemo(() => {
    const patrimonioNetoActivos = getPatrimonioNetoActivosUsd();
    return mockPatrimonialState.total + patrimonioNetoActivos;
  }, []);

  return (
    <>
      {/* CAPA 1: ACCIÓN - Pendientes y acciones principales */}
      <div className="mb-10">
        <DashboardActions />
      </div>

      {/* CAPA 2: CONTEXTO - Estado patrimonial y distribución */}
      <div className="mb-10">
        <PatrimonialState data={mockPatrimonialState} />
      </div>

      {/* Distribución y Emma - Grid 2 columnas */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <Distribution data={mockDistribution} total={totalPatrimony} />
        <EmmaFund data={mockEmmaFund} />
      </div>

      {/* CAPA 3: DETALLE / HISTORIAL - Ranking y alertas */}
      <div className="mb-10">
        <InvestmentsRanking investments={mockInvestments} />
      </div>

      {mockAlerts.length > 0 && (
        <div>
          <Alerts alerts={mockAlerts} />
        </div>
      )}
    </>
  );
}

