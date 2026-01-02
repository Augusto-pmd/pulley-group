// Capa de abstracción para llamadas API
// API es la única fuente de datos

// Tipos básicos (alineados con Prisma)
export interface ApiMonth {
  id: string;
  year: number;
  month: number;
  status: 'abierto' | 'cerrado';
}

export interface ApiMovement {
  id: string;
  type: 'ingreso' | 'egreso';
  amountUSD: number;
  currencyOriginal: string;
  exchangeRate: number | null;
  date: string;
  status: 'pagado' | 'pendiente' | null;
  conceptId: string;
  monthId: string;
  concept?: {
    id: string;
    name: string;
    type: 'ingreso' | 'egreso';
    nature: 'fijo' | 'variable' | 'extraordinario';
  };
  month?: ApiMonth;
}

export interface ApiConcept {
  id: string;
  name: string;
  type: 'ingreso' | 'egreso';
  nature: 'fijo' | 'variable' | 'extraordinario';
}

export interface CreateMovementData {
  type: 'ingreso' | 'egreso';
  amountUSD: number;
  currencyOriginal: string;
  exchangeRate?: number | null;
  date: string;
  status?: 'pagado' | 'pendiente' | null;
  conceptId: string;
  monthId: string;
}

/**
 * Obtener todos los meses
 */
export async function getMonths(): Promise<ApiMonth[]> {
  try {
    const response = await fetch('/api/months', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getMonths:', error);
    throw error;
  }
}

/**
 * Obtener movimientos por año y mes
 */
export async function getMovements(year?: number, month?: number): Promise<ApiMovement[]> {
  try {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const url = `/api/movements${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getMovements:', error);
    throw error;
  }
}

/**
 * Crear un nuevo movimiento
 */
export async function createMovement(data: CreateMovementData): Promise<ApiMovement> {
  try {
    const response = await fetch('/api/movements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createMovement:', error);
    throw error;
  }
}

/**
 * Obtener todos los conceptos
 */
export async function getConcepts(): Promise<ApiConcept[]> {
  try {
    const response = await fetch('/api/concepts', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getConcepts:', error);
    throw error;
  }
}

/**
 * Crear un nuevo concepto (o obtenerlo si ya existe)
 */
export async function createConcept(data: {
  name: string;
  type: 'ingreso' | 'egreso';
  nature?: 'fijo' | 'variable' | 'extraordinario';
}): Promise<ApiConcept> {
  try {
    const response = await fetch('/api/concepts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        type: data.type,
        nature: data.nature || 'variable',
      }),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createConcept:', error);
    throw error;
  }
}

/**
 * Crear o obtener un mes
 */
export async function getOrCreateMonth(year: number, month: number): Promise<ApiMonth> {
  try {
    const response = await fetch('/api/months', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, month }),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in getOrCreateMonth:', error);
    throw error;
  }
}

/**
 * Cerrar un mes
 */
export async function closeMonth(year: number, month: number): Promise<ApiMonth> {
  try {
    const response = await fetch('/api/months/close', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ year, month }),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in closeMonth:', error);
    throw error;
  }
}

export interface UpdateMovementData {
  amountUSD?: number;
  exchangeRate?: number | null;
  status?: 'pagado' | 'pendiente' | null;
  date?: string;
  conceptId?: string;
}

/**
 * Actualizar un movimiento
 */
export async function updateMovement(id: string, data: UpdateMovementData): Promise<ApiMovement> {
  try {
    const response = await fetch(`/api/movements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in updateMovement:', error);
    throw error;
  }
}

/**
 * Eliminar un movimiento
 */
export async function deleteMovement(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/movements/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('Error in deleteMovement:', error);
    throw error;
  }
}

// ============================================================================
// TIPOS PARA ACTIVOS
// ============================================================================

export interface ApiAsset {
  id: string;
  name: string;
  type: 'inmueble' | 'vehiculo' | 'otro';
  fiscalStatus: 'declarado' | 'no_declarado';
  valuations?: ApiAssetValuation[];
  liability?: ApiLiability;
}

export interface ApiAssetValuation {
  id: string;
  assetId: string;
  valueUSD: number;
  date: string;
}

export interface ApiLiability {
  id: string;
  assetId: string;
  totalAmountUSD: number;
  remainingAmountUSD: number;
  installmentsTotal: number;
  installmentsRemaining: number;
  monthlyInstallmentUSD: number;
}

export interface CreateAssetData {
  name: string;
  type: 'inmueble' | 'vehiculo' | 'otro';
  fiscalStatus: 'declarado' | 'no_declarado';
}

export interface CreateAssetValuationData {
  valueUSD: number;
  date: string;
}

export interface CreateLiabilityData {
  totalAmountUSD: number;
  remainingAmountUSD: number;
  installmentsTotal: number;
  installmentsRemaining: number;
  monthlyInstallmentUSD: number;
}

