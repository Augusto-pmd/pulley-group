'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import FeedbackPulse from '../animations/FeedbackPulse';
import { getConcepts } from '@/lib/api';
import { convertArsToUsdCurrent, getCurrentExchangeRate, getInitialExchangeRate, setLastUsedExchangeRate } from '@/mock/exchange-rates';
import { formatNumberWithSeparators, parseNumberAR, getCursorPosition, formatNumberAR, formatCurrencyAR } from '@/utils/number-format';

interface QuickAddFormProps {
  onAdd: (
    conceptoId: string, 
    conceptoNombre: string,
    tipo: 'ingreso' | 'egreso',
    monto: number, 
    categoria: 'fijo' | 'variable' | 'extraordinario', 
    estado: 'pagado' | 'pendiente',
    monedaOriginal: 'ARS' | 'USD',
    montoUsd: number,
    tipoCambioAplicado?: number
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
  const [allConcepts, setAllConcepts] = useState<Array<{ id: string; nombre: string; tipo: 'ingreso' | 'egreso'; categoria: 'fijo' | 'variable' | 'extraordinario' }>>([]);
  const [filteredConcepts, setFilteredConcepts] = useState<Array<{ id: string; nombre: string; tipo: 'ingreso' | 'egreso'; categoria: 'fijo' | 'variable' | 'extraordinario' }>>([]);
  const [selectedConcept, setSelectedConcept] = useState<{ id: string; nombre: string; tipo: 'ingreso' | 'egreso'; categoria: 'fijo' | 'variable' | 'extraordinario' } | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar conceptos desde la API
  useEffect(() => {
    async function loadConcepts() {
      try {
        const apiConcepts = await getConcepts();
        // Mapear ApiConcept al formato esperado
        const mappedConcepts = apiConcepts.map((c) => ({
          id: c.id,
          nombre: c.name,
          tipo: c.type,
          categoria: c.nature,
        }));
        setAllConcepts(mappedConcepts);
      } catch (error) {
        console.error('Error loading concepts:', error);
        setAllConcepts([]);
      }
    }
    loadConcepts();
  }, []);

  useEffect(() => {
    if (concepto.length > 0) {
      // Filtrar conceptos por tipo de movimiento
      const filtered = allConcepts.filter((c) =>
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
  }, [concepto, tipoMovimiento, allConcepts]);

  const handleConceptSelect = (conceptoSeleccionado: { id: string; nombre: string; tipo: 'ingreso' | 'egreso'; categoria: 'fijo' | 'variable' | 'extraordinario' }) => {
    setConcepto(conceptoSeleccionado.nombre);
    setSelectedConcept(conceptoSeleccionado);
    // Heredar naturaleza del concepto existente
    setNaturaleza(conceptoSeleccionado.categoria);
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
    console.log('[VidaMensual] SUBMIT_HANDLER_CALLED', { concepto, montoFormatted, tipoMovimiento });
    e.preventDefault();
    setError(null);
    
    // Validación JS
    if (!concepto || concepto.trim() === '') {
      setError('El concepto es obligatorio');
      console.log('[VidaMensual] EARLY_RETURN: Validación fallida - concepto vacío');
      return;
    }
    
    if (!montoFormatted || montoFormatted.trim() === '') {
      setError('El monto es obligatorio');
      console.log('[VidaMensual] EARLY_RETURN: Validación fallida - monto vacío');
      return;
    }

    const montoNum = parseNumberAR(montoFormatted) ?? 0;
    if (isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser mayor a 0');
      console.log('[VidaMensual] EARLY_RETURN: Validación fallida - monto inválido', { montoNum });
      return;
    }
    
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
      console.log('[VidaMensual] PRE_API_CALL: onAdd with selectedConcept', { selectedConcept: selectedConcept.nombre, montoArs, montoUsd });
      onAdd(
        selectedConcept.id, 
        selectedConcept.nombre,
        tipoMovimiento,
        montoArs, 
        selectedConcept.categoria, // Naturaleza heredada del concepto
        estadoFinal,
        moneda,
        montoUsd,
        moneda === 'ARS' ? tipoCambio : undefined
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
      console.log('[VidaMensual] PRE_API_CALL: onAdd with newConcept', { nuevoConcepto, montoArs, montoUsd });
      onAdd(
        nuevoConcepto.id, 
        nuevoConcepto.nombre,
        tipoMovimiento,
        montoArs, 
        naturaleza, // Naturaleza definida para concepto nuevo
        estadoFinal,
        moneda,
        montoUsd,
        moneda === 'ARS' ? tipoCambio : undefined
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
  const montoNum = parseNumberAR(montoFormatted) ?? 0;
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
          <h2 className="text-heading-2 text-text-primary mb-1">CARGAR GASTO / INGRESO</h2>
          <p className="text-body text-text-secondary mb-2">
            Ingresos y egresos de tu vida se cargan acá.
          </p>
        </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Movimiento: Ingreso / Egreso */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Tipo de movimiento</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento('ingreso');
                setConcepto('');
                setSelectedConcept(null);
              }}
              className="flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-all duration-fast"
              style={{
                backgroundColor: tipoMovimiento === 'ingreso' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoMovimiento === 'ingreso' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoMovimiento !== 'ingreso') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoMovimiento !== 'ingreso') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento('egreso');
                setConcepto('');
                setSelectedConcept(null);
              }}
              className="flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-all duration-fast"
              style={{
                backgroundColor: tipoMovimiento === 'egreso' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoMovimiento === 'egreso' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoMovimiento !== 'egreso') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoMovimiento !== 'egreso') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Egreso
            </button>
          </div>
        </div>
        {/* Concepto híbrido: escribir libremente + sugerencias */}
        <div className="relative">
          <label className="block text-body text-text-primary mb-1.5">Concepto</label>
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
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              // Materialidad en foco - luz cálida filtrada
              e.currentTarget.style.borderColor = 'rgba(181, 154, 106, 0.5)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.2)';
              e.currentTarget.style.backgroundImage = 'radial-gradient(circle at top left, rgba(181, 154, 106, 0.1) 0%, transparent 50%)';
              e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(181, 154, 106, 0.1), 0 0 20px rgba(181, 154, 106, 0.15)';
              if (filteredConcepts.length > 0 && concepto.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              e.currentTarget.style.backgroundImage = 'none';
              e.currentTarget.style.boxShadow = 'none';
              handleConceptBlur();
            }}
            placeholder="Escribe el concepto o busca uno existente..."
            />
          {/* Sugerencias livianas - No bloquean escritura */}
          {showSuggestions && filteredConcepts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 rounded-card max-h-48 overflow-y-auto" style={{
              // Capa translúcida - plano de información secundaria
              backgroundColor: 'rgba(31, 42, 51, 0.9)',
              backgroundImage: 'radial-gradient(circle at top left, rgba(181, 154, 106, 0.05) 0%, transparent 50%)',
              border: '1px solid rgba(181, 154, 106, 0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)',
            }}>
              {filteredConcepts.slice(0, 5).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleConceptSelect(c)}
                  onMouseDown={(e) => e.preventDefault()} // Prevenir blur antes del click
                  className="w-full text-left px-4 py-2.5 transition-colors duration-fast"
                  style={{ color: '#F5F2EC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="text-body font-medium">{c.nombre}</div>
                  <div className="text-body-small text-text-secondary capitalize">
                    {c.categoria}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Monto y Moneda */}
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div>
            <label className="block text-body text-text-primary mb-1.5">Monto</label>
            <input
              ref={montoInputRef}
              type="text"
              inputMode="decimal"
              value={montoFormatted}
              onChange={handleMontoChange}
              className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast font-mono"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B59A6A';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
              placeholder="0"
              />
            {/* Feedback de tipo de cambio cuando moneda = ARS */}
            {moneda === 'ARS' && montoFormatted && montoNum > 0 && (
              <div className="mt-1.5 text-body-small text-text-secondary">
                ≈ <span className="font-medium">{formatCurrencyAR(montoUsdPreview, 2)}</span>
                {' '}
                <span style={{ opacity: 0.6 }}>(con TC {formatNumberAR(tipoCambio, 2)})</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-body text-text-primary mb-1.5">Moneda</label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value as 'ARS' | 'USD')}
              className="px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B59A6A';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
            >
              <option value="ARS" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>ARS</option>
              <option value="USD" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>USD</option>
            </select>
          </div>
        </div>

        {/* TC aplicado cuando moneda = ARS */}
        {moneda === 'ARS' && (
          <div>
            <label className="block text-body text-text-primary mb-1.5">
              TC aplicado
            </label>
            <input
              type="text"
              value={tipoCambio.toString()}
              onChange={(e) => {
                const value = parseNumberAR(e.target.value);
                if (value !== null && value > 0) {
                  setTipoCambio(value);
                  setLastUsedExchangeRate(value);
                } else if (e.target.value === '') {
                  // Permitir campo vacío temporalmente
                }
              }}
              className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B59A6A';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
              placeholder="1000"
            />
            <div className="mt-1.5 text-body-small text-text-secondary" style={{ opacity: 0.6 }}>
              Precargado con el TC sugerido del día. Puedes editarlo.
            </div>
          </div>
        )}

        {/* Naturaleza - Solo para conceptos nuevos */}
        {!selectedConcept && (
          <div>
            <label className="block text-body text-text-primary mb-1.5">
              Naturaleza
            </label>
            <select
              value={naturaleza}
              onChange={(e) => setNaturaleza(e.target.value as 'fijo' | 'variable' | 'extraordinario')}
              className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#B59A6A';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.target.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
            >
              <option value="fijo" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Fijo</option>
              <option value="variable" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Variable</option>
              <option value="extraordinario" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Extraordinario</option>
            </select>
            <div className="mt-1.5 text-body-small text-text-secondary" style={{ opacity: 0.6 }}>
              Si usas un concepto existente, heredará su naturaleza automáticamente.
            </div>
          </div>
        )}

        {/* Estado: Pagado / Pendiente - Solo para egresos */}
        {tipoMovimiento === 'egreso' && (
          <div>
            <label className="block text-body text-text-primary mb-1.5">Estado</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEstado('pagado')}
                className="flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
                style={{
                  backgroundColor: estado === 'pagado' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                  color: '#F5F2EC',
                  border: estado === 'pagado' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (estado !== 'pagado') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (estado !== 'pagado') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                  }
                }}
              >
                Pagado
              </button>
              <button
                type="button"
                onClick={() => setEstado('pendiente')}
                className="flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
                style={{
                  backgroundColor: estado === 'pendiente' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                  color: '#F5F2EC',
                  border: estado === 'pendiente' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (estado !== 'pendiente') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (estado !== 'pendiente') {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                  }
                }}
              >
                Pendiente
              </button>
            </div>
          </div>
        )}

        {/* Botón Agregar */}
        <button
          type="submit"
          className="w-full px-4 py-2.5 text-body font-medium rounded-button transition-colors duration-fast"
          style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0885A'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B59A6A'}
        >
          {tipoMovimiento === 'ingreso' ? 'Agregar ingreso' : 'Agregar egreso'}
        </button>
      </form>
      </Card>
    </FeedbackPulse>
  );
}

