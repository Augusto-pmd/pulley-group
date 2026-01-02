'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { formatNumberWithSeparators, parseFormattedNumber, formatCurrency } from '@/utils/number-format';
import { updateMovement, deleteMovement, getConcepts, getOrCreateMonth, type ApiMovement } from '@/lib/api';

interface MovementEditModalProps {
  movement: ApiMovement | null;
  onClose: () => void;
  onSave: (updatedMovement: ApiMovement) => void;
  onDelete?: (id: string) => void;
}

export default function MovementEditModal({
  movement,
  onClose,
  onSave,
  onDelete,
}: MovementEditModalProps) {
  const [monto, setMonto] = useState<string>('');
  const [montoFormatted, setMontoFormatted] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [conceptId, setConceptId] = useState<string>('');
  const [concepts, setConcepts] = useState<Array<{ id: string; name: string; type: 'ingreso' | 'egreso' }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar conceptos y inicializar valores
  useEffect(() => {
    async function loadConcepts() {
      try {
        const apiConcepts = await getConcepts();
        setConcepts(apiConcepts.map(c => ({ id: c.id, name: c.name, type: c.type })));
      } catch (error) {
        console.error('Error loading concepts:', error);
      }
    }
    loadConcepts();
  }, []);

  // Inicializar valores cuando cambia el movement
  useEffect(() => {
    if (movement) {
      setMonto(movement.amountUSD.toString());
      setMontoFormatted(formatNumberWithSeparators(movement.amountUSD));
      setFecha(movement.date.split('T')[0]);
      setConceptId(movement.conceptId);
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [movement]);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumberWithSeparators(value);
    setMontoFormatted(formatted);
    setMonto(value);
  };

  const handleSave = async () => {
    if (!movement) return;

    setError(null);
    setLoading(true);

    try {
      // Validar monto
      const montoNum = parseFormattedNumber(montoFormatted);
      if (montoNum <= 0) {
        setError('El monto debe ser mayor a 0');
        setLoading(false);
        return;
      }

      // Validar fecha (no puede ser futura)
      const fechaDate = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(23, 59, 59, 999);
      if (fechaDate > hoy) {
        setError('La fecha no puede ser futura');
        setLoading(false);
        return;
      }

      // Validar concepto
      if (!conceptId) {
        setError('Debe seleccionar un concepto');
        setLoading(false);
        return;
      }

      // Actualizar movimiento (la API maneja automáticamente el cambio de monthId si cambió la fecha)
      const updated = await updateMovement(movement.id, {
        amountUSD: montoNum,
        date: fecha,
        conceptId: conceptId,
      });

      onSave(updated);
      onClose();
    } catch (err: any) {
      console.error('Error updating movement:', err);
      setError(err.message || 'Error al actualizar el movimiento');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!movement || !onDelete) return;

    setError(null);
    setLoading(true);

    try {
      await deleteMovement(movement.id);
      onDelete(movement.id);
      onClose();
    } catch (err: any) {
      console.error('Error deleting movement:', err);
      setError(err.message || 'Error al eliminar el movimiento');
      setLoading(false);
    }
  };

  if (!movement) return null;

  // Filtrar conceptos según el tipo de movimiento
  const availableConcepts = concepts.filter(c => c.type === movement.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card padding="large" className="w-full max-w-md mx-4">
        <div className="mb-6">
          <h2 className="text-heading-2 text-gray-text-primary mb-2">
            Editar Movimiento
          </h2>
          <p className="text-body text-gray-text-tertiary">
            {movement.type === 'ingreso' ? 'Ingreso' : 'Egreso'} - {movement.concept?.name || 'Sin concepto'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-body text-red-600">{error}</p>
          </div>
        )}

        {!showDeleteConfirm ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
            </div>

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

            {/* Concepto */}
            <div>
              <label className="block text-body-small text-gray-text-secondary mb-2">
                Concepto <span className="text-red-500">*</span>
              </label>
              <select
                value={conceptId}
                onChange={(e) => setConceptId(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
              >
                <option value="">Seleccionar concepto</option>
                {availableConcepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-button text-body font-medium hover:bg-blue-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="px-6 py-2.5 border border-red-300 text-red-600 rounded-button text-body font-medium hover:bg-red-50 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Eliminar
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-border rounded-button text-body text-gray-text-primary hover:bg-gray-50 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-body text-red-600 font-medium mb-2">
                ¿Estás seguro de eliminar este movimiento?
              </p>
              <p className="text-body-small text-red-600">
                Esta acción no se puede deshacer. El movimiento se eliminará permanentemente.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-button text-body font-medium hover:bg-red-700 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-border rounded-button text-body text-gray-text-primary hover:bg-gray-50 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

