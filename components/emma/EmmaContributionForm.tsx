'use client';

import { useState } from 'react';
import Card from '../Card';
import { formatNumberWithSeparators, parseFormattedNumber, formatCurrency } from '@/utils/number-format';
import { getConcepts, getOrCreateMonth, createMovement } from '@/lib/api';

interface EmmaContributionFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function EmmaContributionForm({ onComplete, onCancel }: EmmaContributionFormProps) {
  const [fecha, setFecha] = useState<string>(() => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  });
  const [monto, setMonto] = useState<string>('');
  const [montoFormatted, setMontoFormatted] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumberWithSeparators(value);
    setMontoFormatted(formatted);
    setMonto(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validar fecha (no puede ser futura)
      const fechaDate = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaDate > hoy) {
        setError('La fecha no puede ser futura');
        setLoading(false);
        return;
      }

      // Validar monto
      const montoNum = parseFormattedNumber(montoFormatted);
      if (montoNum <= 0) {
        setError('El monto debe ser mayor a 0');
        setLoading(false);
        return;
      }

      // Obtener concepto "Aporte fondo Emma"
      const concepts = await getConcepts();
      const emmaConcept = concepts.find(c => c.name === 'Aporte fondo Emma');
      
      if (!emmaConcept) {
        throw new Error('No se encontró el concepto "Aporte fondo Emma". Por favor, recarga la página.');
      }

      // Obtener o crear el mes
      const fechaDate2 = new Date(fecha);
      const year = fechaDate2.getFullYear();
      const month = fechaDate2.getMonth() + 1;
      const monthRecord = await getOrCreateMonth(year, month);

      // Crear Movement real
      await createMovement({
        type: 'ingreso',
        amountUSD: montoNum,
        currencyOriginal: 'USD',
        exchangeRate: null,
        date: fecha,
        status: 'pagado',
        conceptId: emmaConcept.id,
        monthId: monthRecord.id,
      });

      // Completar (refrescar página)
      onComplete();
    } catch (err: any) {
      console.error('Error agregando aporte:', err);
      setError(err.message || 'Error al agregar el aporte');
      setLoading(false);
    }
  };

  return (
    <Card padding="large">
      <div className="mb-6">
        <h2 className="text-heading-2 text-gray-text-primary mb-2">
          Agregar Aporte
        </h2>
        <p className="text-body text-gray-text-tertiary">
          Este aporte se registrará como un movimiento real en Vida Mensual.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-body text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          />
        </div>

        {/* Monto */}
        <div>
          <label className="block text-body-small text-gray-text-secondary mb-2">
            Monto (USD) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={montoFormatted}
            onChange={handleMontoChange}
            placeholder="0"
            required
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 font-mono"
          />
          <p className="mt-1 text-caption text-gray-text-tertiary">
            Se creará un movimiento real en Vida Mensual
          </p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-button text-body font-medium hover:bg-blue-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Agregando...' : 'Agregar aporte'}
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

