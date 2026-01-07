'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import SlideTransition from '../animations/SlideTransition';
import FadeIn from '../animations/FadeIn';
import { formatPercentAR, formatCurrencyAR } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface MonthClosingViewProps {
  mes: string;
  eventos: EventoMensual[];
  promedioMensual: number;
  onConfirmClose: () => void;
  onCancel: () => void;
}

export default function MonthClosingView({
  mes,
  eventos,
  promedioMensual,
  onConfirmClose,
  onCancel,
}: MonthClosingViewProps) {
  const formatMonth = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  };

      // Calcular resumen (todo en USD)
      // Separar ingresos y egresos
      const egresos = eventos.filter((e) => e.tipo === 'egreso');
      const ingresos = eventos.filter((e) => e.tipo === 'ingreso');
      const totalEgresos = egresos.reduce((sum, e) => sum + e.montoUsd, 0);
      const totalIngresos = ingresos.reduce((sum, e) => sum + e.montoUsd, 0);
      const resultadoMes = totalIngresos - totalEgresos;
      
      const eventosPagados = egresos.filter((e) => e.estado === 'pagado');
      const eventosPendientes = egresos.filter((e) => e.estado === 'pendiente');
      const totalPagado = eventosPagados.reduce((sum, e) => sum + e.montoUsd, 0);
      const totalPendiente = eventosPendientes.reduce((sum, e) => sum + e.montoUsd, 0);

      // Comparar vs promedio (en USD)
      const variacion = promedioMensual > 0 ? ((totalEgresos - promedioMensual) / promedioMensual) * 100 : 0;

      // Agrupar por categoría (solo egresos, todo en USD)
      const eventosPorCategoria = {
        fijo: egresos.filter((e) => e.categoria === 'fijo'),
        variable: egresos.filter((e) => e.categoria === 'variable'),
        extraordinario: egresos.filter((e) => e.categoria === 'extraordinario'),
      };

      const totalPorCategoria = {
        fijo: eventosPorCategoria.fijo.reduce((sum, e) => sum + e.montoUsd, 0),
        variable: eventosPorCategoria.variable.reduce((sum, e) => sum + e.montoUsd, 0),
        extraordinario: eventosPorCategoria.extraordinario.reduce((sum, e) => sum + e.montoUsd, 0),
      };

  const porcentajePorCategoria = {
    fijo: totalEgresos > 0 ? (totalPorCategoria.fijo / totalEgresos) * 100 : 0,
    variable: totalEgresos > 0 ? (totalPorCategoria.variable / totalEgresos) * 100 : 0,
    extraordinario: totalEgresos > 0 ? (totalPorCategoria.extraordinario / totalEgresos) * 100 : 0,
  };

  // Alertas suaves
  const hasPendientes = eventosPendientes.length > 0;
  const isAboveAverage = variacion > 10;
  const isBelowAverage = variacion < -10;

  return (
    <SlideTransition isVisible={true} direction="up" duration={400}>
      <div className="space-y-8">
        <FadeIn delay={0} duration={400}>
          {/* Resumen del Mes a Cerrar */}
          <Card padding="large">
            <div className="mb-8">
              <h2 className="text-heading-2 text-text-primary mb-2">
                Resumen de {formatMonth(mes)}
              </h2>
              <p className="text-body text-text-secondary">
                Revisa el resumen antes de cerrar el mes
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Resultado del Mes */}
              <div className="flex flex-col">
                <div className="text-caption text-text-secondary uppercase tracking-wider mb-4">
                  RESULTADO DEL MES
                </div>
                <CurrencyDisplay value={resultadoMes} size="display" showSecondary={false} />
              </div>

              {/* Total Ingresos */}
              <div className="flex flex-col">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
                  INGRESOS
                </div>
                <CurrencyDisplay value={totalIngresos} size="medium" showSecondary={false} />
              </div>

              {/* Total Egresos */}
              <div className="flex flex-col">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
                  EGRESOS
                </div>
                <CurrencyDisplay value={totalEgresos} size="medium" showSecondary={false} />
                <div className="text-body-small text-text-secondary mt-2">
                  vs Promedio: {variacion >= 0 ? '+' : ''}{formatPercentAR(variacion, 1)}
                </div>
              </div>
            </div>

            {/* Desglose por Categoría */}
            <div className="pt-6 border-t" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-4">
                DESGLOSE POR CATEGORÍA
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-body text-text-secondary mb-2">Fijos</div>
                  <CurrencyDisplay value={totalPorCategoria.fijo} size="medium" showSecondary={false} />
                  <div className="text-body-small text-text-secondary mt-1">
                    {formatPercentAR(porcentajePorCategoria.fijo, 1)} del total
                  </div>
                </div>
                <div>
                  <div className="text-body text-text-secondary mb-2">Variables</div>
                  <CurrencyDisplay value={totalPorCategoria.variable} size="medium" showSecondary={false} />
                  <div className="text-body-small text-text-secondary mt-1">
                    {formatPercentAR(porcentajePorCategoria.variable, 1)} del total
                  </div>
                </div>
                <div>
                  <div className="text-body text-text-secondary mb-2">Extraordinarios</div>
                  <CurrencyDisplay value={totalPorCategoria.extraordinario} size="medium" showSecondary={false} />
                  <div className="text-body-small text-text-secondary mt-1">
                    {formatPercentAR(porcentajePorCategoria.extraordinario, 1)} del total
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Pagos */}
            {hasPendientes && (
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
                <div className="p-4 rounded-lg" style={{
                  backgroundColor: 'rgba(31, 42, 51, 0.1)',
                  border: '1px solid rgba(142, 142, 138, 0.2)',
                }}>
                  <div className="text-body-large font-medium mb-1" style={{ color: '#F5F2EC' }}>
                    Atención: Hay eventos pendientes
                  </div>
                      <div className="text-body text-text-secondary">
                        {eventosPendientes.length} eventos por un total de {formatCurrencyAR(totalPendiente, 2)} aún no están marcados como pagados.
                      </div>
                </div>
              </div>
            )}

            {/* Alertas de Variación */}
            {isAboveAverage && (
              <div className="mt-4 p-4 rounded-lg" style={{
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
                border: '1px solid rgba(142, 142, 138, 0.2)',
              }}>
                <div className="text-body text-text-secondary">
                  Este mes está {formatPercentAR(variacion, 1)} por encima del promedio mensual.
                </div>
              </div>
            )}

            {isBelowAverage && (
              <div className="mt-4 p-4 rounded-lg" style={{
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
                border: '1px solid rgba(142, 142, 138, 0.2)',
              }}>
                <div className="text-body text-text-secondary">
                  Este mes está {formatPercentAR(Math.abs(variacion), 1)} por debajo del promedio mensual.
                </div>
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Confirmación de Cierre */}
        <FadeIn delay={150} duration={400}>
          <Card padding="large">
            <div className="text-center">
              <h3 className="text-heading-2 text-text-primary mb-4">
                ¿Cerrar este mes?
              </h3>
              <p className="text-body text-text-secondary mb-8">
                Una vez cerrado, el mes quedará congelado. Solo podrás hacer correcciones como eventos nuevos.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={onCancel}
                  className="px-8 py-3 text-body-large transition-colors duration-fast"
                  style={{ color: '#8E8E8A' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirmClose}
                  className="px-8 py-3 text-body-large font-medium rounded-button transition-colors duration-fast"
                  style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0885A'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B59A6A'}
                >
                  Sí, cerrar este mes
                </button>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </SlideTransition>
  );
}
