'use client';

import { useState, useRef } from 'react';
import Card from '../Card';
import { type TipoInversion, type TipoRetorno, type EstadoFiscalInversion } from '@/mock/inversiones';
import { formatNumberWithSeparators, parseFormattedNumber } from '@/utils/number-format';
import { createInvestment } from '@/lib/api';

interface AddInvestmentFormProps {
  onClose: () => void;
  onSave: () => void;
}

export default function AddInvestmentForm({ onClose, onSave }: AddInvestmentFormProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoInversion>('financiera');
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split('T')[0]);
  const [montoObjetivoFormatted, setMontoObjetivoFormatted] = useState<string>('');
  const [plazoEstimado, setPlazoEstimado] = useState<string>('');
  const [tipoRetorno, setTipoRetorno] = useState<TipoRetorno>('mixta');
  const [estadoFiscal, setEstadoFiscal] = useState<EstadoFiscalInversion>('no_declarado');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState<string | null>(null);
  const montoInputRef = useRef<HTMLInputElement>(null);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithSeparators(e.target.value);
    setMontoObjetivoFormatted(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[Inversiones] SUBMIT_HANDLER_CALLED', { nombre, montoObjetivoFormatted, plazoEstimado, tipo, fechaInicio });
    e.preventDefault();
    setError(null);
    
    // Validación JS
    if (!nombre || nombre.trim() === '') {
      setError('El nombre es obligatorio');
      console.log('[Inversiones] EARLY_RETURN: Validación fallida - nombre vacío');
      return;
    }
    
    if (!montoObjetivoFormatted || montoObjetivoFormatted.trim() === '') {
      setError('El monto objetivo es obligatorio');
      console.log('[Inversiones] EARLY_RETURN: Validación fallida - monto vacío');
      return;
    }
    
    if (!plazoEstimado || plazoEstimado.trim() === '') {
      setError('El plazo estimado es obligatorio');
      console.log('[Inversiones] EARLY_RETURN: Validación fallida - plazo vacío');
      return;
    }

    const montoObjetivo = parseFormattedNumber(montoObjetivoFormatted);
    const plazoNum = parseInt(plazoEstimado);
    
    if (isNaN(montoObjetivo) || montoObjetivo <= 0) {
      setError('El monto objetivo debe ser mayor a 0');
      console.log('[Inversiones] EARLY_RETURN: montoObjetivo inválido', { montoObjetivo });
      return;
    }
    if (isNaN(plazoNum) || plazoNum <= 0) {
      setError('El plazo estimado debe ser mayor a 0');
      console.log('[Inversiones] EARLY_RETURN: plazoNum inválido', { plazoNum });
      return;
    }

    try {
      // Crear la inversión en la API
      const investmentData = {
        name: nombre,
        type: tipo,
        startDate: fechaInicio,
        targetAmountUSD: montoObjetivo,
      };
      console.log('[Inversiones] POST_API_CALL: createInvestment', investmentData);
      const response = await createInvestment(investmentData);
      console.log('[Inversiones] POST_API_RESPONSE', response);

      onSave();
    } catch (err: any) {
      console.error('Error creating investment:', err);
      alert(err.message || 'Error al crear inversión');
    }
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-2 text-gray-text-primary mb-1">Crear inversión</h2>
          <p className="text-body text-gray-text-tertiary">
            Define un proyecto de inversión. Sin inversión creada, no se pueden registrar eventos.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
        >
          ✕
        </button>
      </div>

      <form noValidate onSubmit={handleSubmit} className="space-y-4" data-testid="modal-form">
        {/* Nombre */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
            placeholder="Ej: Fondo Renta Variable"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Tipo</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTipo('financiera')}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipo === 'financiera'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Financiera
            </button>
            <button
              type="button"
              onClick={() => setTipo('inmobiliaria')}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                tipo === 'inmobiliaria'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Inmobiliaria (Proyecto)
            </button>
          </div>
        </div>

        {/* Fecha de inicio */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Fecha de inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
          />
        </div>

        {/* Monto objetivo */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Monto objetivo (USD)</label>
          <input
            ref={montoInputRef}
            type="text"
            inputMode="decimal"
            value={montoObjetivoFormatted}
            onChange={handleMontoChange}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast font-mono"
            placeholder="0"
          />
          <div className="mt-1.5 text-body-small text-gray-text-disabled">
            Monto objetivo total del proyecto en USD
          </div>
        </div>

        {/* Plazo estimado */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Plazo estimado (meses)</label>
          <input
            type="text"
            value={plazoEstimado}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d+$/.test(value)) {
                setPlazoEstimado(value);
              }
            }}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
            placeholder="60"
          />
          <div className="mt-1.5 text-body-small text-gray-text-disabled">
            Horizonte estimado del proyecto en meses
          </div>
        </div>

        {/* Tipo de retorno */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Tipo de retorno</label>
          <select
            value={tipoRetorno}
            onChange={(e) => setTipoRetorno(e.target.value as TipoRetorno)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 transition-colors duration-fast"
          >
            <option value="renta">Renta</option>
            <option value="capitalizacion">Capitalización</option>
            <option value="mixta">Mixta</option>
          </select>
          <div className="mt-1.5 text-body-small text-gray-text-disabled">
            Renta: ingresos periódicos. Capitalización: crecimiento del capital. Mixta: ambos.
          </div>
        </div>

        {/* Estado fiscal - OBLIGATORIO */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">
            Estado fiscal <span className="text-orange-warning">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEstadoFiscal('declarado')}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                estadoFiscal === 'declarado'
                  ? 'bg-green-success text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              Declarado
            </button>
            <button
              type="button"
              onClick={() => setEstadoFiscal('no_declarado')}
              className={`flex-1 px-4 py-2.5 rounded-input text-body font-medium transition-colors duration-fast ${
                estadoFiscal === 'no_declarado'
                  ? 'bg-orange-warning text-white'
                  : 'bg-white/50 border border-gray-border text-gray-text-tertiary hover:text-gray-text-primary'
              }`}
            >
              No declarado
            </button>
          </div>
          <div className="mt-1.5 text-body-small text-gray-text-disabled">
            Impacta en patrimonio declarado y Vista Contador
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Observaciones (opcional)</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
            rows={3}
            placeholder="Notas adicionales sobre la inversión..."
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
            Crear inversión
          </button>
        </div>
      </form>
    </Card>
  );
}

