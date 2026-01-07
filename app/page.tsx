'use client';

import { useMemo, useEffect, useState } from 'react';
import { useModeFromPath } from '@/hooks/useModeFromPath';
import { useRingData } from '@/contexts/RingDataContext';
import { getAssets, getInvestments, type ApiAsset, type ApiInvestment } from '@/lib/api';

export default function Dashboard() {
  useModeFromPath();
  const { setRingData } = useRingData();
  const [assets, setAssets] = useState<ApiAsset[]>([]);
  const [investments, setInvestments] = useState<ApiInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales
  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
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

  // El dashboard NO renderiza componentes adicionales
  // Solo actualiza los datos del Ring

  // MODO ESTADO: Solo el anillo, nada más visible
  // El dashboard ES el anillo
  // No renderizar nada - el anillo es el único protagonista
  return null;
}

