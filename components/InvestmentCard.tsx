'use client';

import { useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import CurrencyDisplay, { CurrencyDisplaySigned } from './CurrencyDisplay';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import type { Investment } from '@/mock/data';
import { deleteInvestment } from '@/lib/api';

interface InvestmentCardProps {
  investment: Investment;
  onDelete?: (id: string) => void;
}

// Mock: calcular indicador visual basado en ROI
const getIndicator = (roi: number): string => {
  if (roi > 5) return '↑';
  if (roi < -2) return '↓';
  return '=';
};

export default function InvestmentCard({ investment, onDelete }: InvestmentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const indicator = getIndicator(investment.roiNominal);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteInvestment(investment.id);
      if (onDelete) {
        onDelete(investment.id);
      } else {
        // Recargar página si no hay callback
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      alert('Error al eliminar la inversión. Por favor, intenta nuevamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-card-hover transition-shadow duration-fast">
        <div className="grid grid-cols-2 gap-6">
          {/* Columna Izquierda: Nombre y Clasificación */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <Link href={`/investments/${investment.id}`} className="flex-1">
                {/* Nombre de Inversión - 20px, peso 600 */}
                <h3 className="text-[20px] font-semibold text-gray-text-primary mb-2">
                  {investment.name}
                </h3>
                {/* Tipo y Estado - 13px, peso 400, gris */}
                <div className="text-body text-gray-text-tertiary">
                  {investment.type} · Activa
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
                className="ml-2 px-2 py-1 text-body-small text-red-600 hover:bg-red-50 rounded-button border border-red-200 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                title="Eliminar inversión"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Columna Derecha: Métricas y Rendimiento */}
          <div className="text-right">
            {/* Resultado Acumulado - 24px, peso 600 */}
            <div className="mb-2">
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                RESULTADO
              </div>
              <CurrencyDisplaySigned 
                value={investment.result} 
                size="large" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>

            {/* Indicador Visual Simple - 20px */}
            <div className="text-[20px] font-normal text-gray-text-primary mb-2">
              {indicator}
            </div>

            {/* Capital Invertido - 15px, peso 400 */}
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                CAPITAL
              </div>
              <CurrencyDisplay 
                value={investment.capital} 
                size="medium" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        title="Eliminar inversión"
        message="¿Estás seguro de que deseas eliminar esta inversión? Se eliminarán también todos los eventos asociados (aportes, retiros, ajustes)."
        itemName={investment.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

