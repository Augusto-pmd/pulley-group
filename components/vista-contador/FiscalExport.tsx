'use client';

import { useState } from 'react';
import Card from '../Card';
import { formatCurrency } from '@/utils/number-format';
import { generarExportContador, type ExportContador } from '@/mock/fiscal';
import { getMesesDisponibles } from '@/mock/eventos';

export default function FiscalExport() {
  const mesesDisponibles = getMesesDisponibles();
  const [mesSeleccionado, setMesSeleccionado] = useState(mesesDisponibles[mesesDisponibles.length - 1] || '2024-03');
  const [exportData, setExportData] = useState<ExportContador | null>(null);

  const handleGenerarExport = () => {
    const data = generarExportContador(mesSeleccionado);
    setExportData(data);
  };

  const handleDescargar = () => {
    if (!exportData) return;
    
    // Generar JSON para descargar
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-contador-${mesSeleccionado}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Selector y Generar */}
      <Card padding="normal">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-body text-gray-text-primary mb-1.5">Período</label>
            <select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            >
              {mesesDisponibles.map((mes) => {
                const [year, month] = mes.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                return (
                  <option key={mes} value={mes}>
                    {date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={handleGenerarExport}
              className="px-6 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
            >
              Generar Export
            </button>
            {exportData && (
              <button
                onClick={handleDescargar}
                className="px-6 py-2.5 bg-green-success text-white text-body font-medium rounded-button hover:opacity-90 transition-opacity duration-fast"
              >
                Descargar JSON
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Vista Previa */}
      {exportData && (
        <Card padding="large">
          <h2 className="text-heading-2 text-gray-text-primary mb-6">
            Export para Contador - {exportData.periodo}
          </h2>

          {/* Ingresos */}
          <div className="mb-6">
            <h3 className="text-heading-3 text-gray-text-primary mb-4">Ingresos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/30 border border-gray-divider">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  FACTURADOS
                </div>
                <div className="text-number-medium number-glass">
                  {formatCurrency(exportData.ingresos.facturados)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/30 border border-gray-divider">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  NO FACTURADOS
                </div>
                <div className="text-number-medium number-glass">
                  {formatCurrency(exportData.ingresos.noFacturados)}
                </div>
              </div>
            </div>
          </div>

          {/* Gastos */}
          <div className="mb-6">
            <h3 className="text-heading-3 text-gray-text-primary mb-4">Gastos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/30 border border-gray-divider">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  DEDUCIBLES
                </div>
                <div className="text-number-medium number-glass">
                  {formatCurrency(exportData.gastos.deducibles)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/30 border border-gray-divider">
                <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                  NO DEDUCIBLES
                </div>
                <div className="text-number-medium number-glass">
                  {formatCurrency(exportData.gastos.noDeducibles)}
                </div>
              </div>
            </div>
          </div>

          {/* Activos */}
          {exportData.activos.length > 0 && (
            <div className="mb-6">
              <h3 className="text-heading-3 text-gray-text-primary mb-4">Activos</h3>
              <div className="space-y-3">
                {exportData.activos.map((activo, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-white/30 border border-gray-divider"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-body-large text-gray-text-primary font-medium">
                        {activo.nombre}
                      </div>
                      <div className="text-right">
                        <div className="text-body text-gray-text-primary">
                          {formatCurrency(activo.patrimonioNetoArs)}
                        </div>
                        <div className="text-body-small text-gray-text-tertiary">
                          Patrimonio neto
                        </div>
                      </div>
                    </div>
                    {activo.pasivo && (
                      <div className="pt-2 border-t border-gray-divider text-body-small text-gray-text-tertiary">
                        Saldo pendiente: {formatCurrency(activo.pasivo.saldoPendienteArs)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movimientos */}
          <div>
            <h3 className="text-heading-3 text-gray-text-primary mb-4">
              Movimientos ({exportData.movimientos.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {exportData.movimientos.map((mov, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-white/20 border border-gray-divider"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-body text-gray-text-primary font-medium">
                        {mov.concepto}
                      </div>
                      <div className="text-body-small text-gray-text-tertiary">
                        {new Date(mov.fecha).toLocaleDateString('es-AR')} · {mov.etiquetaFiscal.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div className="text-body text-gray-text-primary">
                      {formatCurrency(mov.montoArs)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

