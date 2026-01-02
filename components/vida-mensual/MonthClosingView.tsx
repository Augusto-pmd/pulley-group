'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import SlideTransition from '../animations/SlideTransition';
import FadeIn from '../animations/FadeIn';
import { formatPercentage } from '@/utils/number-format';
import { formatCurrency } from '@/utils/number-format';
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
              <h2 className="text-heading-2 text-gray-text-primary mb-2">
                Resumen de {formatMonth(mes)}
              </h2>
              <p className="text-body text-gray-text-tertiary">
                Revisa el resumen antes de cerrar el mes
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Resultado del Mes */}
              <div className="flex flex-col">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
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
                <div className="text-body-small text-gray-text-tertiary mt-2">
                  vs Promedio: {variacion >= 0 ? '+' : ''}{formatPercentage(variacion)}
                </div>
              </div>
            </div>

            {/* Desglose por Categoría */}
            <div className="pt-6 border-t border-gray-divider">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
                DESGLOSE POR CATEGORÍA
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-body text-gray-text-tertiary mb-2">Fijos</div>
                  <CurrencyDisplay value={totalPorCategoria.fijo} size="medium" showSecondary={false} />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    {formatPercentage(porcentajePorCategoria.fijo)} del total
                  </div>
                </div>
                <div>
                  <div className="text-body text-gray-text-tertiary mb-2">Variables</div>
                  <CurrencyDisplay value={totalPorCategoria.variable} size="medium" showSecondary={false} />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    {formatPercentage(porcentajePorCategoria.variable)} del total
                  </div>
                </div>
                <div>
                  <div className="text-body text-gray-text-tertiary mb-2">Extraordinarios</div>
                  <CurrencyDisplay value={totalPorCategoria.extraordinario} size="medium" showSecondary={false} />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    {formatPercentage(porcentajePorCategoria.extraordinario)} del total
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Pagos */}
            {hasPendientes && (
              <div className="mt-6 pt-6 border-t border-gray-divider">
                <div className="p-4 bg-orange-50/30 rounded-lg border border-orange-200/20">
                  <div className="text-body-large text-orange-warning font-medium mb-1">
                    Atención: Hay eventos pendientes
                  </div>
                      <div className="text-body text-gray-text-tertiary">
                        {eventosPendientes.length} eventos por un total de {formatCurrency(totalPendiente)} aún no están marcados como pagados.
                      </div>
                </div>
              </div>
            )}

            {/* Alertas de Variación */}
            {isAboveAverage && (
              <div className="mt-4 p-4 bg-blue-50/30 rounded-lg border border-blue-200/20">
                <div className="text-body text-gray-text-tertiary">
                  Este mes está {formatPercentage(variacion)} por encima del promedio mensual.
                </div>
              </div>
            )}

            {isBelowAverage && (
              <div className="mt-4 p-4 bg-green-50/30 rounded-lg border border-green-200/20">
                <div className="text-body text-gray-text-tertiary">
                  Este mes está {formatPercentage(Math.abs(variacion))} por debajo del promedio mensual.
                </div>
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Confirmación de Cierre */}
        <FadeIn delay={150} duration={400}>
          <Card padding="large">
            <div className="text-center">
              <h3 className="text-heading-2 text-gray-text-primary mb-4">
                ¿Cerrar este mes?
              </h3>
              <p className="text-body text-gray-text-tertiary mb-8">
                Una vez cerrado, el mes quedará congelado. Solo podrás hacer correcciones como eventos nuevos.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={onCancel}
                  className="px-8 py-3 text-body-large text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirmClose}
                  className="px-8 py-3 bg-green-success text-white text-body-large font-medium rounded-button hover:opacity-90 transition-opacity duration-fast"
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
