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
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-warning/20 flex items-center justify-center mt-0.5">
            <span className="text-orange-warning text-body-small">!</span>
          </div>
          <div className="flex-1">
            <div className="text-body-large text-gray-text-primary font-medium mb-1">
              Tenés {mesesAtrasados.length} {mesesAtrasados.length === 1 ? 'mes anterior sin cerrar' : 'meses anteriores sin cerrar'}
            </div>
            <div className="text-body text-gray-text-tertiary mb-2">
              Podés seguir cargando eventos en el mes actual. Los meses anteriores permanecen abiertos hasta que los cierres manualmente.
            </div>
            <div className="flex flex-wrap gap-2">
              {mesesAtrasados.map((mes) => (
                <button
                  key={mes.mes}
                  onClick={() => onSelectMonth?.(mes.mes)}
                  className="px-2.5 py-1 bg-orange-50/30 text-orange-warning text-body-small rounded-button border border-orange-200/20 hover:bg-orange-50/50 hover:border-orange-300/30 transition-colors duration-fast cursor-pointer"
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

