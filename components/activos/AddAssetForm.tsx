'use client';

import { useState } from 'react';
import Card from '../Card';
import { addActivo, type TipoActivo, type Activo, type EstadoFiscalActivo } from '@/mock/activos';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !valorInicial || isNaN(parseFloat(valorInicial))) return;

    const valorUsd = parseFloat(valorInicial);
    const nuevoActivo = addActivo(nombre, tipo, valorUsd, fechaValuacion, observaciones || undefined, estadoFiscal);
    onSave(nuevoActivo);
  };

  return (
    <Card padding="large">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-heading-2 text-gray-text-primary mb-1">Agregar activo</h2>
          <p className="text-body text-gray-text-tertiary">
            Registra un bien patrimonial con valor económico. El valor se expresa en USD.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            placeholder="Ej: Departamento Palermo, Auto Toyota..."
            required
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoActivo)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            required
          >
            <option value="inmueble">Inmueble</option>
            <option value="vehiculo">Vehículo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Valor Inicial (USD) */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Valor inicial (USD)</label>
          <input
            type="number"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            placeholder="0"
            required
            min="0"
            step="0.01"
          />
          <div className="mt-1.5 text-body-small text-gray-text-disabled">
            Valor en USD. Este será el valor actual del activo. Podrás actualizarlo mediante nuevas valuaciones.
          </div>
        </div>

        {/* Fecha de Valuación */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Fecha de valuación</label>
          <input
            type="date"
            value={fechaValuacion}
            onChange={(e) => setFechaValuacion(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
            required
          />
        </div>

        {/* Estado Fiscal */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Estado Fiscal</label>
          <select
            value={estadoFiscal}
            onChange={(e) => setEstadoFiscal(e.target.value as EstadoFiscalActivo)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70"
          >
            <option value="declarado">Declarado</option>
            <option value="no_declarado">No declarado</option>
          </select>
          <div className="text-body-small text-gray-text-tertiary mt-1.5">
            Define si este activo se incluye en cálculos fiscales (Bienes Personales).
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-body text-gray-text-primary mb-1.5">Observaciones (opcional)</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-border rounded-input text-body text-gray-text-primary focus:outline-none focus:border-blue-600 bg-white/70 resize-none"
            rows={3}
            placeholder="Notas sobre este activo..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-divider">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-body text-gray-text-tertiary hover:text-gray-text-primary transition-colors duration-fast"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-body font-medium rounded-button hover:bg-blue-700 transition-colors duration-fast"
          >
            Agregar activo
          </button>
        </div>
      </form>
    </Card>
  );
}

