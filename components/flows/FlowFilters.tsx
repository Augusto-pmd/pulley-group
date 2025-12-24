'use client';

import { useState } from 'react';
import Card from '../Card';
import { mockInvestments } from '@/mock/data';

type PeriodType = 'mes' | 'trimestre' | 'año' | 'custom';

interface FlowFiltersProps {
  onFilterChange?: (filters: {
    period: PeriodType;
    periodValue: string;
    investmentId: string;
  }) => void;
}

export default function FlowFilters({ onFilterChange }: FlowFiltersProps) {
  const [period, setPeriod] = useState<PeriodType>('mes');
  const [periodValue, setPeriodValue] = useState('2024-03');
  const [investmentId, setInvestmentId] = useState('all');

  const handleChange = (
    filter: 'period' | 'periodValue' | 'investmentId',
    value: string | PeriodType
  ) => {
    if (filter === 'period') setPeriod(value as PeriodType);
    if (filter === 'periodValue') setPeriodValue(value as string);
    if (filter === 'investmentId') setInvestmentId(value as string);

    // Mock: notificar cambio (sin lógica real)
    if (onFilterChange) {
      onFilterChange({
        period: filter === 'period' ? (value as PeriodType) : period,
        periodValue: filter === 'periodValue' ? (value as string) : periodValue,
        investmentId: filter === 'investmentId' ? (value as string) : investmentId,
      });
    }
  };

  const FilterSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }) => (
    <div className="flex flex-col gap-1">
      <label className="text-body text-gray-text-tertiary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-body text-black bg-transparent border-none outline-none cursor-pointer hover:text-blue-system transition-colors duration-fast"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Mock: generar opciones de período
  const monthOptions = [
    { value: '2024-03', label: 'Marzo 2024' },
    { value: '2024-02', label: 'Febrero 2024' },
    { value: '2024-01', label: 'Enero 2024' },
  ];

  const quarterOptions = [
    { value: '2024-Q1', label: 'Q1 2024' },
    { value: '2023-Q4', label: 'Q4 2023' },
    { value: '2023-Q3', label: 'Q3 2023' },
  ];

  const yearOptions = [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
  ];

  const investmentOptions = [
    { value: 'all', label: 'Todas' },
    ...mockInvestments.map((inv) => ({
      value: inv.id,
      label: inv.name,
    })),
  ];

  return (
    <Card className="py-4">
      <div className="flex flex-wrap items-end gap-6">
        {/* Filtro de Período - Solo uno activo a la vez */}
        {period === 'mes' && (
          <FilterSelect
            label="Mes"
            value={periodValue}
            options={monthOptions}
            onChange={(value) => {
              handleChange('periodValue', value);
              setPeriod('mes');
            }}
          />
        )}

        {period === 'trimestre' && (
          <FilterSelect
            label="Trimestre"
            value={periodValue}
            options={quarterOptions}
            onChange={(value) => {
              handleChange('periodValue', value);
              setPeriod('trimestre');
            }}
          />
        )}

        {period === 'año' && (
          <FilterSelect
            label="Año"
            value={periodValue}
            options={yearOptions}
            onChange={(value) => {
              handleChange('periodValue', value);
              setPeriod('año');
            }}
          />
        )}

        {period === 'custom' && (
          <div className="flex flex-col gap-1">
            <label className="text-body text-gray-text-tertiary">Período</label>
            <input
              type="text"
              value={periodValue}
              onChange={(e) => handleChange('periodValue', e.target.value)}
              placeholder="DD/MM/YYYY - DD/MM/YYYY"
              className="text-body text-black bg-transparent border border-gray-border rounded-button px-4 py-3 outline-none focus:border-blue-system transition-colors duration-fast min-w-[200px]"
            />
          </div>
        )}

        {/* Selector de tipo de período */}
        <div className="flex flex-col gap-1">
          <label className="text-body text-gray-text-tertiary">Ver por</label>
          <select
            value={period}
            onChange={(e) => {
              handleChange('period', e.target.value);
              // Reset periodValue cuando cambia el tipo
              if (e.target.value === 'mes') setPeriodValue('2024-03');
              if (e.target.value === 'trimestre') setPeriodValue('2024-Q1');
              if (e.target.value === 'año') setPeriodValue('2024');
              if (e.target.value === 'custom') setPeriodValue('');
            }}
            className="text-body text-black bg-transparent border-none outline-none cursor-pointer hover:text-blue-system transition-colors duration-fast"
          >
            <option value="mes">Mes</option>
            <option value="trimestre">Trimestre</option>
            <option value="año">Año</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Filtro de Inversión */}
        <FilterSelect
          label="Inversión"
          value={investmentId}
          options={investmentOptions}
          onChange={(value) => handleChange('investmentId', value)}
        />
      </div>
    </Card>
  );
}

