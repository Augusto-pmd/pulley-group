'use client';

import { useState } from 'react';
import Card from '../Card';
import { type TipoActivo, type Activo, type EstadoFiscalActivo } from '@/mock/activos';

interface AddAssetFormProps {
  onSave: (activo: Activo) => void;
  onClose: () => void;
}

export default function AddAssetForm({ onSave, onClose }: AddAssetFormProps) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoActivo>('otro');
  const [valorInicial, setValorInicial] = useState<string>('');
  const [fechaValuacion, setFechaValuacion] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estadoFiscal, setEstadoFiscal] = useState<EstadoFiscalActivo>('no_declarado'); // Default: no declarado
  const [observaciones, setObservaciones] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !valorInicial || isNaN(parseFloat(valorInicial))) return;

    const valorUsd = parseFloat(valorInicial);
    
    // Crear activo con estructura compatible con el tipo Activo del mock
    const nuevoActivo: Activo = {
      id: '', // Se asignará después de crear en la API
      nombre,
      tipo,
      valorActualUsd: valorUsd,
      fechaUltimaValuacion: fechaValuacion,
      estadoFiscal,
      observaciones: observaciones || undefined,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    onSave(nuevoActivo);
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-2 text-text-primary mb-1">Agregar activo</h2>
          <p className="text-body text-text-secondary">
            Registra un bien patrimonial con valor económico. El valor se expresa en USD.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-body transition-colors duration-fast"
          style={{ color: '#8E8E8A' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            placeholder="Ej: Departamento Palermo, Auto Toyota..."
            required
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoActivo)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            required
          >
            <option value="inmueble" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Inmueble</option>
            <option value="vehiculo" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Vehículo</option>
            <option value="otro" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Otro</option>
          </select>
        </div>

        {/* Valor Inicial (USD) */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Valor inicial (USD)</label>
          <input
            type="number"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            placeholder="0"
            required
            min="0"
            step="0.01"
          />
          <div className="mt-1.5 text-body-small text-text-secondary" style={{ opacity: 0.6 }}>
            Valor en USD. Este será el valor actual del activo. Podrás actualizarlo mediante nuevas valuaciones.
          </div>
        </div>

        {/* Fecha de Valuación */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Fecha de valuación</label>
          <input
            type="date"
            value={fechaValuacion}
            onChange={(e) => setFechaValuacion(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            required
          />
        </div>

        {/* Estado Fiscal */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Estado Fiscal</label>
          <select
            value={estadoFiscal}
            onChange={(e) => setEstadoFiscal(e.target.value as EstadoFiscalActivo)}
            className="w-full px-4 py-2.5 rounded-input text-body transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
          >
            <option value="declarado" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>Declarado</option>
            <option value="no_declarado" style={{ backgroundColor: '#1F2A33', color: '#F5F2EC' }}>No declarado</option>
          </select>
          <div className="text-body-small text-text-secondary mt-1.5" style={{ opacity: 0.6 }}>
            Define si este activo se incluye en cálculos fiscales (Bienes Personales).
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-body text-text-primary mb-1.5">Observaciones (opcional)</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-4 py-2.5 rounded-input text-body resize-none transition-colors duration-fast"
            style={{
              border: '1px solid rgba(142, 142, 138, 0.2)',
              color: '#F5F2EC',
              backgroundColor: 'rgba(31, 42, 51, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#B59A6A';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(142, 142, 138, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(31, 42, 51, 0.1)';
            }}
            rows={3}
            placeholder="Notas sobre este activo..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(142, 142, 138, 0.2)' }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-body transition-colors duration-fast"
            style={{ color: '#8E8E8A' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F5F2EC'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8E8E8A'}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-body font-medium rounded-button transition-colors duration-fast"
            style={{ backgroundColor: '#B59A6A', color: '#F5F2EC' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0885A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B59A6A'}
          >
            Agregar activo
          </button>
        </div>
      </form>
    </Card>
  );
}

