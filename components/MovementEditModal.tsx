'use client';

import { useState, useEffect } from 'react';
import Card from './Card';
import { formatNumberWithSeparators, parseNumberAR, formatCurrencyAR } from '@/utils/number-format';
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
      const montoNum = parseNumberAR(montoFormatted) ?? 0;
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
          <form noValidate onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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
                inputMode="decimal"
                className="w-full px-4 py-2.5 rounded-input text-body font-mono transition-colors duration-fast"
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
                className="flex-1 px-6 py-2.5 rounded-button text-body font-medium transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#A0885A')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#B59A6A')}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-button text-body font-medium transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    border: '1px solid rgba(142, 142, 138, 0.2)',
                    color: '#F5F2EC',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Eliminar
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2.5 rounded-button text-body transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  border: '1px solid rgba(142, 142, 138, 0.2)',
                  color: '#F5F2EC',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="p-4 rounded-lg" style={{
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
              border: '1px solid rgba(142, 142, 138, 0.2)',
            }}>
              <p className="text-body font-medium mb-2" style={{ color: '#F5F2EC' }}>
                ¿Estás seguro de eliminar este movimiento?
              </p>
              <p className="text-body-small text-text-secondary">
                Esta acción no se puede deshacer. El movimiento se eliminará permanentemente.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-6 py-2.5 rounded-button text-body font-medium transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.8)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#1F2A33')}
              >
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="px-6 py-2.5 rounded-button text-body transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  border: '1px solid rgba(142, 142, 138, 0.2)',
                  color: '#F5F2EC',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'transparent')}
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

