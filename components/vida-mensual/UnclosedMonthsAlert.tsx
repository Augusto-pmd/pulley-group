'use client';

import Card from '../Card';
import FadeIn from '../animations/FadeIn';

interface UnclosedMonthsAlertProps {
  mesesAtrasados: Array<{ mes: string; fechaApertura: string }>;
  onSelectMonth?: (mes: string) => void;
}

export default function UnclosedMonthsAlert({ mesesAtrasados, onSelectMonth }: UnclosedMonthsAlertProps) {
  if (mesesAtrasados.length === 0) return null;

  const formatMonthName = (mes: string) => {
    const [year, month] = mes.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <FadeIn delay={0} duration={300}>
      <Card padding="normal">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-body-large text-text-primary font-medium mb-1">
              Tenés {mesesAtrasados.length} {mesesAtrasados.length === 1 ? 'mes anterior sin cerrar' : 'meses anteriores sin cerrar'}
            </div>
            <div className="text-body text-text-secondary mb-2">
              Podés seguir cargando eventos en el mes actual. Los meses anteriores permanecen abiertos hasta que los cierres manualmente.
            </div>
            <div className="flex flex-wrap gap-2">
              {mesesAtrasados.map((mes) => (
                <button
                  key={mes.mes}
                  onClick={() => onSelectMonth?.(mes.mes)}
                  className="px-2.5 py-1 text-body-small rounded-button transition-colors duration-fast cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(31, 42, 51, 0.1)',
                    color: '#F5F2EC',
                    border: '1px solid rgba(142, 142, 138, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
                  }}
                >
                  {formatMonthName(mes.mes)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
}

