'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { formatCurrency } from '@/utils/number-format';
import type { MonthlyMovement, Concept } from '@/mock/data';
import MovementModal from './MovementModal';

interface ExpenseListProps {
  movements: MonthlyMovement[];
  concepts: Concept[];
  onAdd: (movement: Omit<MonthlyMovement, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<MonthlyMovement>) => void;
  onDelete: (id: string) => void;
  onToggleRecurrent: (id: string) => void;
}

export default function ExpenseList({
  movements,
  concepts,
  onAdd,
  onUpdate,
  onDelete,
  onToggleRecurrent,
}: ExpenseListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MonthlyMovement | null>(null);

  const total = movements.reduce((sum, m) => sum + m.amount, 0);

  const handleEdit = (movement: MonthlyMovement) => {
    setEditingMovement(movement);
    setIsModalOpen(true);
  };

  const handleSave = (movement: Omit<MonthlyMovement, 'id'>) => {
    if (editingMovement) {
      onUpdate(editingMovement.id, movement);
    } else {
      onAdd(movement);
    }
    setIsModalOpen(false);
    setEditingMovement(null);
  };

  return (
    <>
      <Card padding="large">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-divider">
          <h2 className="text-heading-2 text-gray-text-primary">EGRESOS DEL MES</h2>
          <div className="number-display text-gray-text-primary">
            {formatCurrency(total)}
          </div>
        </div>

        {movements.length === 0 ? (
          <div className="text-body text-gray-text-tertiary text-center py-8">
            No hay egresos registrados para este mes
          </div>
        ) : (
          <div className="space-y-1">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/30 hover:bg-white/50 transition-colors duration-fast"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <div className="text-body-large text-gray-text-primary font-medium">
                      {movement.concept}
                    </div>
                    <div className="text-body-small text-gray-text-tertiary">
                      {new Date(movement.date).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      {movement.isRecurrent && (
                        <span className="ml-2 text-blue-600">· Recurrente</span>
                      )}
                    </div>
                  </div>
                  <div className="number-medium text-gray-text-primary">
                    {formatCurrency(movement.amount)}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => handleEdit(movement)}
                    className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(movement.id)}
                    className="text-body text-red-600 hover:text-red-700 transition-colors duration-fast"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            setEditingMovement(null);
            setIsModalOpen(true);
          }}
          className="mt-4 text-body-large text-blue-600 hover:text-blue-700 transition-colors duration-fast"
        >
          + Agregar egreso
        </button>
      </Card>

      {isModalOpen && (
        <MovementModal
          type="egreso"
          concepts={concepts}
          movement={editingMovement}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMovement(null);
          }}
        />
      )}
    </>
  );
}

