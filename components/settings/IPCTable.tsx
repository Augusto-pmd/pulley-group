'use client';

import Card from '../Card';
import { mockIPCData } from '@/mock/data';
import { formatNumber } from '@/utils/number-format';
import type { IPCData } from '@/mock/data';

export default function IPCTable() {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <Card padding="large">
      {/* Header de Card */}
      <div className="pb-6 border-b border-gray-divider mb-0">
        <h3 className="text-heading-3 font-semibold text-black mb-1">IPC</h3>
        <p className="text-body text-gray-text-tertiary">
          Índice de Precios al Consumidor para ajustes reales
        </p>
      </div>

      {/* Explicación del Uso */}
      <div className="pt-6 mb-6">
        <p className="text-body text-gray-text-tertiary">
          El IPC se usa exclusivamente para calcular valores reales (poder adquisitivo). No afecta los valores nominales ni las proyecciones base.
        </p>
      </div>

      {/* Tabla de IPC Editable */}
      <div className="overflow-x-auto">
        <div>
          {/* Header de Tabla */}
          <div className="h-12 bg-gray-bg border-b border-gray-border flex items-center px-4 min-w-[800px]">
            <div className="w-[100px] text-body font-medium text-gray-text-tertiary uppercase tracking-wider">
              AÑO
            </div>
            {months.map((month) => (
              <div
                key={month}
                className="w-[120px] text-right text-body font-medium text-gray-text-tertiary uppercase tracking-wider"
              >
                {month.substring(0, 3)}
              </div>
            ))}
          </div>

          {/* Filas */}
          {mockIPCData.map((data) => (
            <div
              key={data.year}
              className="h-12 flex items-center px-4 hover:bg-gray-bg transition-colors duration-fast min-w-[800px]"
            >
              <div className="w-[100px] text-body-large text-black">
                {data.year}
              </div>
              {data.months.map((value, index) => (
                <div key={index} className="w-[120px] text-right">
                  <input
                    type="text"
                    value={formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    readOnly
                    className="w-full text-body-large font-mono-numbers text-black bg-white border border-gray-border rounded-button px-3 py-2 text-right focus:border-blue-system focus:outline-none transition-colors duration-fast"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Botón Agregar Año (Opcional) */}
      <div className="mt-4 text-right">
        <button className="text-body text-blue-system hover:text-blue-hover transition-colors duration-fast">
          Agregar año
        </button>
      </div>
    </Card>
  );
}

