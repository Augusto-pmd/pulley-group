// API client para Vida Mensual
// Wrapper sobre fetch para mantener UX simple

import type { EventoMensual } from '@/mock/eventos';
import type { MonthState } from '@/mock/month-status';

const API_BASE = '/api';

// GET /api/movements?month=YYYY-MM
export async function fetchMovements(month: string): Promise<EventoMensual[]> {
  const response = await fetch(`${API_BASE}/movements?month=${month}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch movements');
  }
  return response.json();
}

// POST /api/movements
export async function createMovement(data: {
  conceptoId: string;
  tipo: 'ingreso' | 'egreso';
  fecha: string;
  monto: number;
  monedaOriginal: 'ARS' | 'USD';
  tipoCambioAplicado?: number;
  estado?: 'pagado' | 'pendiente';
  nota?: string;
}): Promise<EventoMensual> {
  const response = await fetch(`${API_BASE}/movements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to create movement');
  }
  return response.json();
}

// PATCH /api/movements/[id]
export async function updateMovement(
  id: string,
  data: {
    monto?: number;
    tipoCambioAplicado?: number;
    estado?: 'pagado' | 'pendiente';
    nota?: string;
  }
): Promise<EventoMensual> {
  const response = await fetch(`${API_BASE}/movements/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to update movement');
  }
  return response.json();
}

// DELETE /api/movements/[id]
export async function deleteMovement(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/movements/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to delete movement');
  }
}

// GET /api/months/[year]/[month]
export async function fetchMonthState(
  year: number,
  month: number
): Promise<MonthState> {
  const response = await fetch(`${API_BASE}/months/${year}/${month}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch month state');
  }
  const data = await response.json();
  return {
    mes: data.mes,
    estado: data.estado as 'ABIERTO' | 'CERRADO',
    fechaApertura: data.fechaApertura,
    fechaCierre: data.fechaCierre,
    nota: data.nota,
  };
}

// PATCH /api/months/[year]/[month] - Cerrar mes
export async function closeMonthAPI(
  year: number,
  month: number
): Promise<MonthState> {
  const response = await fetch(`${API_BASE}/months/${year}/${month}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'cerrado' }),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to close month');
  }
  const data = await response.json();
  return {
    mes: data.mes,
    estado: data.estado as 'ABIERTO' | 'CERRADO',
    fechaApertura: data.fechaApertura,
    fechaCierre: data.fechaCierre,
    nota: data.nota,
  };
}

// GET /api/concepts
export async function fetchConcepts(params?: {
  type?: 'ingreso' | 'egreso';
}): Promise<any[]> {
  const query = params?.type ? `?type=${params.type}` : '';
  const response = await fetch(`${API_BASE}/concepts${query}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch concepts');
  }
  return response.json();
}

// POST /api/concepts
export async function createConcept(data: {
  nombre: string;
  tipo: 'ingreso' | 'egreso';
  categoria: 'fijo' | 'variable' | 'extraordinario';
  recurrente?: boolean;
  frecuencia?: 'mensual' | 'bimestral' | 'trimestral' | 'semestral' | 'anual' | 'libre';
  montoEstimado?: number;
  nota?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE}/concepts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to create concept');
  }
  return response.json();
}

