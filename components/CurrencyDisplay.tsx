'use client';

import { formatCurrencyUSD, formatCurrencyARS, formatCurrencyDual, convertArsToUsdCurrent, convertUsdToArsCurrent } from '@/mock/exchange-rates';

interface CurrencyDisplayProps {
  value: number; // Valor en USD (asumido por defecto, sistema USD-first)
  originalCurrency?: 'ARS' | 'USD'; // Moneda original del valor (default: USD)
  fecha?: string; // Fecha para conversión histórica (opcional)
  showSecondary?: boolean; // Mostrar ARS como referencia secundaria
  size?: 'display' | 'large' | 'medium' | 'regular';
  className?: string;
}

export default function CurrencyDisplay({
  value,
  originalCurrency = 'USD', // Default USD-first
  fecha,
  showSecondary = true,
  size = 'medium',
  className = '',
}: CurrencyDisplayProps) {
  // Convertir a USD (si viene en ARS)
  const usdValue = originalCurrency === 'ARS' 
    ? (fecha ? require('@/mock/exchange-rates').convertArsToUsd(value, fecha) : convertArsToUsdCurrent(value))
    : value; // Ya está en USD
  
  // Convertir USD a ARS para mostrar secundario
  const arsValue = originalCurrency === 'USD'
    ? (fecha ? require('@/mock/exchange-rates').convertUsdToArs(value, fecha) : convertUsdToArsCurrent(value))
    : (originalCurrency === 'ARS' ? value : convertUsdToArsCurrent(value)); // Si viene ARS, usar ese; si no, convertir USD

  const sizeClasses = {
    display: 'text-number-display number-hero',
    large: 'text-number-large number-glass',
    medium: 'text-number-medium number-glass',
    regular: 'text-number-regular number-soft',
  };

  // Tamaños del indicador USD según el tamaño del número
  const usdIndicatorSizes = {
    display: 'text-body-small',
    large: 'text-body-small',
    medium: 'text-caption',
    regular: 'text-caption',
  };

  if (showSecondary) {
    return (
      <div className={`${className} flex flex-col items-start`}>
        {/* Número principal con indicador USD */}
        <div className="flex items-baseline gap-1.5">
          <div className={`${sizeClasses[size]} leading-none py-1`} style={{
            display: 'block',
            textAlign: 'left',
          }}>
            {formatCurrencyUSD(usdValue)}
          </div>
          <span className={`${usdIndicatorSizes[size]} font-normal tracking-tight`} style={{
            color: 'rgba(59, 130, 59, 0.55)', // Verde petróleo suave, más discreto
            lineHeight: '1',
            paddingTop: '0.125rem', // Ajuste fino para alineación
          }}>
            usd
          </span>
        </div>
        {/* Referencia secundaria ARS con indicador explícito */}
        <div className="text-body-small text-gray-text-tertiary mt-1.5 opacity-70 flex items-baseline gap-1">
          {formatCurrencyARS(arsValue)}
          <span className="text-caption">ars</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <div className={`${sizeClasses[size]} leading-none py-1`} style={{
        display: 'block',
        textAlign: 'left',
      }}>
        {formatCurrencyUSD(usdValue)}
      </div>
      <span className={`${usdIndicatorSizes[size]} font-normal tracking-tight`} style={{
        color: 'rgba(59, 130, 59, 0.55)', // Verde petróleo suave, más discreto
        lineHeight: '1',
        paddingTop: '0.125rem', // Ajuste fino para alineación
      }}>
        usd
      </span>
    </div>
  );
}

// Helper para valores firmados (+/-)
export function CurrencyDisplaySigned(props: CurrencyDisplayProps) {
  const { value, showSecondary = true, size = 'medium', className = '', originalCurrency = 'USD' } = props;
  const sign = value >= 0 ? '+' : '';
  const absValue = Math.abs(value);
  
  // Convertir a USD (si viene en ARS)
  const usdValue = originalCurrency === 'ARS' 
    ? (props.fecha ? require('@/mock/exchange-rates').convertArsToUsd(absValue, props.fecha) : convertArsToUsdCurrent(absValue))
    : absValue; // Ya está en USD
  
  // Convertir USD a ARS para mostrar secundario
  const arsValue = originalCurrency === 'USD'
    ? (props.fecha ? require('@/mock/exchange-rates').convertUsdToArs(absValue, props.fecha) : convertUsdToArsCurrent(absValue))
    : absValue; // Si viene ARS, usar ese

  const sizeClasses = {
    display: 'text-number-display number-hero',
    large: 'text-number-large number-glass',
    medium: 'text-number-medium number-glass',
    regular: 'text-number-regular number-soft',
  };

  // Tamaños del indicador USD según el tamaño del número
  const usdIndicatorSizes = {
    display: 'text-body-small',
    large: 'text-body-small',
    medium: 'text-caption',
    regular: 'text-caption',
  };

  if (showSecondary) {
    return (
      <div className={`${className} flex flex-col items-start`}>
        {/* Número principal con signo e indicador USD */}
        <div className="flex items-baseline gap-1.5">
          <div className={`${sizeClasses[size]} leading-none py-1`} style={{
            display: 'block',
            textAlign: 'left',
          }}>
            <span className="text-gray-text-primary opacity-70">{sign}</span>
            {formatCurrencyUSD(usdValue)}
          </div>
          <span className={`${usdIndicatorSizes[size]} font-normal tracking-tight`} style={{
            color: 'rgba(59, 130, 59, 0.55)', // Verde petróleo suave, más discreto
            lineHeight: '1',
            paddingTop: '0.125rem', // Ajuste fino para alineación
          }}>
            usd
          </span>
        </div>
        {/* Referencia secundaria ARS con indicador explícito */}
        <div className="text-body-small text-gray-text-tertiary mt-1.5 opacity-70 flex items-baseline gap-1">
          {formatCurrencyARS(arsValue)}
          <span className="text-caption">ars</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <div className={`${sizeClasses[size]} leading-none py-1`} style={{
        display: 'block',
        textAlign: 'left',
      }}>
        <span className="text-gray-text-primary opacity-70">{sign}</span>
        {formatCurrencyUSD(usdValue)}
      </div>
      <span className={`${usdIndicatorSizes[size]} font-normal tracking-tight`} style={{
        color: 'rgba(59, 130, 59, 0.55)', // Verde petróleo suave, más discreto
        lineHeight: '1',
        paddingTop: '0.125rem', // Ajuste fino para alineación
      }}>
        usd
      </span>
    </div>
  );
}

