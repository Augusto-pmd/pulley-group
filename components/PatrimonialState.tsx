'use client';

import { useMemo } from 'react';
import Card from './Card';
import CurrencyDisplay, { CurrencyDisplaySigned } from './CurrencyDisplay';
import { getPatrimonioNetoActivosUsd } from '@/mock/activos';
import type { PatrimonialState } from '@/mock/data';
import { getCurrentMonth } from '@/mock/month-status';
import { eventosMock, getEventosByMes } from '@/mock/eventos';

interface PatrimonialStateProps {
  data: PatrimonialState;
}

export default function PatrimonialState({ data }: PatrimonialStateProps) {
  // Calcular patrimonio total incluyendo activos (patrimonio neto: valor - pasivos)
  const totalPatrimony = useMemo(() => {
    const patrimonioNetoActivos = getPatrimonioNetoActivosUsd();
    return data.total + patrimonioNetoActivos;
  }, [data.total]);

  // Calcular ingresos y egresos del mes actual
  const currentMonth = getCurrentMonth();
  const eventosMes = useMemo(() => getEventosByMes(currentMonth, eventosMock), [currentMonth]);
  
  const ingresosMes = useMemo(() => {
    return eventosMes
      .filter((e) => e.tipo === 'ingreso')
      .reduce((sum, e) => sum + e.montoUsd, 0);
  }, [eventosMes]);

  const egresosMes = useMemo(() => {
    return eventosMes
      .filter((e) => e.tipo === 'egreso')
      .reduce((sum, e) => sum + e.montoUsd, 0);
  }, [eventosMes]);

  const resultadoMes = ingresosMes - egresosMes;

  return (
    <Card padding="large">
      <div className="grid grid-cols-3 gap-8">
        {/* Patrimonio Total - Principal */}
        <div className="flex flex-col">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
            PATRIMONIO TOTAL
          </div>
          <CurrencyDisplay value={totalPatrimony} size="display" showSecondary={false} />
        </div>

        {/* Ingresos del Mes - Secundario */}
        <div className="flex flex-col">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
            INGRESOS DEL MES
          </div>
          <CurrencyDisplay value={ingresosMes} size="large" showSecondary={false} />
        </div>

        {/* Resultado del Mes - Secundario */}
        <div className="flex flex-col">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
            RESULTADO DEL MES
          </div>
          <CurrencyDisplaySigned value={resultadoMes} size="large" showSecondary={false} />
        </div>
      </div>
    </Card>
  );
}

