'use client';

import { useMemo, useEffect, useState } from 'react';
import { useModeFromPath } from '@/hooks/useModeFromPath';
import { useRingData } from '@/contexts/RingDataContext';
import { getAssets, getInvestments, type ApiAsset, type ApiInvestment } from '@/lib/api';
import CurrencyDisplay from '@/components/CurrencyDisplay';

export default function Dashboard() {
  useModeFromPath();
  const { setRingData } = useRingData();
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [investments, setInvestments] = useState<ApiInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      const [apiAssets, apiInvestments] = await Promise.all([
        getAssets(),
        getInvestments(),
      ]);
      setAssets(Array.isArray(apiAssets) ? apiAssets : []);
      setInvestments(Array.isArray(apiInvestments) ? apiInvestments : []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setAssets([]);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Escuchar cambios en assets, investments y movements para re-sincronizar
  useEffect(() => {
    const handleAssetChanged = () => {
      loadData();
    };
    const handleInvestmentChanged = () => {
      loadData();
    };
    const handleMovementChanged = () => {
      loadData();
    };

    window.addEventListener('asset-changed', handleAssetChanged);
    window.addEventListener('investment-changed', handleInvestmentChanged);
    window.addEventListener('movement-changed', handleMovementChanged);

    return () => {
      window.removeEventListener('asset-changed', handleAssetChanged);
      window.removeEventListener('investment-changed', handleInvestmentChanged);
      window.removeEventListener('movement-changed', handleMovementChanged);
    };
  }, []);

  // Calcular patrimonio neto de activos (valor - pasivos)
  const patrimonioNetoActivos = useMemo(() => {
    try {
      if (!Array.isArray(assets) || assets.length === 0) {
        return 0;
      }
      const total = assets.reduce((sum, asset) => {
        const latestValuation = asset.valuations && asset.valuations.length > 0
          ? asset.valuations[0].valueUSD
          : 0;
        const liabilityAmount = asset.liability?.remainingAmountUSD || 0;
        return sum + latestValuation - liabilityAmount;
      }, 0);
      return isNaN(total) ? 0 : total;
    } catch (error) {
      console.error('Error calculating patrimonio neto:', error);
      return 0;
    }
  }, [assets]);

  // Calcular capital total de inversiones
  const capitalInversiones = useMemo(() => {
    try {
      return investments.reduce((sum, inv) => {
        // Calcular capital desde eventos
        const capital = inv.events?.reduce((acc, event) => {
          if (event.type === 'aporte') return acc + event.amountUSD;
          if (event.type === 'retiro') return acc - event.amountUSD;
          return acc;
        }, 0) || 0;
        return sum + capital;
      }, 0);
    } catch (error) {
      console.error('Error calculating capital inversiones:', error);
      return 0;
    }
  }, [investments]);

  // Calcular patrimonio total
  const totalPatrimony = useMemo(() => {
    return patrimonioNetoActivos + capitalInversiones;
  }, [patrimonioNetoActivos, capitalInversiones]);

  // No cargar movimientos en el dashboard
  // El dashboard solo muestra patrimonio total

  // No calcular resultados mensuales/anuales aquí
  // El dashboard solo muestra patrimonio total

  // Actualizar datos del Ring
  useEffect(() => {
    setRingData({
      patrimonioTotal: totalPatrimony,
    });
  }, [totalPatrimony, setRingData]);

  // Renderizar dashboard - el Ring es decorativo pero el contenido debe ser visible
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {loading ? (
          <div className="text-body text-text-secondary">Cargando...</div>
        ) : (
          <div className="space-y-4">
            <div className="text-caption text-text-secondary uppercase tracking-wider" style={{ opacity: 0.6 }}>
              PATRIMONIO TOTAL
            </div>
            <CurrencyDisplay value={totalPatrimony} size="display" showSecondary={true} />
          </div>
        )}
      </div>
    </div>
  );
}

