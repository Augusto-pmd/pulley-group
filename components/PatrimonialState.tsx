'use client';

import { useMemo, useEffect, useState } from 'react';
import Card from './Card';
import CurrencyDisplay, { CurrencyDisplaySigned } from './CurrencyDisplay';
import type { PatrimonialState } from '@/mock/data';
import { getCurrentMonth } from '@/mock/month-status';
import { getMovements, type ApiMovement } from '@/lib/api';

interface PatrimonialStateProps {
  data: PatrimonialState;
}

export default function PatrimonialState({ data }: PatrimonialStateProps) {
  const [movements, setMovements] = useState<ApiMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar movimientos del mes actual
  useEffect(() => {
    async function loadMovements() {
      try {
        setLoading(true);
        const currentMonth = getCurrentMonth();
        const [year, month] = currentMonth.split('-').map(Number);
        const apiMovements = await getMovements(year, month);
        setMovements(Array.isArray(apiMovements) ? apiMovements : []);
      } catch (error) {
        console.error('Error loading movements:', error);
        setMovements([]);
      } finally {
        setLoading(false);
      }
    }
    loadMovements();
  }, []);

  // Calcular patrimonio total (ya viene calculado desde el Dashboard)
  const totalPatrimony = useMemo(() => {
    return data.total;
  }, [data.total]);

  // Calcular ingresos y egresos del mes actual desde datos reales
  const ingresosMes = useMemo(() => {
    try {
      return (movements || [])
        .filter((m) => m && m.type === 'ingreso')
        .reduce((sum, m) => sum + (m.amountUSD || 0), 0);
    } catch (error) {
      console.error('Error calculating ingresos:', error);
      return 0;
    }
  }, [movements]);

  const egresosMes = useMemo(() => {
    try {
      return (movements || [])
        .filter((m) => m && m.type === 'egreso')
        .reduce((sum, m) => sum + (m.amountUSD || 0), 0);
    } catch (error) {
      console.error('Error calculating egresos:', error);
      return 0;
    }
  }, [movements]);

  const resultadoMes = ingresosMes - egresosMes;

  return (
    <Card padding="large">
      <div className="flex flex-col items-center text-center py-8">
        {/* Patrimonio Total - Protagonista absoluto - Plano focal */}
        <div className="mb-12">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4" style={{ opacity: 0.5 }}>
            PATRIMONIO TOTAL
          </div>
          <CurrencyDisplay value={totalPatrimony} size="display" showSecondary={false} />
        </div>

        {/* Ingresos y Resultado - Secundarios discretos - Plano secundario */}
        <div className="flex items-center justify-center gap-16" style={{ opacity: 0.7 }}>
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              INGRESOS DEL MES
            </div>
            <CurrencyDisplay value={ingresosMes} size="regular" showSecondary={false} />
          </div>

          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              RESULTADO DEL MES
            </div>
            <CurrencyDisplaySigned value={resultadoMes} size="regular" showSecondary={false} />
          </div>
        </div>
      </div>
    </Card>
  );
}

