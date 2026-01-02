'use client';

import { useState, useEffect } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import AssetList from '@/components/activos/AssetList';
import AssetEditPanel from '@/components/activos/AssetEditPanel';
import AddAssetForm from '@/components/activos/AddAssetForm';
import { type Activo, type Pasivo, type ValuacionActivo } from '@/mock/activos';
import {
  getAssets,
  createAsset,
  createAssetValuation,
  getAssetValuations,
  getAssetLiability,
  createAssetLiability,
  updateAssetLiability,
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
    try {
      // Crear activo en la API
      const apiAsset = await createAsset({
        name: nuevoActivo.nombre,
        type: nuevoActivo.tipo,
        fiscalStatus: nuevoActivo.estadoFiscal,
      });

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
    } catch (err: any) {
      console.error('Error refreshing assets:', err);
    }
  };

  const totalActivos = activos.reduce((sum, a) => sum + a.valorActualUsd, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-gray-text-tertiary">Cargando activos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-body text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      {/* CAPA 1: ACCIÓN - Estado y acción principal */}
      <div className="mb-8">
        <ModuleHeader
          title="Activos"
          description="Bienes patrimoniales con valor económico"
          status={{
            label: 'Total',
            value: `${activos.length} activos`,
            color: 'info',
          }}
          primaryAction={{
            label: 'Agregar activo',
            onClick: () => {
              setShowAddForm(true);
              setSelectedAsset(null);
            },
          }}
        />
      </div>

      {/* CAPA 2: ZONA DE EDICIÓN (CLARA Y GUIADA) - Mostrar directamente al accionar */}
      {showAddForm && (
        <div className="mb-10">
          <AddAssetForm
            onSave={handleAddAsset}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* CAPA 3: CONTEXTO Y RESULTADO - Solo cuando no se está editando */}
      {!showAddForm && (
        <>
          {/* Lista de Activos */}
          <AssetList
            activos={activos}
            totalUsd={totalActivos}
            onSelectAsset={handleSelectAsset}
            selectedAssetId={selectedAsset?.id || null}
          />

          {/* Panel Lateral de Edición (fijo) */}
          <AssetEditPanel
            activo={selectedAsset}
            onClose={handleClosePanel}
            onUpdateAsset={handleUpdateAsset}
          />
        </>
      )}
    </>
  );
}

