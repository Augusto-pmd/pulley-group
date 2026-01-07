'use client';

import { useState, useEffect } from 'react';
import { useCircularNavigation } from '@/contexts/CircularNavigationContext';
import AssetList from '@/components/activos/AssetList';
import AssetEditPanel from '@/components/activos/AssetEditPanel';
import AddAssetForm from '@/components/activos/AddAssetForm';
import RadialCard from '@/components/circular/RadialCard';
import RadialList from '@/components/circular/RadialList';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { type Activo, type Pasivo, type ValuacionActivo, getPatrimonioNetoActivo } from '@/mock/activos';
import {
  getAssets,
  createAsset,
  createAssetValuation,
  getAssetValuations,
  getAssetLiability,
  createAssetLiability,
  updateAssetLiability,
  deleteAsset,
  type ApiAsset,
  type ApiAssetValuation,
  type ApiLiability,
} from '@/lib/api';

// Funciones de transformación entre tipos del mock y tipos de la API
function apiAssetToActivo(apiAsset: ApiAsset): Activo {
  const latestValuation = apiAsset.valuations && apiAsset.valuations.length > 0
    ? apiAsset.valuations[0]
    : null;

  const pasivo: Pasivo | undefined = apiAsset.liability
    ? {
        id: apiAsset.liability.id,
        activoId: apiAsset.liability.assetId,
        montoFinanciadoUsd: apiAsset.liability.totalAmountUSD,
        cuotasTotales: apiAsset.liability.installmentsTotal,
        cuotasRestantes: apiAsset.liability.installmentsRemaining,
        valorCuotaUsd: apiAsset.liability.monthlyInstallmentUSD,
        saldoPendienteUsd: apiAsset.liability.remainingAmountUSD,
        fechaInicio: new Date().toISOString().split('T')[0], // No está en la API, usar fecha actual
        fechaCreacion: new Date().toISOString().split('T')[0],
      }
    : undefined;

  return {
    id: apiAsset.id,
    nombre: apiAsset.name,
    tipo: apiAsset.type,
    valorActualUsd: latestValuation?.valueUSD || 0,
    fechaUltimaValuacion: latestValuation?.date || new Date().toISOString().split('T')[0],
    estadoFiscal: apiAsset.fiscalStatus,
    pasivo,
    fechaCreacion: new Date().toISOString().split('T')[0], // No está en la API
  };
}

function apiValuationToValuacionActivo(apiValuation: ApiAssetValuation): ValuacionActivo {
  return {
    id: apiValuation.id,
    activoId: apiValuation.assetId,
    fecha: apiValuation.date.split('T')[0],
    valorUsd: apiValuation.valueUSD,
    fechaCreacion: apiValuation.date.split('T')[0],
  };
}