export interface UpdateLiabilityData {
  totalAmountUSD?: number;
  remainingAmountUSD?: number;
  installmentsTotal?: number;
  installmentsRemaining?: number;
  monthlyInstallmentUSD?: number;
}

// ============================================================================
// FUNCIONES PARA ACTIVOS
// ============================================================================

/**
 * Obtener todos los activos
 */
export async function getAssets(): Promise<ApiAsset[]> {
  try {
    const response = await fetch('/api/assets', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      // Intentar obtener el mensaje de error del JSON
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear JSON, usar el texto de la respuesta
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Asegurar que siempre se devuelve un array
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getAssets:', error);
    // Re-lanzar el error para que el componente pueda manejarlo
    throw error;
  }
}

/**
 * Obtener un activo por ID
 */
export async function getAsset(id: string): Promise<ApiAsset> {
  try {
    const response = await fetch(`/api/assets/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in getAsset:', error);
    throw error;
  }
}

/**
 * Crear un nuevo activo
 */
export async function createAsset(data: CreateAssetData): Promise<ApiAsset> {
  try {
    const response = await fetch('/api/assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createAsset:', error);
    throw error;
  }
}

/**
 * Obtener valuaciones de un activo
 */
export async function getAssetValuations(assetId: string): Promise<ApiAssetValuation[]> {
  try {
    const response = await fetch(`/api/assets/${assetId}/valuations`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getAssetValuations:', error);
    throw error;
  }
}

/**
 * Crear una nueva valuación
 */
export async function createAssetValuation(
  assetId: string,
  data: CreateAssetValuationData
): Promise<ApiAssetValuation> {
  try {
    const response = await fetch(`/api/assets/${assetId}/valuations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createAssetValuation:', error);
    throw error;
  }
}

/**
 * Obtener pasivo de un activo
 */
export async function getAssetLiability(assetId: string): Promise<ApiLiability | null> {
  try {
    const response = await fetch(`/api/assets/${assetId}/liability`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in getAssetLiability:', error);
    throw error;
  }
}

/**
 * Crear un pasivo para un activo
 */
export async function createAssetLiability(
  assetId: string,
  data: CreateLiabilityData
): Promise<ApiLiability> {
  try {
    const response = await fetch(`/api/assets/${assetId}/liability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createAssetLiability:', error);
    throw error;
  }
}

/**
 * Actualizar pasivo de un activo
 */
export async function updateAssetLiability(
  assetId: string,
  data: UpdateLiabilityData
): Promise<ApiLiability> {
  try {
    const response = await fetch(`/api/assets/${assetId}/liability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in updateAssetLiability:', error);
    throw error;
  }
}

// ============================================================================
// TIPOS PARA INVERSIONES
// ============================================================================

export interface ApiInvestment {
  id: string;
  name: string;
  type: 'financiera' | 'inmobiliaria';
  startDate: string;
  targetAmountUSD: number;
  events?: ApiInvestmentEvent[];
}

export interface ApiInvestmentEvent {
  id: string;
  investmentId: string;
  type: 'aporte' | 'retiro' | 'ajuste';
  amountUSD: number;
  date: string;
  note: string | null;
}

export interface CreateInvestmentData {
  name: string;
  type: 'financiera' | 'inmobiliaria';
  startDate: string;
  targetAmountUSD: number;
}

export interface CreateInvestmentEventData {
  type: 'aporte' | 'retiro' | 'ajuste';
  amountUSD: number;
  date: string;
  note?: string | null;
}

// ============================================================================
// FUNCIONES PARA INVERSIONES
// ============================================================================

/**
 * Obtener todas las inversiones
 */
export async function getInvestments(): Promise<ApiInvestment[]> {
  try {
    const response = await fetch('/api/investments', {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getInvestments:', error);
    throw error;
  }
}

/**
 * Obtener una inversión por ID
 */
export async function getInvestment(id: string): Promise<ApiInvestment> {
  try {
    const response = await fetch(`/api/investments/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in getInvestment:', error);
    throw error;
  }
}

/**
 * Crear una nueva inversión
 */
export async function createInvestment(data: CreateInvestmentData): Promise<ApiInvestment> {
  try {
    const response = await fetch('/api/investments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createInvestment:', error);
    throw error;
  }
}

/**
 * Obtener eventos de una inversión
 */
export async function getInvestmentEvents(investmentId: string): Promise<ApiInvestmentEvent[]> {
  try {
    const response = await fetch(`/api/investments/${investmentId}/events`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error in getInvestmentEvents:', error);
    throw error;
  }
}

/**
 * Crear un evento de inversión
 */
export async function createInvestmentEvent(
  investmentId: string,
  data: CreateInvestmentEventData
): Promise<ApiInvestmentEvent> {
  try {
    const response = await fetch(`/api/investments/${investmentId}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error in createInvestmentEvent:', error);
    throw error;
  }
}

