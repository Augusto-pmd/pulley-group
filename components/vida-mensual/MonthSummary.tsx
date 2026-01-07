'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentAR } from '@/utils/number-format';
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
    <div className="relative">
      {/* CENTRO ABSOLUTO: Resultado del mes como núcleo del anillo */}
      <div className="flex flex-col items-center justify-center">
        {/* Núcleo: Resultado del mes */}
        <div className="mb-8">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
            RESULTADO DEL MES
          </div>
          <div className="text-center">
            <CurrencyDisplay value={resultadoMes} size="display" showSecondary={false} />
          </div>
        </div>

        {/* Primera órbita: Ingresos y Egresos - Simétricos alrededor del centro */}
        <div className="flex items-center justify-center gap-20" style={{ opacity: 0.6 }}>
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              INGRESOS
            </div>
            <CurrencyDisplay value={totalIngresos} size="regular" showSecondary={false} />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
              EGRESOS
            </div>
            <CurrencyDisplay value={totalEgresos} size="regular" showSecondary={false} />
          </div>
        </div>

        {/* Segunda órbita: Distribución por tipo - Periferia más lejana */}
        <div className="mt-12 w-full max-w-md" style={{ opacity: 0.5 }}>
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
            POR TIPO
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-small text-text-secondary">Fijos</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.fijo} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentAR(porcentajesPorTipo.fijo, 1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-text-secondary">Variables</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.variable} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentAR(porcentajesPorTipo.variable, 1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-small text-text-secondary">Extraordinarios</span>
              <div className="flex items-center gap-3">
                <CurrencyDisplay value={porTipo.extraordinario} size="regular" showSecondary={false} />
                <span className="text-body-small text-text-secondary w-12 text-right">
                  {formatPercentAR(porcentajesPorTipo.extraordinario, 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

