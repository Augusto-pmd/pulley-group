'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '../Card';
import { type Inversion } from '@/mock/inversiones';
import CurrencyDisplay from '../CurrencyDisplay';
import { getInitialExchangeRate, setLastUsedExchangeRate } from '@/mock/exchange-rates';
import { formatNumberWithSeparators, parseNumberAR, formatNumberAR, formatCurrencyAR } from '@/utils/number-format';
import { getInvestments, createInvestmentEvent, type ApiInvestment } from '@/lib/api';

interface InvestmentEventFormProps {
  investmentId?: string | null;
  onClose: () => void;
  onSave: () => void;
}

export default function InvestmentEventForm({ investmentId, onClose, onSave }: InvestmentEventFormProps) {
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [tipoEvento, setTipoEvento] = useState<'aporte' | 'retiro' | 'ajuste' | 'resultado'>('aporte');
  const [inversion, setInversion] = useState<string>(investmentId || '');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  const [montoFormatted, setMontoFormatted] = useState<string>('');
  const [moneda, setMoneda] = useState<'ARS' | 'USD'>('ARS');
  const [tipoCambio, setTipoCambio] = useState<number>(getInitialExchangeRate());
  const [nota, setNota] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const montoInputRef = useRef<HTMLInputElement>(null);

  // Cargar inversiones desde la API
  useEffect(() => {
    async function loadInvestments() {
      try {
        const apiInvestments = await getInvestments();
        // Transformar a formato Inversion para compatibilidad
        const transformed: Inversion[] = apiInvestments.map((apiInv: ApiInvestment) => ({
          id: apiInv.id,
          nombre: apiInv.name,
          tipo: apiInv.type,
          fechaInicio: apiInv.startDate.split('T')[0],
          montoObjetivo: apiInv.targetAmountUSD,
          plazoEstimado: 60,
          tipoRetorno: 'mixta',
          estadoFiscal: 'declarado',
          fechaCreacion: apiInv.startDate.split('T')[0],
        }));
        setInversiones(transformed);
      } catch (err) {
        console.error('Error loading investments:', err);
      }
    }

    loadInvestments();
  }, []);

  const montoNum = parseNumberAR(montoFormatted) ?? 0;
  const montoUsdPreview = montoFormatted && !isNaN(montoNum) && montoNum > 0
    ? (moneda === 'ARS' ? montoNum / tipoCambio : montoNum)
    : 0;

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithSeparators(e.target.value);
    setMontoFormatted(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[InvestmentEvent] SUBMIT_HANDLER_CALLED', { inversion, montoFormatted, tipoEvento, fecha, moneda });
    e.preventDefault();
    setError(null);
    
    // Validación JS
    if (!inversion || inversion.trim() === '') {
      setError('Debe seleccionar una inversión');
      console.log('[InvestmentEvent] EARLY_RETURN: Validación fallida - inversión vacía');
      return;
    }
    
    if (!montoFormatted || montoFormatted.trim() === '') {
      setError('El monto es obligatorio');
      console.log('[InvestmentEvent] EARLY_RETURN: Validación fallida - monto vacío');
      return;
    }

    const montoNum = parseNumberAR(montoFormatted) ?? 0;
    if (isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser mayor a 0');
      console.log('[InvestmentEvent] EARLY_RETURN: montoNum inválido', { montoNum });
      return;
    }

    // Calcular monto en USD
    const montoUsd = moneda === 'ARS' ? montoNum / tipoCambio : montoNum;
    
    // Guardar TC usado
    if (moneda === 'ARS') {
      setLastUsedExchangeRate(tipoCambio);
    }

    try {
      // Convertir tipoEvento: 'resultado' no existe en la API, usar 'ajuste'
      const eventType = tipoEvento === 'resultado' ? 'ajuste' : tipoEvento;
      const eventData = {
        type: eventType as 'aporte' | 'retiro' | 'ajuste',
        amountUSD: montoUsd,
        date: fecha,
        note: nota || null,
      };
      console.log('[InvestmentEvent] POST_API_CALL: createInvestmentEvent', { investmentId: inversion, eventData });
      const response = await createInvestmentEvent(inversion, eventData);
      console.log('[InvestmentEvent] POST_API_RESPONSE', response);

      onSave();
    } catch (err: any) {
      console.error('Error creating investment event:', err);
      alert(err.message || 'Error al registrar evento');
    }
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-2 text-text-primary mb-1">Registrar evento</h2>
          <p className="text-body text-text-secondary">
            Registra un cambio real en una inversión. Este evento impactará las proyecciones hacia adelante.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-body transition-colors duration-fast"
          style={{ color: '#8E8E8A' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
        >
          ✕
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4" data-testid="modal-form">
        {/* Tipo de Evento */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Tipo de evento</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipoEvento('aporte')}
              className="px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
              style={{
                backgroundColor: tipoEvento === 'aporte' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoEvento === 'aporte' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoEvento !== 'aporte') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoEvento !== 'aporte') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Aporte
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('retiro')}
              className="px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
              style={{
                backgroundColor: tipoEvento === 'retiro' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoEvento === 'retiro' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoEvento !== 'retiro') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoEvento !== 'retiro') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Retiro
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('ajuste')}
              className="px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
              style={{
                backgroundColor: tipoEvento === 'ajuste' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoEvento === 'ajuste' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoEvento !== 'ajuste') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoEvento !== 'ajuste') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Ajuste
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('resultado')}
              className="px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast"
              style={{
                backgroundColor: tipoEvento === 'resultado' ? '#1F2A33' : 'rgba(31, 42, 51, 0.1)',
                color: '#F5F2EC',
                border: tipoEvento === 'resultado' ? 'none' : '1px solid rgba(142, 142, 138, 0.2)',
              }}
              onMouseEnter={(e) => {
                if (tipoEvento !== 'resultado') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (tipoEvento !== 'resultado') {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                }
              }}
            >
              Resultado
            </button>
          </div>
        </div>

        {/* Inversión - REQUERIDA */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">
            Inversión <span style={{ color: '#8E8E8A' }}>*</span>
          </label>
          {inversiones.length === 0 ? (
            <div className="px-4 py-2.5 rounded-input text-body text-text-primary" style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}>
              No hay inversiones creadas. Crea una inversión antes de registrar eventos.
            </div>
          ) : (
            <select
              value={inversion}
              onChange={(e) => setInversion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#B59A6A';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
            >
              <option value="" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Seleccionar inversión...</option>
              {inversiones.map((inv) => (
                <option key={inv.id} value={inv.id} style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>
                  {inv.nombre} ({inv.tipo === 'financiera' ? 'Financiera' : 'Inmobiliaria'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
          />
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
              className="w-full px-4 py-2.5 rounded-input text-body font-mono transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#B59A6A';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
              placeholder="0"
            />
            {moneda === 'ARS' && montoFormatted && montoNum > 0 && (
              <div className="mt-1.5 text-body-small text-text-secondary">
                ≈ {formatCurrencyAR(montoUsdPreview, 2)} (con TC {formatNumberAR(tipoCambio, 2)})
              </div>
            )}
          </div>
          <div>
            <label className="block text-body text-text-primary mb-1.5">Moneda</label>
            <select
              value={moneda}
              onChange={(e) => {
                setMoneda(e.target.value as 'ARS' | 'USD');
                if (e.target.value === 'ARS') {
                  setTipoCambio(getInitialExchangeRate());
                }
              }}
              className="px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#B59A6A';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
            >
              <option value="ARS" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>ARS</option>
              <option value="USD" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>USD</option>
            </select>
          </div>
        </div>

        {/* TC aplicado (si ARS) */}
        {moneda === 'ARS' && (
          <div>
            <label className="block text-body text-text-primary mb-1.5">TC aplicado</label>
            <input
              type="text"
              value={tipoCambio.toString()}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setTipoCambio(value);
                  setLastUsedExchangeRate(value);
                }
              }}
              className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
              style={{
                border: '1px solid rgba(142, 142, 138, 0.2)',
                color: '#F5F2EC',
                backgroundColor: 'rgba(31, 42, 51, 0.1)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#B59A6A';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
              }}
              placeholder="1000"
            />
          </div>
        )}

        {/* Nota */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Nota (opcional)</label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body resize-none transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            rows={3}
            placeholder="Contexto del evento..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-body transition-colors duration-fast"
            style={{ color: '#8E8E8A' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-body font-medium rounded-button transition-colors duration-fast"
            style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0885A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B59A6A'}
          >
            Registrar evento
          </button>
        </div>
      </form>
    </Card>
  );
}

