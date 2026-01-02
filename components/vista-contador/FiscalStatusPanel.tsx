'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage, formatCurrency } from '@/utils/number-format';
import type { EstadoMonotributo, EstadoIIBB, EstadoBienesPersonales } from '@/mock/fiscal';

interface FiscalStatusPanelProps {
  estadoMonotributo: EstadoMonotributo;
  estadoIIBB: EstadoIIBB;
  estadoBP: EstadoBienesPersonales;
}

export default function FiscalStatusPanel({
  estadoMonotributo,
  estadoIIBB,
  estadoBP,
}: FiscalStatusPanelProps) {
  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'alto':
        return 'text-orange-warning';
      case 'medio':
        return 'text-yellow-500';
      case 'bajo':
        return 'text-green-success';
      default:
        return 'text-gray-text-tertiary';
    }
  };

  const getRiesgoBg = (riesgo: string) => {
    switch (riesgo) {
      case 'alto':
        return 'bg-orange-warning/10 border-orange-warning/20';
      case 'medio':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'bajo':
        return 'bg-green-success/10 border-green-success/20';
      default:
        return 'bg-gray-50/30 border-gray-divider';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monotributo */}
      <Card padding="large">
        <div className="mb-6">
          <h2 className="text-heading-2 text-gray-text-primary mb-2">Monotributo</h2>
          <p className="text-body text-gray-text-tertiary">
            Estado basado en ingresos facturados últimos 12 meses
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              CATEGORÍA ACTUAL
            </div>
            <div className="text-number-large number-glass">
              {estadoMonotributo.categoria}
            </div>
          </div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              INGRESOS 12 MESES
            </div>
            <div className="text-number-medium number-glass">
              {formatCurrency(estadoMonotributo.ingresosAcumulados12Meses)}
            </div>
            <div className="text-body-small text-gray-text-tertiary mt-1">
              Tope: {formatCurrency(estadoMonotributo.topeIngresosAnuales)}
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-body text-gray-text-primary">
              {formatPercentage(estadoMonotributo.porcentajeTope)} del tope
            </div>
            <div className={`text-body-small font-medium ${getRiesgoColor(estadoMonotributo.riesgoRecategorizacion)}`}>
              Riesgo {estadoMonotributo.riesgoRecategorizacion.toUpperCase()}
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                estadoMonotributo.riesgoRecategorizacion === 'alto'
                  ? 'bg-orange-warning'
                  : estadoMonotributo.riesgoRecategorizacion === 'medio'
                  ? 'bg-yellow-500'
                  : 'bg-green-success'
              }`}
              style={{ width: `${Math.min(100, estadoMonotributo.porcentajeTope)}%` }}
            />
          </div>
        </div>

        {/* Alerta de recategorización */}
        {estadoMonotributo.proximaRecategorizacion && (
          <div className={`p-4 rounded-lg border ${getRiesgoBg(estadoMonotributo.riesgoRecategorizacion)}`}>
            <div className="text-body-large text-gray-text-primary font-medium mb-1">
              Atención: Riesgo de recategorización
            </div>
            <div className="text-body text-gray-text-tertiary">
              Si los ingresos continúan al mismo ritmo, podrías superar el tope de la categoría {estadoMonotributo.categoria} alrededor de{' '}
              {new Date(estadoMonotributo.proximaRecategorizacion).toLocaleDateString('es-AR', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        )}
      </Card>

      {/* IIBB */}
      <Card padding="large">
        <div className="mb-6">
          <h2 className="text-heading-2 text-gray-text-primary mb-2">Ingresos Brutos (IIBB)</h2>
          <p className="text-body text-gray-text-tertiary">
            Estado de presentaciones AGIP
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              ESTADO
            </div>
            <div className={`text-body-large font-medium ${
              estadoIIBB.estado === 'al_dia' ? 'text-green-success' :
              estadoIIBB.estado === 'vencido' ? 'text-orange-warning' :
              'text-gray-text-tertiary'
            }`}>
              {estadoIIBB.estado === 'al_dia' ? 'Al día' :
               estadoIIBB.estado === 'vencido' ? 'Vencido' :
               'Pendiente'}
            </div>
          </div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              PRÓXIMA PRESENTACIÓN
            </div>
            <div className="text-body text-gray-text-primary">
              {estadoIIBB.proximaPresentacion
                ? new Date(estadoIIBB.proximaPresentacion).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'No definida'}
            </div>
          </div>
        </div>
      </Card>

      {/* Bienes Personales */}
      <Card padding="large">
        <div className="mb-6">
          <h2 className="text-heading-2 text-gray-text-primary mb-2">Bienes Personales</h2>
          <p className="text-body text-gray-text-tertiary">
            Basado en activos registrados
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              BASE IMPONIBLE
            </div>
            <div className="text-number-medium number-glass">
              {formatCurrency(estadoBP.baseImponible)}
            </div>
            <div className="text-body-small text-gray-text-tertiary mt-1">
              Mínimo no imponible: {formatCurrency(estadoBP.minimoNoImponible)}
            </div>
          </div>
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1.5">
              DEBE PRESENTAR
            </div>
            <div className={`text-body-large font-medium ${
              estadoBP.debePresentar ? 'text-orange-warning' : 'text-green-success'
            }`}>
              {estadoBP.debePresentar ? 'Sí' : 'No'}
            </div>
            {estadoBP.debePresentar && (
              <div className="text-body-small text-gray-text-tertiary mt-1">
                Estimado: {formatCurrency(estadoBP.montoEstimado)}
              </div>
            )}
          </div>
        </div>

        {estadoBP.debePresentar && (
          <div className={`p-4 rounded-lg border ${getRiesgoBg(estadoBP.riesgo)}`}>
            <div className="text-body-large text-gray-text-primary font-medium mb-1">
              Debe presentar declaración de Bienes Personales
            </div>
            <div className="text-body text-gray-text-tertiary">
              La base imponible supera el mínimo no imponible. Estimado a pagar: {formatCurrency(estadoBP.montoEstimado)}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

