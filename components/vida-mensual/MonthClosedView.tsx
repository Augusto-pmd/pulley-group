'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import ExpenseEventList from './ExpenseEventList';
import { formatCurrency, formatPercentage } from '@/mock/data';
import type { EventoMensual } from '@/mock/eventos';

interface MonthClosedViewProps {
  mes: string;
  eventos: EventoMensual[];
  promedioMensual: number;
  onAddCorrection: () => void;
}

export default function MonthClosedView({
  mes,
  eventos,
  promedioMensual,
  onAddCorrection,
}: MonthClosedViewProps) {
  const formatMonth = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Separar ingresos y egresos
  const egresos = eventos.filter((e) => e.tipo === 'egreso');
  const ingresos = eventos.filter((e) => e.tipo === 'ingreso');
  
  // Calcular resumen (todo en USD)
  const totalEgresos = egresos.reduce((sum, e) => sum + e.montoUsd, 0);
  const totalIngresos = ingresos.reduce((sum, e) => sum + e.montoUsd, 0);
  const resultadoMes = totalIngresos - totalEgresos;
  const variacion = promedioMensual > 0 ? ((totalEgresos - promedioMensual) / promedioMensual) * 100 : 0;

  // Agrupar por categoría (solo egresos)
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

  return (
    <div className="space-y-8">
      {/* Análisis Completo del Mes Cerrado */}
      <Card padding="large">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-heading-2 text-gray-text-primary mb-2">
                {formatMonth(mes)} — Cerrado
              </h2>
              <p className="text-body text-gray-text-tertiary">
                Este mes está cerrado. Puedes agregar correcciones como eventos nuevos.
              </p>
            </div>
            <button
              onClick={onAddCorrection}
              className="px-6 py-2 text-body text-blue-600 hover:text-blue-700 transition-colors duration-fast"
            >
              + Agregar corrección
            </button>
          </div>
        </div>

        {/* Resumen Principal */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col">
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
              RESULTADO DEL MES
            </div>
            <CurrencyDisplay value={resultadoMes} size="display" showSecondary={false} />
          </div>

          <div className="flex flex-col">
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
              INGRESOS
            </div>
            <CurrencyDisplay value={totalIngresos} size="medium" showSecondary={false} />
          </div>

          <div className="flex flex-col">
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
              EGRESOS
            </div>
            <CurrencyDisplay value={totalEgresos} size="medium" showSecondary={false} />
            <div className="text-body-small text-gray-text-tertiary mt-2">
              vs Promedio: {variacion >= 0 ? '+' : ''}{formatPercentage(variacion)}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
              EVENTOS
            </div>
            <div className="text-number-large number-glass">
              {eventos.length}
            </div>
            <div className="text-body-small text-gray-text-tertiary mt-2">
              eventos registrados
            </div>
          </div>
        </div>

        {/* Desglose por Categoría */}
        <div className="pt-6 border-t border-gray-divider">
          <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-4">
            ANÁLISIS POR CATEGORÍA
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-body text-gray-text-tertiary mb-2">Fijos</div>
              <CurrencyDisplay value={totalPorCategoria.fijo} size="medium" showSecondary={false} />
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {formatPercentage(porcentajePorCategoria.fijo)} del total
              </div>
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {eventosPorCategoria.fijo.length} eventos
              </div>
            </div>
            <div>
              <div className="text-body text-gray-text-tertiary mb-2">Variables</div>
              <CurrencyDisplay value={totalPorCategoria.variable} size="medium" showSecondary={false} />
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {formatPercentage(porcentajePorCategoria.variable)} del total
              </div>
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {eventosPorCategoria.variable.length} eventos
              </div>
            </div>
            <div>
              <div className="text-body text-gray-text-tertiary mb-2">Extraordinarios</div>
              <CurrencyDisplay value={totalPorCategoria.extraordinario} size="medium" showSecondary={false} />
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {formatPercentage(porcentajePorCategoria.extraordinario)} del total
              </div>
              <div className="text-body-small text-gray-text-tertiary mt-1">
                {eventosPorCategoria.extraordinario.length} eventos
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Eventos (Solo Lectura) */}
      <Card padding="large">
        <div className="mb-6">
          <h3 className="text-heading-3 text-gray-text-primary mb-2">Eventos del Mes</h3>
          <p className="text-body text-gray-text-tertiary">
            Lista completa de eventos registrados para este mes
          </p>
        </div>
        <ExpenseEventList
          eventos={eventos.sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""))}
          onToggleEstado={() => {}} // Deshabilitado en mes cerrado
          onEditMonto={() => {}} // Deshabilitado en mes cerrado
        />
      </Card>
    </div>
  );
}

