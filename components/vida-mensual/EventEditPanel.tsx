'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import SlideTransition from '../animations/SlideTransition';
import { getInitialExchangeRate, setLastUsedExchangeRate } from '@/mock/exchange-rates';
import { formatNumberWithSeparators, parseFormattedNumber, parseNumberAR, getCursorPosition, formatNumber, formatCurrency } from '@/utils/number-format';
import type { EventoMensual } from '@/types/vida-mensual';

interface EventEditPanelProps {
  evento: EventoMensual | null;
  onClose: () => void;
  onSave: (evento: EventoMensual) => void;
  onDelete?: (id: string) => void;
  onUpdateConcepto?: (conceptoId: string, categoria: 'fijo' | 'variable' | 'extraordinario') => void;
  conceptos: Array<{ id: string; nombre: string; categoria?: 'fijo' | 'variable' | 'extraordinario' }>;
}

export default function EventEditPanel({
  evento,
  onClose,
  onSave,
  onDelete,
  onUpdateConcepto,
  conceptos,
}: EventEditPanelProps) {
  const [concepto, setConcepto] = useState('');
  const [conceptoId, setConceptoId] = useState<string>('');
  const [montoFormatted, setMontoFormatted] = useState<string>('');
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [tipoCambio, setTipoCambio] = useState<number>(getInitialExchangeRate());
  const montoInputRef = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<'pagado' | 'pendiente'>('pagado');
  const [categoriaConcepto, setCategoriaConcepto] = useState<'fijo' | 'variable' | 'extraordinario'>('variable');
  const [nota, setNota] = useState('');
  const [showConceptSuggestions, setShowConceptSuggestions] = useState(false);

  useEffect(() => {
    if (evento) {
      setConcepto(evento.conceptoNombre);
      setConceptoId(evento.conceptoId);
      setMontoFormatted(formatNumberWithSeparators(evento.monto));
      setMoneda(evento.monedaOriginal);
      setTipoCambio(evento.tipoCambioAplicado || getInitialExchangeRate());
      setEstado(evento.estado);
      // Obtener categoría del concepto (naturaleza)
      const conceptoEncontrado = conceptos.find((c) => c.id === evento.conceptoId);
      setCategoriaConcepto(conceptoEncontrado?.categoria || evento.categoria);
      setNota(evento.nota || '');
    }
  }, [evento, conceptos]);

  const filteredConcepts = concepto.length >= 2
    ? conceptos.filter((c) => c.nombre.toLowerCase().includes(concepto.toLowerCase()))
    : [];

  const montoNum = parseFormattedNumber(montoFormatted);
  const montoUsdPreview = montoFormatted && !isNaN(montoNum) && montoNum > 0
    ? (moneda === 'ARS' ? montoNum / tipoCambio : montoNum)
    : 0;

  // Handler para cambio de monto con formateo
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const newValue = input.value;
    const oldValue = montoFormatted;
    
    // Formatear el valor
    const formatted = formatNumberWithSeparators(newValue);
    setMontoFormatted(formatted);
    
    // Ajustar posición del cursor
    setTimeout(() => {
      if (input && montoInputRef.current) {
        const newCursorPos = getCursorPosition(oldValue, formatted, input.selectionStart || 0);
        input.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleSave = () => {
    if (!evento || !concepto || !montoFormatted) return;

    const montoNum = parseFormattedNumber(montoFormatted);
    if (isNaN(montoNum) || montoNum <= 0) return;
    
    // Guardar TC usado
    if (moneda === 'ARS') {
      setLastUsedExchangeRate(tipoCambio);
    }

    const montoUsd = moneda === 'ARS' ? montoNum / tipoCambio : montoNum;
    const conceptoEncontrado = conceptos.find((c) => c.nombre === concepto);

    // Si se cambió la naturaleza del concepto, actualizarla
    if (onUpdateConcepto && conceptoEncontrado && categoriaConcepto !== conceptoEncontrado.categoria) {
      onUpdateConcepto(conceptoEncontrado.id, categoriaConcepto);
    }

    // El evento usa la categoría del concepto (naturaleza heredada)
    const categoriaFinal = conceptoEncontrado?.categoria || categoriaConcepto;

    // Para ingresos, el estado siempre es 'pagado' (no editable)
    const estadoFinal = evento.tipo === 'ingreso' ? 'pagado' : estado;

    const eventoActualizado: EventoMensual = {
      ...evento,
      conceptoNombre: concepto,
      conceptoId: conceptoEncontrado?.id || evento.conceptoId,
      monto: montoNum,
      monedaOriginal: moneda,
      tipoCambioAplicado: moneda === 'ARS' ? tipoCambio : undefined,
      montoUsd,
      estado: estadoFinal,
      categoria: categoriaFinal, // Naturaleza del concepto
      nota: nota || undefined,
      fechaModificacion: new Date().toISOString().split('T')[0],
    };

    onSave(eventoActualizado);
    onClose();
  };

  if (!evento) return null;

  return (
    <>
      {/* Overlay */}
      <SlideTransition isVisible={!!evento} direction="left" duration={300}>
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-subtle z-40"
          onClick={onClose}
        />
      </SlideTransition>

      {/* Panel lateral */}
      <SlideTransition isVisible={!!evento} direction="right" duration={300}>
        <div className="fixed right-0 top-[180px] bottom-0 w-[420px] z-50 bg-white/95 backdrop-blur-card border-l border-gray-border shadow-card">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-divider">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-2 text-gray-text-primary">Editar evento</h2>
              <button
                onClick={onClose}
                className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
              >
                ✕
              </button>
            </div>
            <div className="text-body-small text-gray-text-tertiary">
              {new Date(evento.fecha).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Concepto */}
            <div className="relative">
              <label className="block text-body text-gray-text-primary mb-1.5">Concepto</label>
              <input
                type="text"
                value={concepto}
                onChange={(e) => {
                  setConcepto(e.target.value);
                  setShowConceptSuggestions(e.target.value.length >= 2);
                }}
                onBlur={() => setTimeout(() => setShowConceptSuggestions(false), 200)}
                className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
                placeholder="Concepto..."
              />
              {showConceptSuggestions && filteredConcepts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-border rounded-card shadow-card max-h-48 overflow-y-auto">
                  {filteredConcepts.slice(0, 5).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                    onClick={() => {
                      setConcepto(c.nombre);
                      setConceptoId(c.id);
                      // Heredar naturaleza del concepto seleccionado
                      if (c.categoria) {
                        setCategoriaConcepto(c.categoria);
                      }
                      setShowConceptSuggestions(false);
                    }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50/30 transition-colors duration-fast"
                    >
                      {c.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Monto y Moneda */}
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Monto</label>
                <input
                  ref={montoInputRef}
                  type="text"
                  inputMode="decimal"
                  value={montoFormatted}
                  onChange={handleMontoChange}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 font-mono"
                  placeholder="0"
                />
                {moneda === 'ARS' && montoFormatted && montoNum > 0 && (
                  <div className="mt-1.5 text-body-small text-gray-text-tertiary">
                    ≈ {formatCurrency(montoUsdPreview)} (con TC {formatNumber(tipoCambio)})
                  </div>
                )}
              </div>
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Moneda</label>
                <select
                  value={moneda}
                  onChange={(e) => {
                    setMoneda(e.target.value as 'ARS' | 'USD');
                    if (e.target.value === 'ARS') {
                      setTipoCambio(getInitialExchangeRate());
                    }
                  }}
                  className="px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* TC aplicado (si ARS) */}
            {moneda === 'ARS' && (
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">TC aplicado</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={tipoCambio.toString()}
                  onChange={(e) => {
                    const value = parseNumberAR(e.target.value);
                    if (value !== null && !isNaN(value) && value > 0) {
                      setTipoCambio(value);
                      setLastUsedExchangeRate(value);
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                  placeholder="1000"
                />
              </div>
            )}

            {/* Estado - Solo para egresos */}
            {evento.tipo === 'egreso' && (
              <div>
                <label className="block text-body text-gray-text-primary mb-1.5">Estado</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEstado('pagado')}
                    className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                      estado === 'pagado'
                        ? 'bg-green-success text-white'
                        : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
                    }`}
                  >
                    Pagado
                  </button>
                  <button
                    type="button"
                    onClick={() => setEstado('pendiente')}
                    className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                      estado === 'pendiente'
                        ? 'bg-orange-warning text-white'
                        : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
                    }`}
                  >
                    Pendiente
                  </button>
                </div>
              </div>
            )}

            {/* Naturaleza del concepto */}
            <div>
              <label className="block text-body text-gray-text-primary mb-1.5">
                Naturaleza del concepto
              </label>
              <select
                value={categoriaConcepto}
                onChange={(e) => setCategoriaConcepto(e.target.value as 'fijo' | 'variable' | 'extraordinario')}
                className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
              >
                <option value="fijo">Fijo</option>
                <option value="variable">Variable</option>
                <option value="extraordinario">Extraordinario</option>
              </select>
              <div className="mt-1.5 text-body-small text-gray-text-disabled">
                El cambio aplica solo a eventos futuros de este concepto.
              </div>
            </div>

            {/* Nota */}
            <div>
              <label className="block text-body text-gray-text-primary mb-1.5">Nota (opcional)</label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
                rows={3}
                placeholder="Nota adicional..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-divider flex gap-3">
            {onDelete && evento && (
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
                    onDelete(evento.id);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 text-body text-red-600 hover:text-red-700 transition-colors duration-fast"
              >
                Eliminar
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
      </SlideTransition>
    </>
  );
}

