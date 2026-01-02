'use client';

import { useState } from 'react';
import Card from '../Card';
import { formatNumberWithSeparators, parseFormattedNumber, formatCurrency } from '@/utils/number-format';
import { saveEmma, getConcepts, getOrCreateMonth, createMovement } from '@/lib/api';

interface EmmaInitFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function EmmaInitForm({ onComplete, onCancel }: EmmaInitFormProps) {
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });
  const [capitalInicial, setCapitalInicial] = useState<string>('');
  const [capitalInicialFormatted, setCapitalInicialFormatted] = useState<string>('');
  const [aportePeriodico, setAportePeriodico] = useState<string>('');
  const [aportePeriodicoFormatted, setAportePeriodicoFormatted] = useState<string>('');
  const [frecuencia, setFrecuencia] = useState<'mensual' | 'anual'>('mensual');
  const [tasaEsperada, setTasaEsperada] = useState<string>('');
  const [horizonte, setHorizonte] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapitalInicialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumberWithSeparators(value);
    setCapitalInicialFormatted(formatted);
    setCapitalInicial(value);
  };

  const handleAportePeriodicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumberWithSeparators(value);
    setAportePeriodicoFormatted(formatted);
    setAportePeriodico(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validar fecha (no puede ser futura)
      const fecha = new Date(fechaInicio);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fecha > hoy) {
        setError('La fecha de inicio no puede ser futura');
        setLoading(false);
        return;
      }

      // Validar capital inicial
      const capitalInicialNum = parseFormattedNumber(capitalInicialFormatted);
      if (capitalInicialNum < 0) {
        setError('El capital inicial debe ser mayor o igual a 0');
        setLoading(false);
        return;
      }

      // Validar aporte periódico
      const aportePeriodicoNum = parseFormattedNumber(aportePeriodicoFormatted);
      if (aportePeriodicoNum < 0) {
        setError('El aporte periódico debe ser mayor o igual a 0');
        setLoading(false);
        return;
      }

      // Validar tasa esperada
      const tasaEsperadaNum = parseFloat(tasaEsperada);
      if (isNaN(tasaEsperadaNum) || tasaEsperadaNum < 0 || tasaEsperadaNum > 100) {
        setError('La tasa esperada debe ser un número entre 0 y 100');
        setLoading(false);
        return;
      }

      // Validar horizonte
      const horizonteNum = parseInt(horizonte);
      if (isNaN(horizonteNum) || horizonteNum < 1 || !Number.isInteger(horizonteNum)) {
        setError('El horizonte debe ser un número entero mayor a 0');
        setLoading(false);
        return;
      }

      // 1. Guardar configuración de Emma (supuestos)
      await saveEmma({
        startDate: fechaInicio,
        expectedRate: tasaEsperadaNum,
        horizon: horizonteNum,
        contributionFrequency: frecuencia,
      });

      // 2. Si capital inicial > 0, crear Movement real
      if (capitalInicialNum > 0) {
        // Obtener concepto "Aporte fondo Emma"
        const concepts = await getConcepts();
        const emmaConcept = concepts.find(c => c.name === 'Aporte fondo Emma');
        
        if (!emmaConcept) {
          throw new Error('No se encontró el concepto "Aporte fondo Emma". Por favor, recarga la página.');
        }

        // Obtener o crear el mes
        const fecha = new Date(fechaInicio);
        const year = fecha.getFullYear();
        const month = fecha.getMonth() + 1;
        const monthRecord = await getOrCreateMonth(year, month);

        // Crear Movement real
        await createMovement({
          type: 'ingreso',
          amountUSD: capitalInicialNum,
          currencyOriginal: 'USD',
          exchangeRate: null,
          date: fechaInicio,
          status: 'pagado',
          conceptId: emmaConcept.id,
          monthId: monthRecord.id,
        });
      }

      // 3. Completar (refrescar página)
      onComplete();
    } catch (err: any) {
      console.error('Error iniciando Emma:', err);
      setError(err.message || 'Error al iniciar el fondo Emma');
      setLoading(false);
    }
  };

  return (
    <Card padding="large">
      <div className="mb-6">
        <h2 className="text-heading-2 text-gray-text-primary mb-2">
          Iniciar Fondo Emma
        </h2>
        <p className="text-body text-gray-text-tertiary">
          Configura los supuestos del fondo. El capital inicial se registrará como un movimiento real en Vida Mensual.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-body text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha de inicio */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Fecha de inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          />
        </div>

        {/* Capital inicial */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Capital inicial (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={capitalInicialFormatted}
            onChange={handleCapitalInicialChange}
            placeholder="0"
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 font-mono"
          />
          <p className="mt-1 text-caption text-gray-text-tertiary">
            Se creará un movimiento real en Vida Mensual
          </p>
        </div>

        {/* Aporte periódico */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Aporte periódico (USD)
          </label>
          <input
            type="text"
            value={aportePeriodicoFormatted}
            onChange={handleAportePeriodicoChange}
            placeholder="0"
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 font-mono"
          />
        </div>

        {/* Frecuencia */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Frecuencia
          </label>
          <select
            value={frecuencia}
            onChange={(e) => setFrecuencia(e.target.value as 'mensual' | 'anual')}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          >
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        {/* Tasa esperada */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Tasa esperada (% anual) <span className="text-red-500">*</span>
            <span className="ml-2 text-caption text-gray-text-tertiary">(supuesto)</span>
          </label>
          <input
            type="number"
            value={tasaEsperada}
            onChange={(e) => setTasaEsperada(e.target.value)}
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          />
        </div>

        {/* Horizonte */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Horizonte (años) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={horizonte}
            onChange={(e) => setHorizonte(e.target.value)}
            placeholder="25"
            min="1"
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-button text-body font-medium hover:bg-blue-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando...' : 'Iniciar fondo'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-border rounded-button text-body text-gray-text-primary hover:bg-gray-50 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Card>
  );
}

