'use client';

import { useState } from 'react';
import Card from './Card';

type FilterType = 'all' | 'acciones' | 'bonos' | 'fondos' | 'otros';
type FilterStatus = 'all' | 'activas' | 'cerradas' | 'pendientes';
type FilterProfitability = 'all' | 'positivas' | 'negativas' | 'neutras';
type FilterHorizon = 'all' | 'corto' | 'mediano' | 'largo';
type SortBy = 'nombre' | 'resultado' | 'capital' | 'roi' | 'fecha';

interface InvestmentFiltersProps {
  onFilterChange?: (filters: {
    type: FilterType;
    status: FilterStatus;
    profitability: FilterProfitability;
    horizon: FilterHorizon;
    sortBy: SortBy;
  }) => void;
}

export default function InvestmentFilters({ onFilterChange }: InvestmentFiltersProps) {
  const [type, setType] = useState<FilterType>('all');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [profitability, setProfitability] = useState<FilterProfitability>('all');
  const [horizon, setHorizon] = useState<FilterHorizon>('all');
  const [sortBy, setSortBy] = useState<SortBy>('resultado');

  const handleChange = (
    filter: 'type' | 'status' | 'profitability' | 'horizon' | 'sortBy',
    value: FilterType | FilterStatus | FilterProfitability | FilterHorizon | SortBy
  ) => {
    if (filter === 'type') setType(value as FilterType);
    if (filter === 'status') setStatus(value as FilterStatus);
    if (filter === 'profitability') setProfitability(value as FilterProfitability);
    if (filter === 'horizon') setHorizon(value as FilterHorizon);
    if (filter === 'sortBy') setSortBy(value as SortBy);

    // Mock: notificar cambio (sin lógica real)
    if (onFilterChange) {
      onFilterChange({
        type: filter === 'type' ? (value as FilterType) : type,
        status: filter === 'status' ? (value as FilterStatus) : status,
        profitability: filter === 'profitability' ? (value as FilterProfitability) : profitability,
        horizon: filter === 'horizon' ? (value as FilterHorizon) : horizon,
        sortBy: filter === 'sortBy' ? (value as SortBy) : sortBy,
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

  return (
    <Card className="py-4">
      <div className="flex flex-wrap items-end gap-6">
        <FilterSelect
          label="Tipo"
          value={type}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'acciones', label: 'Acciones' },
            { value: 'bonos', label: 'Bonos' },
            { value: 'fondos', label: 'Fondos' },
            { value: 'otros', label: 'Otros' },
          ]}
          onChange={(value) => handleChange('type', value as FilterType)}
        />

        <FilterSelect
          label="Estado"
          value={status}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'activas', label: 'Activas' },
            { value: 'cerradas', label: 'Cerradas' },
            { value: 'pendientes', label: 'Pendientes' },
          ]}
          onChange={(value) => handleChange('status', value as FilterStatus)}
        />

        <FilterSelect
          label="Rentabilidad"
          value={profitability}
          options={[
            { value: 'all', label: 'Todas' },
            { value: 'positivas', label: 'Positivas' },
            { value: 'negativas', label: 'Negativas' },
            { value: 'neutras', label: 'Neutras' },
          ]}
          onChange={(value) => handleChange('profitability', value as FilterProfitability)}
        />

        <FilterSelect
          label="Horizonte"
          value={horizon}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'corto', label: 'Corto' },
            { value: 'mediano', label: 'Mediano' },
            { value: 'largo', label: 'Largo' },
          ]}
          onChange={(value) => handleChange('horizon', value as FilterHorizon)}
        />

        <FilterSelect
          label="Ordenar por"
          value={sortBy}
          options={[
            { value: 'nombre', label: 'Nombre' },
            { value: 'resultado', label: 'Resultado' },
            { value: 'capital', label: 'Capital' },
            { value: 'roi', label: 'ROI' },
            { value: 'fecha', label: 'Fecha' },
          ]}
          onChange={(value) => handleChange('sortBy', value as SortBy)}
        />
      </div>
    </Card>
  );
}

