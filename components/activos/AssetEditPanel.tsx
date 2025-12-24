'use client';

import { useState, useEffect } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import SlideTransition from '../animations/SlideTransition';
import { formatCurrencyUSD } from '@/mock/exchange-rates';
import { 
  getValuacionesByActivo, 
  addValuacion, 
  updateActivoNombre,
  updateActivoTipo,
  updateActivoObservaciones,
  updateActivoEstadoFiscal,
  getPasivoByActivo,
  getPagosByPasivo,
  getPatrimonioNetoActivo,
  type Activo,
  type ValuacionActivo,
  type TipoActivo,
  type EstadoFiscalActivo
} from '@/mock/activos';

interface AssetEditPanelProps {
  activo: Activo | null;
  onClose: () => void;
  onUpdateAsset: (activo: Activo) => void;
}

export default function AssetEditPanel({ activo, onUpdateAsset, onClose }: AssetEditPanelProps) {
  const [nombre, setNombre] = useState<string>('');
  const [tipo, setTipo] = useState<TipoActivo>('otro');
  const [estadoFiscal, setEstadoFiscal] = useState<EstadoFiscalActivo>('no_declarado');
  const [observaciones, setObservaciones] = useState<string>('');
  const [nuevaValuacionFecha, setNuevaValuacionFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [nuevaValuacionValor, setNuevaValuacionValor] = useState<string>('');
  const [nuevaValuacionNota, setNuevaValuacionNota] = useState<string>('');
  const [valuaciones, setValuaciones] = useState<ValuacionActivo[]>([]);

  useEffect(() => {
    if (activo) {
      setNombre(activo.nombre);
      setTipo(activo.tipo);
      setEstadoFiscal(activo.estadoFiscal);
      setObservaciones(activo.observaciones || '');
      setValuaciones(getValuacionesByActivo(activo.id));
      setNuevaValuacionFecha(new Date().toISOString().split('T')[0]);
      setNuevaValuacionValor('');
      setNuevaValuacionNota('');
    }
  }, [activo]);

  if (!activo) return null;

  const handleSaveNombre = () => {
    if (nombre.trim() && nombre !== activo.nombre) {
      updateActivoNombre(activo.id, nombre.trim());
      onUpdateAsset({ ...activo, nombre: nombre.trim() });
    }
  };

  const handleSaveTipo = () => {
    if (tipo !== activo.tipo) {
      updateActivoTipo(activo.id, tipo);
      onUpdateAsset({ ...activo, tipo });
    }
  };

  const handleSaveEstadoFiscal = () => {
    if (estadoFiscal !== activo.estadoFiscal) {
      updateActivoEstadoFiscal(activo.id, estadoFiscal);
      onUpdateAsset({ ...activo, estadoFiscal });
    }
  };

  const handleSaveObservaciones = () => {
    updateActivoObservaciones(activo.id, observaciones);
    onUpdateAsset({ ...activo, observaciones });
  };

  const handleAddValuacion = () => {
    if (!nuevaValuacionValor || isNaN(parseFloat(nuevaValuacionValor))) return;
    
    const valorUsd = parseFloat(nuevaValuacionValor);
    addValuacion(activo.id, nuevaValuacionFecha, valorUsd, nuevaValuacionNota || undefined);
    
    // Actualizar lista de valuaciones
    setValuaciones(getValuacionesByActivo(activo.id));
    
    // Actualizar activo
    const activoActualizado = {
      ...activo,
      valorActualUsd: valorUsd,
      fechaUltimaValuacion: nuevaValuacionFecha,
    };
    onUpdateAsset(activoActualizado);
    
    // Resetear formulario
    setNuevaValuacionValor('');
    setNuevaValuacionNota('');
  };

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const pasivo = activo.pasivo;
  const pagos = pasivo ? getPagosByPasivo(pasivo.id) : [];

  return (
    <>
      {/* Overlay */}
      <SlideTransition isVisible={!!activo} direction="left" duration={300}>
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-subtle z-40"
          onClick={onClose}
        />
      </SlideTransition>

      {/* Panel lateral */}
      <SlideTransition isVisible={!!activo} direction="right" duration={300}>
        <div className="fixed right-0 top-[180px] bottom-0 w-[420px] z-50 bg-white/95 backdrop-blur-card border-l border-gray-border shadow-card overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-divider">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-2 text-gray-text-primary">Editar activo</h2>
                <button
                  onClick={onClose}
                  className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                >
                  ✕
                </button>
              </div>
              <div className="text-body-small text-gray-text-tertiary">
                {activo.tipo.charAt(0).toUpperCase() + activo.tipo.slice(1)}
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={handleSaveNombre}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
                  placeholder="Nombre del activo..."
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => {
                    setTipo(e.target.value as TipoActivo);
                    handleSaveTipo();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                >
                  <option value="inmueble">Inmueble</option>
                  <option value="vehiculo">Vehículo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {/* Estado Fiscal */}
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Estado Fiscal</label>
                <select
                  value={estadoFiscal}
                  onChange={(e) => {
                    setEstadoFiscal(e.target.value as EstadoFiscalActivo);
                    handleSaveEstadoFiscal();
                  }}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                >
                  <option value="declarado">Declarado</option>
                  <option value="no_declarado">No declarado</option>
                </select>
                <div className="text-body-small text-gray-text-tertiary mt-1.5">
                  Define si este activo se incluye en cálculos fiscales (Bienes Personales).
                </div>
              </div>

              {/* Valor Actual y Patrimonio Neto */}
              <div className="pt-4 border-t border-gray-divider space-y-3">
                <div>
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    VALOR DEL ACTIVO
                  </div>
                  <CurrencyDisplay 
                    value={activo.valorActualUsd} 
                    size="large" 
                    showSecondary={true}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Última valuación: {formatDate(activo.fechaUltimaValuacion)}
                  </div>
                </div>
                
                {pasivo && pasivo.saldoPendienteUsd > 0 && (
                  <div className="pt-3 border-t border-gray-divider">
                    <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                      SALDO PENDIENTE
                    </div>
                    <CurrencyDisplay 
                      value={pasivo.saldoPendienteUsd} 
                      size="medium" 
                      showSecondary={true}
                      originalCurrency="USD"
                    />
                    <div className="text-body-small text-gray-text-tertiary mt-1">
                      {pasivo.cuotasRestantes} de {pasivo.cuotasTotales} cuotas restantes
                    </div>
                    <div className="text-body-small text-gray-text-tertiary mt-1 opacity-70">
                      El saldo se reduce automáticamente desde Vida Mensual al pagar cuotas.
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-divider">
                  <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                    PATRIMONIO NETO
                  </div>
                  <CurrencyDisplay 
                    value={getPatrimonioNetoActivo(activo)} 
                    size="large" 
                    showSecondary={true}
                    originalCurrency="USD"
                  />
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Valor del activo {pasivo && pasivo.saldoPendienteUsd > 0 ? 'menos saldo pendiente' : ''}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  onBlur={handleSaveObservaciones}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
                  rows={4}
                  placeholder="Notas sobre este activo..."
                />
              </div>

              {/* Agregar Nueva Valuación */}
              <div className="pt-4 border-t border-gray-divider">
                <h3 className="text-heading-3 text-gray-text-primary mb-4">Agregar valuación</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-body text-gray-text-primary mb-1.5">Fecha</label>
                    <input
                      type="date"
                      value={nuevaValuacionFecha}
                      onChange={(e) => setNuevaValuacionFecha(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-body text-gray-text-primary mb-1.5">Valor (USD)</label>
                    <input
                      type="number"
                      value={nuevaValuacionValor}
                      onChange={(e) => setNuevaValuacionValor(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                    <div className="mt-1.5 text-body-small text-gray-text-disabled">
                      Valor en USD. Este será el nuevo valor actual del activo.
                    </div>
                  </div>
                  <div>
                    <label className="block text-body text-gray-text-primary mb-1.5">Nota (opcional)</label>
                    <textarea
                      value={nuevaValuacionNota}
                      onChange={(e) => setNuevaValuacionNota(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
                      rows={2}
                      placeholder="Contexto de la valuación..."
                    />
                  </div>
                  <button
                    onClick={handleAddValuacion}
                    disabled={!nuevaValuacionValor || isNaN(parseFloat(nuevaValuacionValor))}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar valuación
                  </button>
                </div>
              </div>

              {/* Historial de Valuaciones */}
              {valuaciones.length > 0 && (
                <div className="pt-4 border-t border-gray-divider">
                  <h3 className="text-heading-3 text-gray-text-primary mb-4">Historial de valuaciones</h3>
                  <div className="space-y-3">
                    {valuaciones.map((valuacion) => (
                      <div
                        key={valuacion.id}
                        className="p-3 rounded-lg bg-white/30 border border-gray-divider"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-body text-gray-text-primary font-medium">
                            {formatDate(valuacion.fecha)}
                          </div>
                          <CurrencyDisplay 
                            value={valuacion.valorUsd} 
                            size="regular" 
                            showSecondary={false}
                            originalCurrency="USD"
                          />
                        </div>
                        {valuacion.nota && (
                          <div className="text-body-small text-gray-text-tertiary mt-1">
                            {valuacion.nota}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pasivo Asociado (solo lectura) */}
              {pasivo && (
                <div className="pt-4 border-t border-gray-divider">
                  <h3 className="text-heading-3 text-gray-text-primary mb-4">Pasivo asociado</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/30 border border-gray-divider">
                      <div className="grid grid-cols-2 gap-3 text-body-small">
                        <div>
                          <div className="text-gray-text-tertiary mb-1">Monto financiado</div>
                          <CurrencyDisplay 
                            value={pasivo.montoFinanciadoUsd} 
                            size="regular" 
                            showSecondary={false}
                            originalCurrency="USD"
                          />
                        </div>
                        <div>
                          <div className="text-gray-text-tertiary mb-1">Valor cuota</div>
                          <CurrencyDisplay 
                            value={pasivo.valorCuotaUsd} 
                            size="regular" 
                            showSecondary={false}
                            originalCurrency="USD"
                          />
                        </div>
                        <div>
                          <div className="text-gray-text-tertiary mb-1">Cuotas</div>
                          <div className="text-body text-gray-text-primary">
                            {pasivo.cuotasRestantes} / {pasivo.cuotasTotales}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-text-tertiary mb-1">Saldo pendiente</div>
                          <CurrencyDisplay 
                            value={pasivo.saldoPendienteUsd} 
                            size="regular" 
                            showSecondary={false}
                            originalCurrency="USD"
                          />
                        </div>
                      </div>
                      <div className="text-body-small text-gray-text-tertiary mt-2 opacity-70">
                        El saldo se reduce automáticamente desde Vida Mensual.
                      </div>
                    </div>

                    {/* Historial de Pagos */}
                    {pagos.length > 0 && (
                      <div className="pt-3 border-t border-gray-divider">
                        <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-2">
                          HISTORIAL DE PAGOS (ÚLTIMOS 5)
                        </div>
                        <div className="space-y-2">
                          {pagos.slice(0, 5).map((pago) => (
                            <div
                              key={pago.id}
                              className="p-2 rounded-lg bg-white/20 border border-gray-divider"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-body-small text-gray-text-primary">
                                  {formatDate(pago.fecha)}
                                </div>
                                <CurrencyDisplay 
                                  value={pago.montoUsd} 
                                  size="regular" 
                                  showSecondary={false}
                                  originalCurrency="USD"
                                />
                              </div>
                              <div className="text-body-small text-gray-text-tertiary mt-1">
                                Saldo: {formatCurrencyUSD(pago.saldoAnteriorUsd)} → {formatCurrencyUSD(pago.saldoNuevoUsd)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SlideTransition>
    </>
  );
}
