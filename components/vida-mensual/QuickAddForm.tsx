'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import FeedbackPulse from '../animations/FeedbackPulse';
import { conceptosMock } from '@/mock/conceptos';
import { convertArsToUsdCurrent, getCurrentExchangeRate, formatCurrencyUSD, getInitialExchangeRate, setLastUsedExchangeRate } from '@/mock/exchange-rates';
import { formatNumberWithSeparators, parseFormattedNumber, getCursorPosition } from '@/utils/number-format';

interface QuickAddFormProps {
  onAdd: (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado: 'pagado' | 'pendiente',
    monedaOriginal: 'ARS' | 'USD',
    tipoCambioAplicado?: number,
    montoUsd: number
  ) => void;
}

export default function QuickAddForm({ onAdd }: QuickAddFormProps) {
  const [tipoMovimiento, setTipoMovimiento] = useState<'ingreso' | 'egreso'>('egreso'); // Default: Egreso
  const [concepto, setConcepto] = useState('');
  const [montoFormatted, setMontoFormatted] = useState<string>(''); // Monto formateado para visualización
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [tipoCambio, setTipoCambio] = useState<number>(getInitialExchangeRate()); // TC editable, precargado con último usado o sugerido
  const montoInputRef = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<'pagado' | 'pendiente'>('pagado');
  const [naturaleza, setNaturaleza] = useState<'fijo' | 'variable' | 'extraordinario'>('variable'); // Solo para conceptos nuevos
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredConcepts, setFilteredConcepts] = useState<typeof conceptosMock>([]);
  const [selectedConcept, setSelectedConcept] = useState<typeof conceptosMock[0] | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (concepto.length > 0) {
      // Filtrar conceptos por tipo de movimiento
      const filtered = conceptosMock.filter((c) =>
        c.tipo === tipoMovimiento &&
        c.nombre.toLowerCase().includes(concepto.toLowerCase())
      );
      setFilteredConcepts(filtered);
      // Mostrar sugerencias solo si hay coincidencias y el usuario está escribiendo
      setShowSuggestions(filtered.length > 0 && concepto.length >= 2);
    } else {
      setShowSuggestions(false);
      setSelectedConcept(null);
    }
  }, [concepto, tipoMovimiento]);

  const handleConceptSelect = (conceptoSeleccionado: typeof conceptosMock[0]) => {
    setConcepto(conceptoSeleccionado.nombre);
    setSelectedConcept(conceptoSeleccionado);
    // Heredar naturaleza del concepto existente
    setNaturaleza(conceptoSeleccionado.categoria);
    if (conceptoSeleccionado.montoEstimado) {
      setMontoFormatted(formatNumberWithSeparators(conceptoSeleccionado.montoEstimado));
    }
    setShowSuggestions(false);
    // Focus en monto después de seleccionar concepto
    setTimeout(() => {
      montoInputRef.current?.focus();
    }, 100);
  };

  // Manejar blur del input concepto (cerrar sugerencias si no hay interacción)
  const handleConceptBlur = () => {
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concepto || !montoFormatted) return;

    const montoNum = parseFormattedNumber(montoFormatted);
    if (isNaN(montoNum) || montoNum <= 0) return;
    
    // Guardar TC usado
    if (moneda === 'ARS') {
      setLastUsedExchangeRate(tipoCambio);
    }

    // Calcular monto en USD según moneda y TC aplicado
    let montoArs: number;
    let montoUsd: number;
    
    if (moneda === 'USD') {
      // Si es USD, convertir a ARS usando TC actual para guardar
      const rate = getCurrentExchangeRate();
      montoArs = montoNum * rate;
      montoUsd = montoNum; // Ya está en USD
    } else {
      // Si es ARS, usar el TC editado por el usuario
      montoArs = montoNum;
      montoUsd = montoNum / tipoCambio;
    }

    // Trigger feedback visual
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 250);

    // Para ingresos, el estado siempre es 'pagado' (no se muestra en UI pero se guarda)
    const estadoFinal = tipoMovimiento === 'ingreso' ? 'pagado' : estado;

    // Si hay concepto seleccionado, usar ese (hereda naturaleza automáticamente)
    if (selectedConcept) {
      onAdd(
        selectedConcept.id, 
        selectedConcept.nombre,
        tipoMovimiento,
        montoArs, 
        selectedConcept.categoria, // Naturaleza heredada del concepto
        estadoFinal,
        moneda,
        moneda === 'ARS' ? tipoCambio : undefined,
        montoUsd
      );
    } else {
      // Si es nuevo concepto, usar la naturaleza seleccionada
      const nuevoConcepto = {
        id: `c-temp-${Date.now()}`,
        nombre: concepto,
        tipo: tipoMovimiento,
        categoria: naturaleza, // Naturaleza definida por el usuario
        recurrente: false,
      };
      onAdd(
        nuevoConcepto.id, 
        nuevoConcepto.nombre,
        tipoMovimiento,
        montoArs, 
        naturaleza, // Naturaleza definida para concepto nuevo
        estadoFinal,
        moneda,
        moneda === 'ARS' ? tipoCambio : undefined,
        montoUsd
      );
    }

    // Reset form con delay para feedback
    setTimeout(() => {
      setConcepto('');
      setMontoFormatted('');
      setMoneda('ARS');
      setTipoCambio(getInitialExchangeRate()); // Resetear a último usado o sugerido
      setEstado('pagado'); // Resetear estado (solo visible para egresos)
      setNaturaleza('variable'); // Resetear a sugerencia por defecto
      setSelectedConcept(null);
      // No resetear tipoMovimiento, mantener la última selección
      inputRef.current?.focus();
    }, 200);
  };

  // Calcular monto en USD para preview usando el TC editado
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

  // Resetear TC cuando cambia la moneda (solo si no hay último usado)
  useEffect(() => {
    if (moneda === 'ARS') {
      setTipoCambio(getInitialExchangeRate());
    }
  }, [moneda]);

  return (
    <FeedbackPulse trigger={justAdded} color="green" duration={250}>
      <Card padding="large">
        <div className="mb-4">
          <h2 className="text-heading-2 text-gray-text-primary mb-1">CARGAR GASTO / INGRESO</h2>
          <p className="text-body text-gray-text-tertiary mb-2">
            Ingresos y egresos de tu vida se cargan acá.
          </p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Movimiento: Ingreso / Egreso */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Tipo de movimiento</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento('ingreso');
                setConcepto('');
                setSelectedConcept(null);
              }}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-all duration-fast ${
                tipoMovimiento === 'ingreso'
                  ? 'bg-green-success text-white shadow-sm'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary hover:border-gray-border-visible'
              }`}
            >
              ◉ Ingreso
            </button>
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento('egreso');
                setConcepto('');
                setSelectedConcept(null);
              }}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-all duration-fast ${
                tipoMovimiento === 'egreso'
                  ? 'bg-red-error text-white shadow-sm'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary hover:border-gray-border-visible'
              }`}
            >
              ◯ Egreso
            </button>
          </div>
        </div>
        {/* Concepto híbrido: escribir libremente + sugerencias */}
        <div className="relative">
          <label className="block text-body text-gray-text-primary mb-1.5">Concepto</label>
          <input
            ref={inputRef}
            type="text"
            value={concepto}
            onChange={(e) => {
              setConcepto(e.target.value);
              // Si el usuario escribe, deseleccionar concepto previo y resetear naturaleza
              if (selectedConcept && e.target.value !== selectedConcept.nombre) {
                setSelectedConcept(null);
                setNaturaleza('variable'); // Resetear a sugerencia por defecto
              }
            }}
            onFocus={() => {
              if (filteredConcepts.length > 0 && concepto.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onBlur={handleConceptBlur}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
            placeholder="Escribe el concepto o busca uno existente..."
            required
          />
          {/* Sugerencias livianas - No bloquean escritura */}
          {showSuggestions && filteredConcepts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-subtle border border-gray-border rounded-card shadow-card max-h-48 overflow-y-auto">
              {filteredConcepts.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleConceptSelect(c)}
                  onMouseDown={(e) => e.preventDefault()} // Prevenir blur antes del click
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50/30 transition-colors duration-fast"
                >
                  <div className="text-body text-gray-text-primary font-medium">{c.nombre}</div>
                  {c.montoEstimado && (
                    <div className="text-body-small text-gray-text-tertiary">
                      {formatCurrencyUSD(convertArsToUsdCurrent(c.montoEstimado))}
                    </div>
                  )}
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
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast font-mono"
              placeholder="0"
              required
            />
            {/* Feedback de tipo de cambio cuando moneda = ARS */}
            {moneda === 'ARS' && montoFormatted && montoNum > 0 && (
              <div className="mt-1.5 text-body-small text-gray-text-tertiary">
                ≈ <span className="font-medium text-gray-text-secondary">{formatCurrencyUSD(montoUsdPreview)}</span>
                {' '}
                <span className="text-gray-text-disabled">(con TC {tipoCambio.toLocaleString('es-AR')})</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-body text-gray-text-primary mb-1.5">Moneda</label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value as 'ARS' | 'USD')}
              className="px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
            >
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* TC aplicado cuando moneda = ARS */}
        {moneda === 'ARS' && (
          <div>
            <label className="block text-body text-gray-text-primary mb-1.5">
              TC aplicado
            </label>
            <input
              type="number"
              value={tipoCambio}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setTipoCambio(value);
                  setLastUsedExchangeRate(value);
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
              placeholder="1000"
              min="1"
              step="1"
            />
            <div className="mt-1.5 text-body-small text-gray-text-disabled">
              Precargado con el TC sugerido del día. Puedes editarlo.
            </div>
          </div>
        )}

        {/* Naturaleza - Solo para conceptos nuevos */}
        {!selectedConcept && (
          <div>
            <label className="block text-body text-gray-text-primary mb-1.5">
              Naturaleza
            </label>
            <select
              value={naturaleza}
              onChange={(e) => setNaturaleza(e.target.value as 'fijo' | 'variable' | 'extraordinario')}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
            >
              <option value="fijo">Fijo</option>
              <option value="variable">Variable</option>
              <option value="extraordinario">Extraordinario</option>
            </select>
            <div className="mt-1.5 text-body-small text-gray-text-disabled">
              Si usas un concepto existente, heredará su naturaleza automáticamente.
            </div>
          </div>
        )}

        {/* Estado: Pagado / Pendiente - Solo para egresos */}
        {tipoMovimiento === 'egreso' && (
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

        {/* Botón Agregar */}
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
        >
          {tipoMovimiento === 'ingreso' ? 'Agregar ingreso' : 'Agregar egreso'}
        </button>
      </form>
      </Card>
    </FeedbackPulse>
  );
}

