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
    return 'text-text-primary';
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
        <div className="flex flex-col items-center text-center py-8">
          {/* Mes - Protagonista absoluto */}
          <div className="mb-8">
            <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 opacity-60">
              {isCurrentMonth ? 'MES ACTUAL' : 'MES SELECCIONADO'}
            </div>
            <div className="text-display-3 text-text-primary">
              {formatMonth(mes)}
            </div>
          </div>

          {/* Estado - Secundario discreto */}
          <div className="mb-8">
            <div className={`text-heading-3 font-medium ${getStatusColor()}`}>
              {getStatusLabel()}
            </div>
            {fechaApertura && estado === 'ABIERTO' && (
              <div className="text-body-small text-text-secondary mt-2 opacity-60">
                Abierto el {formatDate(fechaApertura)}
              </div>
            )}
          </div>

          {/* CTA según estado - Discreto con materialidad */}
          {estado === 'ABIERTO' && onStartClosing && (
            <button
              onClick={onStartClosing}
              className="px-6 py-2.5 text-body font-medium rounded-button transition-all duration-300"
              style={{
                backgroundColor: 'rgba(181, 154, 106, 0.2)',
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                border: '1px solid rgba(181, 154, 106, 0.4)',
                color: '#F5F2EC',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.2) 40%, transparent 70%)';
                e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(181, 154, 106, 0.2), 0 6px 16px rgba(0, 0, 0, 0.35), 0 0 30px rgba(181, 154, 106, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
                e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)';
                e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
            >
              Cerrar mes
            </button>
          )}
          {estado === 'EN_CIERRE' && onCloseMonth && (
            <button
              onClick={onCloseMonth}
              className="px-6 py-2.5 text-body font-medium rounded-button transition-all duration-300"
              style={{
                backgroundColor: 'rgba(181, 154, 106, 0.2)',
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                border: '1px solid rgba(181, 154, 106, 0.4)',
                color: '#F5F2EC',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.25)';
                e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.35) 0%, rgba(181, 154, 106, 0.2) 40%, transparent 70%)';
                e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(181, 154, 106, 0.2), 0 6px 16px rgba(0, 0, 0, 0.35), 0 0 30px rgba(181, 154, 106, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(181, 154, 106, 0.2)';
                e.currentTarget.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)';
                e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(181, 154, 106, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
            >
              Confirmar cierre
            </button>
          )}
        </div>
      </Card>
    </SlideTransition>
  );
}

