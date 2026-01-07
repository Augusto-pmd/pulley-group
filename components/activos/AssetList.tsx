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
    <div className="relative">
      {/* CENTRO: Patrimonio neto total - Núcleo del anillo */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="mb-6">
          <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
            PATRIMONIO NETO ACTIVOS
          </div>
          <div className="text-center">
            <CurrencyDisplay 
              value={patrimonioNeto} 
              size="display" 
              showSecondary={true}
              originalCurrency="USD"
            />
          </div>
          <div className="text-body text-text-secondary text-center mt-2" style={{ opacity: 0.5 }}>
            {activos.length} {activos.length === 1 ? 'activo' : 'activos'}
          </div>
        </div>

        {/* Primera órbita: Valor bruto y saldo pendiente - Si hay pasivos */}
        {totalPasivos > 0 && (
          <div className="flex items-center justify-center gap-16" style={{ opacity: 0.6 }}>
            <div className="flex flex-col items-center">
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
                VALOR BRUTO
              </div>
              <CurrencyDisplay 
                value={totalUsd} 
                size="regular" 
                showSecondary={false}
                originalCurrency="USD"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
                SALDO PENDIENTE
              </div>
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

      {/* Segunda órbita: Lista de activos - Orbitan alrededor del centro */}
      <div className="space-y-3">
        {activos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-body text-text-secondary mb-2" style={{ opacity: 0.6 }}>
              No hay activos registrados
            </div>
            <div className="text-body-small text-text-secondary" style={{ opacity: 0.4 }}>
              Agrega tu primer activo para comenzar
            </div>
          </div>
        ) : (
          activos.map((activo) => (
            <div
              key={activo.id}
              className={`transition-all duration-fast cursor-pointer ${
                selectedAssetId === activo.id ? 'ring-2 ring-gold-accent' : ''
              }`}
              onClick={() => onSelectAsset(activo)}
              style={{
                backgroundColor: selectedAssetId === activo.id 
                  ? 'rgba(181, 154, 106, 0.08)' 
                  : 'rgba(214, 195, 163, 0.15)',
                backgroundImage: selectedAssetId === activo.id
                  ? 'radial-gradient(circle at center, rgba(181, 154, 106, 0.12) 0%, transparent 70%)'
                  : 'none',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: '1px solid rgba(181, 154, 106, 0.15)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-heading-3 text-text-primary">
                      {activo.nombre}
                    </h3>
                    <span className="px-2 py-0.5 text-body-small rounded-button" style={{ 
                      backgroundColor: 'rgba(31, 42, 51, 0.3)',
                      color: '#F5F2EC',
                      border: '1px solid rgba(142, 142, 138, 0.2)',
                    }}>
                      {getTipoLabel(activo.tipo)}
                    </span>
                    {activo.estadoFiscal === 'declarado' && (
                      <span className="px-2 py-0.5 text-body-small rounded-button" style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22C55E',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}>
                        Declarado
                      </span>
                    )}
                  </div>
                  <div className="text-body-small text-text-secondary" style={{ opacity: 0.6 }}>
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
                    <div className="text-body-small text-text-secondary mt-1" style={{ opacity: 0.5 }}>
                      Saldo: {activo.pasivo.cuotasRestantes} cuotas
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

