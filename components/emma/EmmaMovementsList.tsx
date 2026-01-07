'use client';

import { useState, useEffect } from 'react';
import Card from '../Card';
import MovementEditModal from '../MovementEditModal';
import CurrencyDisplay from '../CurrencyDisplay';
import { formatCurrency } from '@/utils/number-format';
import { getEmmaMovements, type ApiMovement } from '@/lib/api';

export default function EmmaMovementsList() {
  const [movements, setMovements] = useState<ApiMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMovement, setEditingMovement] = useState<ApiMovement | null>(null);

  useEffect(() => {
    async function loadMovements() {
      try {
        setLoading(true);
        const emmaMovements = await getEmmaMovements();
        // Ordenar por fecha descendente (más recientes primero)
        setMovements(emmaMovements.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (error) {
        console.error('Error loading Emma movements:', error);
        setMovements([]);
      } finally {
        setLoading(false);
      }
    }
    loadMovements();
  }, [editingMovement]);

  const handleSaveMovement = async (updatedMovement: ApiMovement) => {
    // Recargar movimientos
    const emmaMovements = await getEmmaMovements();
    setMovements(emmaMovements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setEditingMovement(null);
    // Refrescar página para actualizar estado de Emma
    window.location.reload();
  };

  const handleDeleteMovement = async (id: string) => {
    // Recargar movimientos
    const emmaMovements = await getEmmaMovements();
    setMovements(emmaMovements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
    setEditingMovement(null);
    // Refrescar página para actualizar estado de Emma
    window.location.reload();
  };

  if (loading) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-text-secondary">
          Cargando movimientos...
        </div>
      </Card>
    );
  }

  if (movements.length === 0) {
    return (
      <Card padding="large">
        <div className="text-center text-body text-text-secondary">
          No hay movimientos registrados
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="large">
        <div className="mb-6">
          <h3 className="text-heading-3 text-text-primary mb-2">
            Movimientos de Emma
          </h3>
          <p className="text-body-small text-text-secondary">
            Historial completo de aportes al fondo
          </p>
        </div>

        <div className="space-y-2">
          {movements.map((movement) => (
            <button
              key={movement.id}
              onClick={() => setEditingMovement(movement)}
              className="w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-fast text-left"
              style={{ backgroundColor: 'rgba(31, 42, 51, 0.1)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)'}
            >
              <div className="flex-1">
                <div className="text-body text-text-primary font-medium mb-1">
                  {new Date(movement.date).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-body-small text-text-secondary">
                  {movement.concept?.name || 'Sin concepto'}
                </div>
              </div>
              <div className="text-right">
                <CurrencyDisplay 
                  value={movement.amountUSD} 
                  size="medium" 
                  showSecondary={false}
                />
              </div>
            </button>
          ))}
        </div>
      </Card>

      <MovementEditModal
        movement={editingMovement}
        onClose={() => setEditingMovement(null)}
        onSave={handleSaveMovement}
        onDelete={handleDeleteMovement}
      />
    </>
  );
}

