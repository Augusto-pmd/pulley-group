'use client';

import { useState } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatPercentage } from '@/mock/data';
import { emmaEstadoActual, getTramoActual, type EmmaTramo } from '@/mock/emma-tramos';

interface EmmaProjectionVariablesProps {
  tramoActual: EmmaTramo | undefined;
  onUpdateTramo: (updates: Partial<EmmaTramo>) => void;
  onCreateNewTramo: () => void;
  onClose?: () => void;
  defaultEditing?: boolean;
}

export default function EmmaProjectionVariables({
  tramoActual,
  onUpdateTramo,
  onCreateNewTramo,
  onClose,
  defaultEditing = false,
}: EmmaProjectionVariablesProps) {
  const [isEditing, setIsEditing] = useState(defaultEditing);
  const [editValues, setEditValues] = useState({
    instrumento: tramoActual?.instrumento || '',
    rendimientoEsperado: tramoActual?.rendimientoEsperado.toString() || '',
    inflacionAsumida: tramoActual?.inflacionAsumida.toString() || '',
    aporteMensual: tramoActual?.aporteMensual.toString() || '',
  });

  const handleSave = () => {
    if (tramoActual) {
      onUpdateTramo({
        instrumento: editValues.instrumento,
        rendimientoEsperado: parseFloat(editValues.rendimientoEsperado) || 0,
        inflacionAsumida: parseFloat(editValues.inflacionAsumida) || 0,
        aporteMensual: parseFloat(editValues.aporteMensual) || 0,
        fechaModificacion: new Date().toISOString().split('T')[0],
      });
      setIsEditing(false);
      if (onClose) onClose();
    }
  };

  const handleCancel = () => {
    setEditValues({
      instrumento: tramoActual?.instrumento || '',
      rendimientoEsperado: tramoActual?.rendimientoEsperado.toString() || '',
      inflacionAsumida: tramoActual?.inflacionAsumida.toString() || '',
      aporteMensual: tramoActual?.aporteMensual.toString() || '',
    });
    setIsEditing(false);
  };

  // Calcular rendimiento real implícito
  const rendimientoReal = tramoActual
    ? tramoActual.rendimientoEsperado - tramoActual.inflacionAsumida
    : 0;

  return (
    <div className="space-y-6">
      {/* Header con cierre si viene de acción principal */}
      {defaultEditing && onClose && (
        <Card padding="normal">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-heading-2 text-gray-text-primary mb-1">Ajustar variables de proyección</h2>
              <p className="text-body text-gray-text-tertiary">
                Modifica las variables que aplican hacia adelante. El pasado no se modifica.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
            >
              ✕
            </button>
          </div>
        </Card>
      )}

      {/* Estado Actual (Solo Lectura) - Solo mostrar si no está en modo edición directa */}
      {!defaultEditing && (
        <Card padding="large">
        <h3 className="text-heading-3 text-gray-text-primary mb-6">ESTADO ACTUAL</h3>
        
        <div className="space-y-6">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              CAPITAL ACUMULADO
            </div>
            <CurrencyDisplay 
              value={emmaEstadoActual.capitalAcumulado} 
              size="large" 
              showSecondary={true}
              originalCurrency="USD"
            />
          </div>

          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              FECHA DE CORTE
            </div>
            <div className="text-body-large text-gray-text-primary">
              {new Date(emmaEstadoActual.fechaCorte).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>

          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              APORTES ACUMULADOS
            </div>
            <CurrencyDisplay 
              value={emmaEstadoActual.aportesAcumulados} 
              size="medium" 
              showSecondary={true}
              originalCurrency="USD"
            />
          </div>

          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
              RENDIMIENTO HISTÓRICO PROMEDIO
            </div>
            <div className="number-medium text-gray-text-primary">
              {formatPercentage(emmaEstadoActual.rendimientoHistoricoPromedio)}
            </div>
          </div>
        </div>
      </Card>
      )}

      {/* Tramo Actual (Editable) - Siempre visible en modo edición directa */}
      {tramoActual && (
        <Card padding="large">
          {!defaultEditing && (
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-heading-3 text-gray-text-primary">TRAMO ACTUAL</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-body text-blue-600 hover:text-blue-700 transition-colors duration-fast"
                >
                  Editar
                </button>
              )}
            </div>
          )}
          {defaultEditing && (
            <div className="mb-6">
              <h3 className="text-heading-3 text-gray-text-primary mb-1">TRAMO ACTUAL</h3>
              <p className="text-body-small text-gray-text-tertiary mb-2">
                Variables que aplican desde {new Date(tramoActual.fechaInicio).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <div className="text-body-small text-gray-text-disabled">
                Todas las variables están en USD. Las proyecciones se calculan en USD.
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-body text-gray-text-primary mb-2">
                  Instrumento
                </label>
                <input
                  type="text"
                  value={editValues.instrumento}
                  onChange={(e) => setEditValues({ ...editValues, instrumento: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                />
              </div>

              <div>
                <label className="block text-body text-gray-text-primary mb-2">
                  Rendimiento Esperado (% anual)
                </label>
                <input
                  type="number"
                  value={editValues.rendimientoEsperado}
                  onChange={(e) => setEditValues({ ...editValues, rendimientoEsperado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                  step="0.1"
                  min="0"
                />
                <div className="mt-1.5 text-body-small text-gray-text-disabled">
                  Rendimiento nominal esperado
                </div>
              </div>

              <div>
                <label className="block text-body text-gray-text-primary mb-2">
                  Inflación Asumida (% anual)
                </label>
                <input
                  type="number"
                  value={editValues.inflacionAsumida}
                  onChange={(e) => setEditValues({ ...editValues, inflacionAsumida: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                  step="0.1"
                  min="0"
                />
                <div className="mt-1.5 text-body-small text-gray-text-disabled">
                  Supuesto de inflación para este tramo
                </div>
              </div>

              <div>
                <label className="block text-body text-gray-text-primary mb-2">
                  Aporte Mensual
                </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editValues.aporteMensual}
                      onChange={(e) => setEditValues({ ...editValues, aporteMensual: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/50"
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute right-4 top-2 text-body-small text-gray-text-disabled">
                      USD
                    </div>
                  </div>
                  <div className="mt-1.5 text-body-small text-gray-text-disabled">
                    Aporte mensual en USD. Las proyecciones se calculan en USD.
                  </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  FECHA DE INICIO DEL TRAMO
                </div>
                <div className="text-body-large text-gray-text-primary">
                  {new Date(tramoActual.fechaInicio).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-divider">
                <p className="text-body-small text-gray-text-tertiary mb-4">
                  Estos cambios aplican solo hacia adelante. El pasado no se modifica.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  INSTRUMENTO
                </div>
                <div className="text-body-large text-gray-text-primary">
                  {tramoActual.instrumento}
                </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  RENDIMIENTO ESPERADO
                </div>
                <div className="number-medium text-gray-text-primary">
                  {formatPercentage(tramoActual.rendimientoEsperado)}
                </div>
                <div className="mt-1 text-body-small text-gray-text-disabled">
                  Rendimiento nominal (% anual)
                </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  INFLACIÓN ASUMIDA
                </div>
                <div className="number-medium text-gray-text-primary">
                  {formatPercentage(tramoActual.inflacionAsumida)}
                </div>
                <div className="mt-1 text-body-small text-gray-text-disabled">
                  Supuesto de inflación (% anual)
                </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  RENDIMIENTO REAL IMPLÍCITO
                </div>
                <div className="number-medium text-gray-text-primary">
                  {formatPercentage(rendimientoReal)}
                </div>
                <div className="mt-1 text-body-small text-gray-text-disabled">
                  Rendimiento esperado - Inflación asumida
                </div>
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  APORTE MENSUAL
                </div>
                <CurrencyDisplay 
                  value={tramoActual.aporteMensual} 
                  size="medium" 
                  showSecondary={true}
                  originalCurrency="USD"
                />
              </div>

              <div>
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                  FECHA DE INICIO
                </div>
                <div className="text-body-large text-gray-text-primary">
                  {new Date(tramoActual.fechaInicio).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {tramoActual.nota && (
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    NOTA
                  </div>
                  <div className="text-body text-gray-text-tertiary">
                    {tramoActual.nota}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-divider">
                <p className="text-body-small text-gray-text-tertiary mb-4">
                  Estos valores aplican solo hacia adelante. El pasado no se modifica.
                </p>
                <button
                  onClick={onCreateNewTramo}
                  className="w-full px-6 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
                >
                  Cambiar supuestos desde esta fecha
                </button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

