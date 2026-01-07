'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface MonthSummaryProps {
  eventos: EventoMensual[];
}

export default function MonthSummary({ eventos }: MonthSummaryProps) {
  // Separar ingresos y egresos
  const ingresos = eventos.filter((e) => e.tipo === 'ingreso');
  const egresos = eventos.filter((e) => e.tipo === 'egreso');
  
  const totalIngresos = ingresos.reduce((sum, e) => sum + e.montoUsd, 0);
  const totalEgresos = egresos.reduce((sum, e) => sum + e.montoUsd, 0);
  const resultadoMes = totalIngresos - totalEgresos;

  // Distribución por concepto (solo egresos para análisis)
  const porConcepto = egresos.reduce((acc, e) => {
    if (!acc[e.conceptoNombre]) {
      acc[e.conceptoNombre] = { montoUsd: 0, count: 0 };
    }
    acc[e.conceptoNombre].montoUsd += e.montoUsd;
    acc[e.conceptoNombre].count += 1;
    return acc;
  }, {} as Record<string, { montoUsd: number; count: number }>);

  const conceptosOrdenados = Object.entries(porConcepto)
    .map(([nombre, data]) => ({ nombre, ...data }))
    .sort((a, b) => b.montoUsd - a.montoUsd)
    .slice(0, 10); // Top 10

  // Distribución por tipo (solo egresos)
  const porTipo = {
    fijo: egresos.filter((e) => e.categoria === 'fijo').reduce((sum, e) => sum + e.montoUsd, 0),
    variable: egresos.filter((e) => e.categoria === 'variable').reduce((sum, e) => sum + e.montoUsd, 0),
    extraordinario: egresos.filter((e) => e.categoria === 'extraordinario').reduce((sum, e) => sum + e.montoUsd, 0),
  };

  const totalEgresosParaPorcentaje = totalEgresos;
  const porcentajesPorTipo = {
    fijo: totalEgresosParaPorcentaje > 0 ? (porTipo.fijo / totalEgresosParaPorcentaje) * 100 : 0,
    variable: totalEgresosParaPorcentaje > 0 ? (porTipo.variable / totalEgresosParaPorcentaje) * 100 : 0,
    extraordinario: totalEgresosParaPorcentaje > 0 ? (porTipo.extraordinario / totalEgresosParaPorcentaje) * 100 : 0,
  };

  return (
    <Card padding="large">
      <div className="flex flex-col items-center text-center py-8">
        {/* Resultado del Mes - Protagonista absoluto */}
        <div className="mb-12">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 opacity-60">
            RESULTADO DEL MES
          </div>
          <CurrencyDisplay value={resultadoMes} size="display" showSecondary={false} />
        </div>

        {/* Ingresos y Egresos - Secundarios discretos */}
        <div className="flex items-center justify-center gap-16 mb-12">
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2 opacity-60">
              INGRESOS
            </div>
            <CurrencyDisplay value={totalIngresos} size="regular" showSecondary={false} />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2 opacity-60">
              EGRESOS
            </div>
            <CurrencyDisplay value={totalEgresos} size="regular" showSecondary={false} />
          </div>
        </div>

        {/* Distribución por Tipo - Secundario discreto */}
        <div className="w-full max-w-md">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 opacity-60">
            POR TIPO
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-body text-text-secondary">Fijos</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.fijo} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentage(porcentajesPorTipo.fijo)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body text-text-secondary">Variables</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.variable} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentage(porcentajesPorTipo.variable)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body text-text-secondary">Extraordinarios</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.extraordinario} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentage(porcentajesPorTipo.extraordinario)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