export default function ActivosPage() {
  const { activeDomain, setDomainContent } = useCircularNavigation();
  const [activos, setActivos] = useState<Activo[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Activo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar activos desde la API
  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);
        const apiAssets = await getAssets();
        // Asegurar que apiAssets es un array antes de mapear
        const transformedAssets = Array.isArray(apiAssets) 
          ? apiAssets.map(apiAssetToActivo)
          : [];
        setActivos(transformedAssets);
      } catch (err: any) {
        console.error('Error loading assets:', err);
        setError(err.message || 'Error al cargar activos');
        // En caso de error, establecer array vacío para evitar errores de renderizado
        setActivos([]);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, []);

  const handleAddAsset = async (nuevoActivo: Activo) => {
    console.log('[Activos] handleAddAsset CALLED', nuevoActivo);
    try {
      // Crear activo en la API
      const assetData = {
        name: nuevoActivo.nombre,
        type: nuevoActivo.tipo,
        fiscalStatus: nuevoActivo.estadoFiscal,
      };
      console.log('[Activos] POST_API_CALL: createAsset', assetData);
      const apiAsset = await createAsset(assetData);
      console.log('[Activos] POST_API_RESPONSE', apiAsset);

      // Si hay valor inicial, crear valuación
      if (nuevoActivo.valorActualUsd > 0) {
        await createAssetValuation(apiAsset.id, {
          valueUSD: nuevoActivo.valorActualUsd,
          date: nuevoActivo.fechaUltimaValuacion,
        });
      }

      // Recargar activos
      const apiAssets = await getAssets();
      const transformedAssets = apiAssets.map(apiAssetToActivo);
      setActivos(transformedAssets);
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error creating asset:', err);
      setError(err.message || 'Error al crear activo');
    }
  };

  const handleSelectAsset = (activo: Activo) => {
    setSelectedAsset(activo);
    setShowAddForm(false);
  };

  const handleClosePanel = () => {
    setSelectedAsset(null);
  };

  const handleDeleteAsset = async (id: string) => {
    try {
      // Llamar a la API para eliminar
      await deleteAsset(id);
      
      // Actualizar estado local
      setActivos(activos.filter(a => a.id !== id));
      
      // Cerrar panel si el activo eliminado estaba seleccionado
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
      
      // Recargar activos desde la API para sincronizar
      const apiAssets = await getAssets();
      const transformedAssets = Array.isArray(apiAssets) 
        ? apiAssets.map(apiAssetToActivo)
        : [];
      setActivos(transformedAssets);
    } catch (err: any) {
      console.error('Error deleting asset:', err);
      setError(err.message || 'Error al eliminar activo');
      alert('Error al eliminar el activo. Por favor, intenta nuevamente.');
    }
  };

  const handleUpdateAsset = async (activoActualizado: Activo) => {
    // Actualizar en el estado local
    setActivos(activos.map((a) => (a.id === activoActualizado.id ? activoActualizado : a)));
    setSelectedAsset(activoActualizado);
    
    // Recargar desde la API para asegurar sincronización
    try {
      const apiAssets = await getAssets();
      const transformedAssets = apiAssets.map(apiAssetToActivo);
      setActivos(transformedAssets);
      const updated = transformedAssets.find((a) => a.id === activoActualizado.id);
      if (updated) {
        setSelectedAsset(updated);
      }
      
      // Notificar cambio para actualizar dashboard
      window.dispatchEvent(new CustomEvent('asset-changed'));
    } catch (err: any) {
      console.error('Error refreshing assets:', err);
    }
  };

  const totalActivos = activos.reduce((sum, a) => sum + a.valorActualUsd, 0);
  const patrimonioNeto = activos.reduce((sum, activo) => sum + getPatrimonioNetoActivo(activo), 0);
  const totalPasivos = activos.reduce((sum, activo) => sum + (activo.pasivo?.saldoPendienteUsd || 0), 0);

  // Inyectar contenido en el contexto circular cuando el dominio está activo
  useEffect(() => {
    if (activeDomain === 'activos') {
      const content = (
        <div className="w-full h-full overflow-y-auto" style={{ maxHeight: '85vh' }}>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-body text-text-secondary">Cargando activos...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-body text-red-400">Error: {error}</div>
            </div>
          ) : showAddForm ? (
            <div className="p-8">
              <AddAssetForm
                onSave={handleAddAsset}
                onClose={() => setShowAddForm(false)}
              />
            </div>
          ) : (
            <div className="p-8">
              {/* ESTRUCTURA RADIAL: Patrimonio neto en el centro, activos orbitan */}
              <div className="relative min-h-[60vh] flex flex-col items-center">
                {/* CENTRO: Patrimonio neto total - Núcleo circular */}
                <RadialCard className="mb-12" padding="large">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-caption text-text-secondary uppercase tracking-wider mb-4 text-center" style={{ opacity: 0.4 }}>
                      PATRIMONIO NETO ACTIVOS
                    </div>
                    <CurrencyDisplay 
                      value={patrimonioNeto} 
                      size="display" 
                      showSecondary={true}
                      originalCurrency="USD"
                    />
                    <div className="text-body text-text-secondary text-center mt-4" style={{ opacity: 0.5 }}>
                      {activos.length} {activos.length === 1 ? 'activo' : 'activos'}
                    </div>
                    
                    {/* Primera órbita: Valor bruto y saldo pendiente */}
                    {totalPasivos > 0 && (
                      <div className="flex items-center justify-center gap-16 mt-8" style={{ opacity: 0.6 }}>
                        <div className="flex flex-col items-center">
                          <div className="text-caption text-text-secondary uppercase tracking-wider mb-2" style={{ opacity: 0.5 }}>
                            VALOR BRUTO
                          </div>
                          <CurrencyDisplay 
                            value={totalActivos} 
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
                </RadialCard>

                {/* Segunda órbita: Lista de activos - Orbitan alrededor del centro */}
                {activos.length === 0 ? (
                  <RadialCard className="mt-8">
                    <div className="text-center py-8">
                      <div className="text-body text-text-secondary mb-2" style={{ opacity: 0.6 }}>
                        No hay activos registrados
                      </div>
                      <button
                        onClick={() => {
                          setShowAddForm(true);
                          setSelectedAsset(null);
                        }}
                        className="mt-4 px-6 py-3 rounded-full text-body font-medium transition-all duration-300"
                        style={{
                          backgroundColor: 'rgba(181, 154, 106, 0.2)',
                          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 40%, transparent 70%)',
                          border: '1px solid rgba(181, 154, 106, 0.4)',
                          color: '#F5F2EC',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        Agregar primer activo
                      </button>
                    </div>
                  </RadialCard>
                ) : (
                  <RadialList
                    items={activos.map((activo, index) => {
                      const angle = (index * 360) / activos.length;
                      const radius = 200 + (index % 3) * 50; // Variar radio para crear espiral
                      return {
                        id: activo.id,
                        angle,
                        radius,
                        size: 140,
                        isActive: selectedAsset?.id === activo.id,
                        onClick: () => handleSelectAsset(activo),
                        label: activo.nombre,
                        content: (
                          <div className="text-center">
                            <CurrencyDisplay 
                              value={getPatrimonioNetoActivo(activo)} 
                              size="regular" 
                              showSecondary={false}
                              originalCurrency="USD"
                            />
                          </div>
                        ),
                      };
                    })}
                    centerRadius={180}
                  />
                )}
              </div>

              {/* Botón flotante para agregar activo */}
              <div className="fixed bottom-8 right-8 z-[200]">
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setSelectedAsset(null);
                  }}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(181, 154, 106, 0.25)',
                    backgroundImage: 'radial-gradient(circle at center, rgba(181, 154, 106, 0.3) 0%, rgba(181, 154, 106, 0.15) 50%, transparent 100%)',
                    border: '2px solid rgba(181, 154, 106, 0.4)',
                    color: '#F5F2EC',
                    backdropFilter: 'blur(12px)',
                    boxShadow: `
                      inset 0 0 20px rgba(181, 154, 106, 0.2),
                      0 0 30px rgba(181, 154, 106, 0.25),
                      0 4px 12px rgba(0, 0, 0, 0.3)
                    `,
                  }}
                >
                  <span className="text-2xl">+</span>
                </button>
              </div>

              {/* Panel de Edición (fijo) */}
              <AssetEditPanel
                activo={selectedAsset}
                onClose={handleClosePanel}
                onUpdateAsset={handleUpdateAsset}
                onDeleteAsset={handleDeleteAsset}
              />
            </div>
          )}
        </div>
      );
      
      setDomainContent('activos', content);
    } else {
      // Limpiar contenido cuando el dominio no está activo
      setDomainContent('activos', null);
    }
  }, [activeDomain, activos, loading, error, showAddForm, selectedAsset, patrimonioNeto, totalActivos, totalPasivos, setDomainContent]);

  // La página no renderiza nada directamente - todo se inyecta en el contexto circular
  return null;
}

