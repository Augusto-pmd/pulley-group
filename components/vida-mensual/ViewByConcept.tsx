'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import ExpenseEventList from './ExpenseEventList';
import { formatCurrency } from '@/mock/data';
import type { EventoMensual } from '@/mock/eventos';
import { conceptosMock } from '@/mock/conceptos';

interface ViewByConceptProps {
  eventos: EventoMensual[];
  onToggleEstado: (id: string) => void;
  onEditMonto: (id: string, nuevoMonto: number) => void;
}

// Helper functions locales
function getEventosByConcepto(eventos: EventoMensual[], conceptoId: string): EventoMensual[] {
  return eventos.filter((e) => e.conceptoId === conceptoId);
}

function getTotalByConcepto(eventos: EventoMensual[], conceptoId: string): number {
  return getEventosByConcepto(eventos, conceptoId).reduce((sum, e) => sum + e.monto, 0);
}

export default function ViewByConcept({ eventos, onToggleEstado, onEditMonto }: ViewByConceptProps) {
  const [selectedConceptoId, setSelectedConceptoId] = useState<string | null>(null);
  const eventosConcepto = selectedConceptoId ? getEventosByConcepto(eventos, selectedConceptoId) : [];

  // Agrupar conceptos con estadísticas
  const conceptosConStats = conceptosMock.map((concepto) => {
    const eventosConcepto = getEventosByConcepto(eventos, concepto.id);
    const total = getTotalByConcepto(eventos, concepto.id);
    const promedio = eventosConcepto.length > 0 ? total / eventosConcepto.length : 0;
    const ultimoEvento = eventosConcepto.sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""))[0];

    return {
      ...concepto,
      totalEventos: eventosConcepto.length,
      totalMonto: total,
      promedioMonto: promedio,
      ultimoEvento,
    };
  });

  // Ordenar por total de monto descendente
  conceptosConStats.sort((a, b) => b.totalMonto - a.totalMonto);

  return (
    <div>
      {/* Lista de Conceptos */}
      <div className="mb-8">
        <Card padding="large">
          <h2 className="text-heading-2 text-gray-text-primary mb-6">CONCEPTOS</h2>
          <div className="space-y-1">
            {conceptosConStats.map((concepto) => {
              const isSelected = selectedConceptoId === concepto.id;
              return (
                <div
                  key={concepto.id}
                  onClick={() => setSelectedConceptoId(isSelected ? null : concepto.id)}
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors duration-fast ${
                    isSelected
                      ? 'bg-blue-50/30 hover:bg-blue-50/50 border border-blue-200/20'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="text-body-large text-gray-text-primary font-medium">
                        {concepto.nombre}
                      </div>
                      <div className="text-body-small text-gray-text-tertiary">
                        {concepto.totalEventos} eventos
                        {concepto.recurrente && ` · ${concepto.frecuencia}`}
                        {concepto.ultimoEvento && (
                          <span className="ml-2">
                            · Último: {new Date(concepto.ultimoEvento.fecha).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="number-medium text-gray-text-primary">
                        {formatCurrency(concepto.totalMonto)}
                      </div>
                      <div className="text-body-small text-gray-text-tertiary">
                        Promedio: {formatCurrency(concepto.promedioMonto)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Eventos del Concepto Seleccionado */}
      {selectedConceptoId && eventosConcepto.length > 0 && (
        <div className="mb-16">
          <Card padding="large">
            <div className="mb-6">
              <h3 className="text-heading-2 text-gray-text-primary mb-2">
                {conceptosMock.find((c) => c.id === selectedConceptoId)?.nombre}
              </h3>
              <p className="text-body text-gray-text-tertiary">
                Historial completo de eventos para este concepto
              </p>
            </div>
            <ExpenseEventList
              eventos={eventosConcepto.sort((a, b) => (b.fecha ?? "").localeCompare(a.fecha ?? ""))}
              onToggleEstado={onToggleEstado}
              onEditMonto={onEditMonto}
            />
          </Card>
        </div>
      )}

      {selectedConceptoId && eventosConcepto.length === 0 && (
        <div className="mb-16">
          <Card padding="large">
            <div className="text-body text-gray-text-tertiary text-center py-8">
              No hay eventos registrados para este concepto
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
