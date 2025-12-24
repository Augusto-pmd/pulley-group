'use client';

import { useState } from 'react';
import Card from '../Card';
import { conceptosMock } from '@/mock/conceptos';
import { getEtiquetaFiscal, setEtiquetaFiscal, type EtiquetaFiscal } from '@/mock/fiscal';

export default function FiscalConceptTags() {
  const [conceptos, setConceptos] = useState(conceptosMock);

  const handleChangeEtiqueta = (conceptoId: string, nuevaEtiqueta: EtiquetaFiscal) => {
    setEtiquetaFiscal(conceptoId, nuevaEtiqueta);
    // Actualizar estado local para reflejar cambio
    setConceptos([...conceptos]);
  };

  const getEtiquetaLabel = (etiqueta: EtiquetaFiscal): string => {
    switch (etiqueta) {
      case 'ingreso_facturado_afip':
        return 'Ingreso Facturado AFIP';
      case 'gasto_deducible':
        return 'Gasto Deducible';
      case 'gasto_no_deducible':
        return 'Gasto No Deducible';
      case 'pago_pasivo':
        return 'Pago de Pasivo';
      case 'neutro_fiscal':
        return 'Neutro Fiscal';
      default:
        return etiqueta;
    }
  };

  const getEtiquetaColor = (etiqueta: EtiquetaFiscal): string => {
    switch (etiqueta) {
      case 'ingreso_facturado_afip':
        return 'bg-green-success/10 text-green-success border-green-success/20';
      case 'gasto_deducible':
        return 'bg-blue-50/30 text-blue-system border-blue-200/20';
      case 'gasto_no_deducible':
        return 'bg-gray-50/30 text-gray-text-tertiary border-gray-divider';
      case 'pago_pasivo':
        return 'bg-purple-50/30 text-purple-accent border-purple-200/20';
      case 'neutro_fiscal':
        return 'bg-gray-50/30 text-gray-text-disabled border-gray-divider';
      default:
        return 'bg-gray-50/30 text-gray-text-tertiary border-gray-divider';
    }
  };

  return (
    <Card padding="large">
      <div className="mb-6">
        <h2 className="text-heading-2 text-gray-text-primary mb-2">Etiquetas Fiscales por Concepto</h2>
        <p className="text-body text-gray-text-tertiary">
          Define una vez la etiqueta fiscal de cada concepto. Se aplicará automáticamente a todos los eventos futuros.
        </p>
      </div>

      <div className="space-y-3">
        {conceptos.map((concepto) => {
          const etiquetaActual = getEtiquetaFiscal(concepto.id);

          return (
            <div
              key={concepto.id}
              className="p-4 rounded-lg bg-white/30 border border-gray-divider"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-body-large text-gray-text-primary font-medium mb-1">
                    {concepto.nombre}
                  </div>
                  <div className="text-body-small text-gray-text-tertiary">
                    {concepto.categoria.charAt(0).toUpperCase() + concepto.categoria.slice(1)} ·{' '}
                    {concepto.recurrente ? 'Recurrente' : 'Puntual'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-button text-body-small border ${getEtiquetaColor(etiquetaActual)}`}>
                    {getEtiquetaLabel(etiquetaActual)}
                  </span>
                  <select
                    value={etiquetaActual}
                    onChange={(e) => handleChangeEtiqueta(concepto.id, e.target.value as EtiquetaFiscal)}
                    className="px-3 py-1.5 border border-gray-border rounded-input text-body-small text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
                  >
                    <option value="ingreso_facturado_afip">Ingreso Facturado AFIP</option>
                    <option value="gasto_deducible">Gasto Deducible</option>
                    <option value="gasto_no_deducible">Gasto No Deducible</option>
                    <option value="pago_pasivo">Pago de Pasivo</option>
                    <option value="neutro_fiscal">Neutro Fiscal</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

