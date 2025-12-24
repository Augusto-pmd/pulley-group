'use client';

import Card from '../Card';
import CurrencyDisplay from '../CurrencyDisplay';
import { type Activo, getPatrimonioNetoActivo } from '@/mock/activos';

interface AssetListProps {
  activos: Activo[];
  totalUsd: number;
  onSelectAsset: (activo: Activo) => void;
  selectedAssetId?: string | null;
}

export default function AssetList({ activos, totalUsd, onSelectAsset, selectedAssetId }: AssetListProps) {
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'inmueble':
        return 'Inmueble';
      case 'vehiculo':
        return 'Vehículo';
      case 'otro':
        return 'Otro';
      default:
        return tipo;
    }
  };

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calcular patrimonio neto total (valor - pasivos)
  const patrimonioNeto = activos.reduce((sum, activo) => sum + getPatrimonioNetoActivo(activo), 0);
  const totalPasivos = activos.reduce((sum, activo) => sum + (activo.pasivo?.saldoPendienteUsd || 0), 0);

  return (
    <div className="space-y-4">
      {/* Resumen Total */}
      <Card padding="normal">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-caption text-gray-text-disabled uppercase tracking-wider mb-1">
                PATRIMONIO NETO ACTIVOS
              </div>
              <CurrencyDisplay 
                value={patrimonioNeto} 
                size="large" 
                showSecondary={true}
                originalCurrency="USD"
              />
            </div>
            <div className="text-body text-gray-text-tertiary">
              {activos.length} {activos.length === 1 ? 'activo' : 'activos'}
            </div>
          </div>
          {totalPasivos > 0 && (
            <div className="pt-3 border-t border-gray-divider">
              <div className="flex items-center justify-between text-body-small">
                <span className="text-gray-text-tertiary">Valor bruto:</span>
                <CurrencyDisplay 
                  value={totalUsd} 
                  size="regular" 
                  showSecondary={false}
                  originalCurrency="USD"
                />
              </div>
              <div className="flex items-center justify-between text-body-small mt-1">
                <span className="text-gray-text-tertiary">Saldo pendiente:</span>
                <CurrencyDisplay 
                  value={totalPasivos} 
                  size="regular" 
                  showSecondary={false}
                  originalCurrency="USD"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Activos */}
      {activos.length === 0 ? (
        <Card padding="large">
          <div className="text-center py-12">
            <div className="text-body-large text-gray-text-tertiary mb-2">
              No hay activos registrados
            </div>
            <div className="text-body text-gray-text-disabled">
              Agrega tu primer activo para comenzar
            </div>
          </div>
        </Card>
      ) : (
        activos.map((activo) => (
          <Card
            key={activo.id}
            padding="normal"
            className={`hover:shadow-card-hover transition-all duration-fast cursor-pointer ${
              selectedAssetId === activo.id ? 'border-2 border-blue-system shadow-card-hover' : ''
            }`}
            onClick={() => onSelectAsset(activo)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-heading-3 text-gray-text-primary">
                    {activo.nombre}
                  </h3>
                  <span className="px-2 py-0.5 bg-blue-50/30 text-blue-system text-body-small rounded-button border border-blue-200/20">
                    {getTipoLabel(activo.tipo)}
                  </span>
                  {activo.estadoFiscal === 'declarado' && (
                    <span className="px-2 py-0.5 bg-green-success/10 text-green-success text-body-small rounded-button border border-green-success/20">
                      Declarado
                    </span>
                  )}
                </div>
                <div className="text-body-small text-gray-text-tertiary">
                  Última valuación: {formatDate(activo.fechaUltimaValuacion)}
                </div>
              </div>
              <div className="text-right">
                <CurrencyDisplay 
                  value={getPatrimonioNetoActivo(activo)} 
                  size="medium" 
                  showSecondary={true}
                  originalCurrency="USD"
                />
                {activo.pasivo && activo.pasivo.saldoPendienteUsd > 0 && (
                  <div className="text-body-small text-gray-text-tertiary mt-1">
                    Saldo: {activo.pasivo.cuotasRestantes} cuotas
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

