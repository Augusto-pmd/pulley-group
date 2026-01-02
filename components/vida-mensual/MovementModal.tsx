'use client';

import { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '@/utils/number-format';
import type { MonthlyMovement, Concept, MovementType, MovementCategory } from '@/mock/data';

interface MovementModalProps {
  type: MovementType;
  concepts: Concept[];
  movement?: MonthlyMovement | null;
  onSave: (movement: Omit<MonthlyMovement, 'id'>) => void;
  onClose: () => void;
}

export default function MovementModal({
  type,
  concepts,
  movement,
  onSave,
  onClose,
}: MovementModalProps) {
  const [concept, setConcept] = useState(movement?.concept || '');
  const [amount, setAmount] = useState(movement?.amount.toString() || '');
  const [date, setDate] = useState(movement?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<MovementCategory>(movement?.category || 'variable');
  const [isRecurrent, setIsRecurrent] = useState(movement?.isRecurrent || false);
  const [note, setNote] = useState(movement?.note || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredConcepts, setFilteredConcepts] = useState<Concept[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (concept.length > 0) {
      const filtered = concepts.filter((c) =>
        c.name.toLowerCase().includes(concept.toLowerCase())
      );
      setFilteredConcepts(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [concept, concepts]);

  const handleConceptSelect = (selectedConcept: Concept) => {
    setConcept(selectedConcept.name);
    if (selectedConcept.estimatedAmount) {
      setAmount(selectedConcept.estimatedAmount.toString());
    }
    setCategory(selectedConcept.category);
    setIsRecurrent(selectedConcept.isRecurrent);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      type,
      concept,
      amount: parseFloat(amount) || 0,
      date,
      category,
      isRecurrent,
      note: note || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-card-large p-8 max-w-md w-full mx-4 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-heading-2 text-gray-text-primary mb-6">
          {movement ? 'Editar' : 'Agregar'} {type === 'ingreso' ? 'Ingreso' : 'Egreso'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Concepto con autocompletado */}
          <div className="relative">
            <label className="block text-body text-gray-text-primary mb-2">Concepto</label>
            <input
              ref={inputRef}
              type="text"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              onFocus={() => {
                if (filteredConcepts.length > 0) setShowSuggestions(true);
              }}
              className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600"
              required
            />
            {showSuggestions && filteredConcepts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-border rounded-card shadow-card max-h-48 overflow-y-auto">
                {filteredConcepts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleConceptSelect(c)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-fast"
                  >
                    <div className="text-body-large text-gray-text-primary font-medium">{c.name}</div>
                    <div className="text-body-small text-gray-text-tertiary">
                      {c.isRecurrent ? 'Recurrente - ' : ''}
                      {c.frequency || 'Único'}
                      {c.estimatedAmount && ` · ${formatCurrency(c.estimatedAmount)}`}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Monto */}
          <div>
            <label className="block text-body text-gray-text-primary mb-2">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-body text-gray-text-primary mb-2">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600"
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-body text-gray-text-primary mb-2">Categoría</label>
            <div className="flex gap-4">
              {(['fijo', 'variable', 'extraordinario'] as MovementCategory[]).map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="w-4 h-4"
                  />
                  <span className="text-body text-gray-text-primary capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recurrente */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-body text-gray-text-primary">Es recurrente mensual</span>
            </label>
            {isRecurrent && (
              <p className="text-body-small text-gray-text-tertiary mt-1">
                Este concepto se repetirá el mes próximo
              </p>
            )}
          </div>

          {/* Nota (opcional) */}
          <div>
            <label className="block text-body text-gray-text-primary mb-2">Nota (opcional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600"
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-body text-gray-text-tertiary hover:text-black transition-colors duration-fast"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
            >
              {movement ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

