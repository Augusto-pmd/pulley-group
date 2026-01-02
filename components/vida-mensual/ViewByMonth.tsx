'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import ExpenseEventList from './ExpenseEventList';
import MonthlySummary from './MonthlySummary';
import NetResult from './NetResult';
import { formatCurrency } from '@/utils/number-format';
import type { EventoMensual } from '@/mock/eventos';

interface ViewByMonthProps {
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
}

// Helper functions locales
function getEventosByMes(eventos: EventoMensual[], mes: string): EventoMensual[] {
  return eventos.filter((e) => e.mes === mes);
}

function getTotalByMes(eventos: EventoMensual[], mes: string): number {
  return getEventosByMes(eventos, mes).reduce((sum, e) => sum + e.monto, 0);
}

function getMesesDisponibles(eventos: EventoMensual[]): string[] {
  const meses = eventos.map((e) => e.mes);
  return Array.from(new Set(meses)).sort();
}

export default function ViewByMonth({ eventos, onToggleEstado, onEditMonto }: ViewByMonthProps) {
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const meses = getMesesDisponibles(eventos);
  const eventosMes = getEventosByMes(eventos, selectedMonth);
  const totalMes = getTotalByMes(eventos, selectedMonth);

  // Calcular resumen del mes
  const eventosPagados = eventosMes.filter((e) => e.estado === 'pagado');
  const eventosPendientes = eventosMes.filter((e) => e.estado === 'pendiente');
  const totalPagado = eventosPagados.reduce((sum, e) => sum + e.monto, 0);
  const totalPendiente = eventosPendientes.reduce((sum, e) => sum + e.monto, 0);

  // Calcular promedio mensual (de todos los meses disponibles)
  const totalTodosMeses = meses.reduce((sum, mes) => sum + getTotalByMes(eventos, mes), 0);
  const promedioMensual = meses.length > 0 ? totalTodosMeses / meses.length : 0;

  // Calcular variación vs promedio
  const variacion = promedioMensual > 0 ? ((totalMes - promedioMensual) / promedioMensual) * 100 : 0;

  // Calcular gasto mínimo (solo fijos pagados)
  const gastosFijos = eventosPagados.filter((e) => e.categoria === 'fijo');
  const gastoMinimo = gastosFijos.reduce((sum, e) => sum + e.monto, 0);

  const summary = {
    month: selectedMonth,
    totalIncome: 0, // Solo egresos por ahora
    totalExpenses: totalMes,
    netResult: -totalMes, // Negativo porque son solo egresos
    averageMonthly: promedioMensual,
    minimumExpense: gastoMinimo,
    variation: variacion,
  };

  return (
    <div>
      {/* Selector de Mes */}
      <div className="mb-8">
        <Card padding="normal">
          <div className="flex items-center gap-4">
            <label className="text-body-large text-gray-text-primary font-medium">
              Mes:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
            >
              {meses.map((mes) => (
                <option key={mes} value={mes}>
                  {new Date(mes + '-01').toLocaleDateString('es-AR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
            <div className="ml-auto text-body text-gray-text-tertiary">
              {eventosMes.length} eventos · {eventosPagados.length} pagados
              {eventosPendientes.length > 0 && ` · ${eventosPendientes.length} pendientes`}
            </div>
          </div>
        </Card>
      </div>

      {/* Resumen del Mes */}
      <div className="mb-16">
        <MonthlySummary summary={summary} />
      </div>

      {/* Lista de Egresos */}
      <div className="mb-16">
        <ExpenseEventList
          eventos={eventosMes}
          onToggleEstado={onToggleEstado}
          onEditMonto={onEditMonto}
        />
      </div>

      {/* Resultado Neto */}
      <div className="mb-16">
        <NetResult
          netResult={-totalMes}
          totalIncome={0}
          totalExpenses={totalMes}
        />
      </div>
    </div>
  );
}

