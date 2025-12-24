'use client';

import Card from '../Card';
import { formatCurrencyARS } from '@/mock/exchange-rates';
import type { ObligacionFiscal } from '@/mock/fiscal';

interface FiscalObligationsProps {
  obligaciones: ObligacionFiscal[];
}

export default function FiscalObligations({ obligaciones }: FiscalObligationsProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'vencido':
        return 'text-orange-warning bg-orange-warning/10 border-orange-warning/20';
      case 'presentado':
        return 'text-green-success bg-green-success/10 border-green-success/20';
      case 'pendiente':
        return 'text-blue-system bg-blue-50/30 border-blue-200/20';
      default:
        return 'text-gray-text-tertiary bg-gray-50/30 border-gray-divider';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'monotributo':
        return 'Monotributo';
      case 'iibb':
        return 'IIBB';
      case 'bienes_personales':
        return 'Bienes Personales';
      case 'ganancias':
        return 'Ganancias';
      default:
        return tipo;
    }
  };

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const hoy = new Date();
  const obligacionesVencidas = obligaciones.filter((o) => o.estado === 'vencido');
  const obligacionesPendientes = obligaciones.filter((o) => o.estado === 'pendiente');
  const obligacionesPresentadas = obligaciones.filter((o) => o.estado === 'presentado');

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card padding="normal">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
              VENCIDAS
            </div>
            <div className="text-number-medium number-glass text-orange-warning">
              {obligacionesVencidas.length}
            </div>
          </div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
              PENDIENTES
            </div>
            <div className="text-number-medium number-glass text-blue-system">
              {obligacionesPendientes.length}
            </div>
          </div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
              PRESENTADAS
            </div>
            <div className="text-number-medium number-glass text-green-success">
              {obligacionesPresentadas.length}
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Obligaciones */}
      <Card padding="large">
        <h2 className="text-heading-2 text-gray-text-primary mb-6">Obligaciones Fiscales</h2>
        <div className="space-y-4">
          {obligaciones.map((obligacion) => {
            const fechaVencimiento = new Date(obligacion.fechaVencimiento);
            const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={obligacion.id}
                className={`p-4 rounded-lg border ${getEstadoColor(obligacion.estado)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-heading-3 text-gray-text-primary">
                        {obligacion.nombre}
                      </h3>
                      <span className="px-2 py-0.5 bg-white/50 text-gray-text-primary text-body-small rounded-button">
                        {getTipoLabel(obligacion.tipo)}
                      </span>
                    </div>
                    <div className="text-body-small text-gray-text-tertiary">
                      Frecuencia: {obligacion.frecuencia.charAt(0).toUpperCase() + obligacion.frecuencia.slice(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body text-gray-text-primary font-medium">
                      {formatDate(obligacion.fechaVencimiento)}
                    </div>
                    {diasRestantes >= 0 && obligacion.estado === 'pendiente' && (
                      <div className="text-body-small text-gray-text-tertiary mt-1">
                        {diasRestantes === 0 ? 'Vence hoy' : `${diasRestantes} días restantes`}
                      </div>
                    )}
                    {diasRestantes < 0 && obligacion.estado === 'vencido' && (
                      <div className="text-body-small text-orange-warning mt-1">
                        Vencida hace {Math.abs(diasRestantes)} días
                      </div>
                    )}
                  </div>
                </div>
                {obligacion.montoEstimado && (
                  <div className="mt-2 pt-2 border-t border-gray-divider">
                    <div className="text-body-small text-gray-text-tertiary">
                      Monto estimado: {formatCurrencyARS(obligacion.montoEstimado)}
                    </div>
                  </div>
                )}
                {obligacion.nota && (
                  <div className="mt-2 text-body-small text-gray-text-tertiary">
                    {obligacion.nota}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

