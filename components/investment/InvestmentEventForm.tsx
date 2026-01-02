'use client';

import { useState, useRef, useEffect } from 'react';
import Card from '../Card';
import { type Inversion } from '@/mock/inversiones';
import CurrencyDisplay from '../CurrencyDisplay';
import { getInitialExchangeRate, formatCurrencyUSD, setLastUsedExchangeRate } from '@/mock/exchange-rates';
import { formatNumberWithSeparators, parseFormattedNumber, formatNumberWithLocale } from '@/utils/number-format';
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

  const montoNum = parseFormattedNumber(montoFormatted);
  const montoUsdPreview = montoFormatted && !isNaN(montoNum) && montoNum > 0
    ? (moneda === 'ARS' ? montoNum / tipoCambio : montoNum)
    : 0;

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithSeparators(e.target.value);
    setMontoFormatted(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inversion || !montoFormatted) return;
    
    const montoNum = parseFormattedNumber(montoFormatted);
    if (isNaN(montoNum) || montoNum <= 0) return;

    // Calcular monto en USD
    const montoUsd = moneda === 'ARS' ? montoNum / tipoCambio : montoNum;
    
    // Guardar TC usado
    if (moneda === 'ARS') {
      setLastUsedExchangeRate(tipoCambio);
    }

    try {
      // Convertir tipoEvento: 'resultado' no existe en la API, usar 'ajuste'
      const eventType = tipoEvento === 'resultado' ? 'ajuste' : tipoEvento;
      
      await createInvestmentEvent(inversion, {
        type: eventType as 'aporte' | 'retiro' | 'ajuste',
        amountUSD: montoUsd,
        date: fecha,
        note: nota || null,
      });

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
          <h2 className="text-heading-2 text-gray-text-primary mb-1">Registrar evento</h2>
          <p className="text-body text-gray-text-tertiary">
            Registra un cambio real en una inversión. Este evento impactará las proyecciones hacia adelante.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Evento */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Tipo de evento</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipoEvento('aporte')}
              className={`px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipoEvento === 'aporte'
                  ? 'bg-green-success text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Aporte
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('retiro')}
              className={`px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipoEvento === 'retiro'
                  ? 'bg-orange-warning text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Retiro
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('ajuste')}
              className={`px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipoEvento === 'ajuste'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Ajuste
            </button>
            <button
              type="button"
              onClick={() => setTipoEvento('resultado')}
              className={`px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipoEvento === 'resultado'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Resultado
            </button>
          </div>
        </div>

        {/* Inversión - REQUERIDA */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">
            Inversión <span className="text-orange-warning">*</span>
          </label>
          {inversiones.length === 0 ? (
            <div className="px-4 py-2.5 border border-orange-warning/30 bg-orange-warning/5 rounded-input text-body text-gray-text-primary">
              No hay inversiones creadas. Crea una inversión antes de registrar eventos.
            </div>
          ) : (
            <select
              value={inversion}
              onChange={(e) => setInversion(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
              required
            >
              <option value="">Seleccionar inversión...</option>
              {inversiones.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.nombre} ({inv.tipo === 'financiera' ? 'Financiera' : 'Inmobiliaria'})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            required
          />
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
              required
            />
            {moneda === 'ARS' && montoFormatted && montoNum > 0 && (
              <div className="mt-1.5 text-body-small text-gray-text-tertiary">
                ≈ {formatCurrencyUSD(montoUsdPreview)} (con TC {formatNumberWithLocale(tipoCambio)})
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
              type="number"
              value={tipoCambio}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  setTipoCambio(value);
                  setLastUsedExchangeRate(value);
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
              placeholder="1000"
              min="1"
              step="1"
            />
          </div>
        )}

        {/* Nota */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Nota (opcional)</label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
            rows={3}
            placeholder="Contexto del evento..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-divider">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
          >
            Registrar evento
          </button>
        </div>
      </form>
    </Card>
  );
}

