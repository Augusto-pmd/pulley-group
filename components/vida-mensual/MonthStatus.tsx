'use client';

import Card from '../Card';
import SlideTransition from '../animations/SlideTransition';
import { getCurrentMonth } from '@/mock/month-status';
import type { MonthStatus } from '@/mock/month-status';

interface MonthStatusProps {
  mes: string;
  estado: MonthStatus;
  fechaApertura?: string;
  onCloseMonth?: () => void;
  onStartClosing?: () => void;
}

export default function MonthStatus({ mes, estado, fechaApertura, onCloseMonth, onStartClosing }: MonthStatusProps) {
  const currentMonth = getCurrentMonth();
  const isCurrentMonth = mes === currentMonth;
  
  const formatMonth = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    switch (estado) {
      case 'ABIERTO':
        return 'text-blue-system';
      case 'EN_CIERRE':
        return 'text-orange-warning';
      case 'CERRADO':
        return 'text-gray-text-tertiary';
      default:
        return 'text-gray-text-primary';
    }
  };

  const getStatusLabel = () => {
    switch (estado) {
      case 'ABIERTO':
        return 'MES ABIERTO';
      case 'EN_CIERRE':
        return 'EN CIERRE';
      case 'CERRADO':
        return 'MES CERRADO';
      default:
        return '';
    }
  };

  return (
    <SlideTransition isVisible={true} direction="up" duration={300}>
      <Card padding="large">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
              {isCurrentMonth ? 'MES ACTUAL' : 'MES SELECCIONADO'}
            </div>
            <div className="text-display-3 text-gray-text-primary">
              {formatMonth(mes)}
            </div>
          </div>
          
          <div className="h-10 w-px bg-gray-divider" />
          
          <div>
            <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
              ESTADO
            </div>
            <div className={`text-heading-2 font-semibold ${getStatusColor()}`}>
              {getStatusLabel()}
            </div>
            {fechaApertura && estado === 'ABIERTO' && (
              <div className="text-body-small text-gray-text-tertiary mt-1">
                Abierto automáticamente el {formatDate(fechaApertura)}
              </div>
            )}
          </div>
        </div>

        {/* CTA según estado */}
        <div>
          {estado === 'ABIERTO' && onStartClosing && (
            <button
              onClick={onStartClosing}
              className="px-4 py-2 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
            >
              Cerrar mes
            </button>
          )}
          {estado === 'EN_CIERRE' && onCloseMonth && (
            <button
              onClick={onCloseMonth}
              className="px-4 py-2 bg-green-success text-white text-body font-medium rounded-button hover:opacity-90 transition-opacity duration-fast"
            >
              Confirmar cierre
            </button>
          )}
          {estado === 'CERRADO' && (
            <div className="text-body text-gray-text-tertiary">
              Este mes está cerrado
            </div>
          )}
        </div>
      </div>
      </Card>
    </SlideTransition>
  );
}

