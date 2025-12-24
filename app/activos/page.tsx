'use client';

import { useState } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import AssetList from '@/components/activos/AssetList';
import AssetEditPanel from '@/components/activos/AssetEditPanel';
import AddAssetForm from '@/components/activos/AddAssetForm';
import { activosMock, type Activo } from '@/mock/activos';

export default function ActivosPage() {
  const [activos, setActivos] = useState<Activo[]>(activosMock);
  const [selectedAsset, setSelectedAsset] = useState<Activo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddAsset = (nuevoActivo: Activo) => {
    setActivos([...activos, nuevoActivo]);
    setShowAddForm(false);
  };

  const handleSelectAsset = (activo: Activo) => {
    setSelectedAsset(activo);
    setShowAddForm(false);
  };

  const handleClosePanel = () => {
    setSelectedAsset(null);
  };

  const handleUpdateAsset = (activoActualizado: Activo) => {
    setActivos(activos.map((a) => (a.id === activoActualizado.id ? activoActualizado : a)));
    setSelectedAsset(activoActualizado);
  };

  const totalActivos = activos.reduce((sum, a) => sum + a.valorActualUsd, 0);

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

