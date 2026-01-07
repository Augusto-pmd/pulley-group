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
    console.error('Error in createAsset:', error);
    throw error;
  }
}

/**
 * Actualizar un activo
 */
export interface UpdateAssetData {
  name?: string;
  type?: 'INMUEBLE' | 'VEHICULO' | 'OTRO';
  fiscalStatus?: 'declarado' | 'no_declarado';
}

export async function updateAsset(
  assetId: string,
  data: UpdateAssetData
): Promise<ApiAsset> {
  try {
    const response = await fetch(`/api/assets/${assetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    console.error('Error in updateAsset:', error);
    throw error;
  }
}

/**
 * Eliminar un activo
 */
export async function deleteAsset(assetId: string): Promise<void> {
  try {
    const response = await fetch(`/api/assets/${assetId}`, {
      method: 'DELETE',
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
  } catch (error: any) {
    console.error('Error in deleteAsset:', error);
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
    console.error('Error in createAssetValuation:', error);
    throw error;
  }
}

export interface UpdateAssetValuationData {
  valueUSD?: number;
  date?: string;
}

/**
 * Actualizar una valuación de activo
 */
export async function updateAssetValuation(
  assetId: string,
  valuationId: string,
  data: UpdateAssetValuationData
): Promise<ApiAssetValuation> {
  try {
    const response = await fetch(`/api/assets/${assetId}/valuations/${valuationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    console.error('Error in updateAssetValuation:', error);
    throw error;
  }
}

/**
 * Eliminar una valuación de activo
 */
export async function deleteAssetValuation(
  assetId: string,
  valuationId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/assets/${assetId}/valuations/${valuationId}`, {
      method: 'DELETE',
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
  } catch (error: any) {
    console.error('Error in deleteAssetValuation:', error);
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
 * Actualizar una inversión
 */
export interface UpdateInvestmentData {
  name?: string;
  type?: 'financiera' | 'inmobiliaria';
  targetAmountUSD?: number;
  startDate?: string;
}

export async function updateInvestment(
  investmentId: string,
  data: UpdateInvestmentData
): Promise<ApiInvestment> {
  try {
    const response = await fetch(`/api/investments/${investmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    console.error('Error in updateInvestment:', error);
    throw error;
  }
}

/**
 * Eliminar una inversión
 */
export async function deleteInvestment(investmentId: string): Promise<void> {
  try {
    const response = await fetch(`/api/investments/${investmentId}`, {
      method: 'DELETE',
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
  } catch (error: any) {
    console.error('Error in deleteInvestment:', error);
    throw error;
  }
}

// ============================================
// EMMA API
// ============================================

export interface ApiEmma {
  id: string;
  startDate: string | null;
  expectedRate: number;
  horizon: number;
  contributionFrequency: 'mensual' | 'anual';
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmmaData {
  startDate?: string | null;
  expectedRate: number;
  horizon: number;
  contributionFrequency: 'mensual' | 'anual';
}

/**
 * Obtener configuración de Emma (supuestos)
 */
export async function getEmma(): Promise<ApiEmma | null> {
  try {
    const response = await fetch('/api/emma', {
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
    return data; // Puede ser null si Emma no está iniciado
  } catch (error: any) {
    console.error('Error in getEmma:', error);
    throw error;
  }
}

/**
 * Guardar configuración de Emma (solo supuestos)
 */
export async function saveEmma(data: CreateEmmaData): Promise<ApiEmma> {
  try {
    const response = await fetch('/api/emma', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    console.error('Error in saveEmma:', error);
    throw error;
  }
}

/**
 * Obtener movimientos de Emma (filtrando por concepto "Aporte fondo Emma")
 */
export async function getEmmaMovements(): Promise<ApiMovement[]> {
  try {
    // Obtener todos los conceptos
    const concepts = await getConcepts();
    
    // Buscar el concepto "Aporte fondo Emma"
    const emmaConcept = concepts.find(c => c.name === 'Aporte fondo Emma');
    
    if (!emmaConcept) {
      // Si no existe el concepto, retornar array vacío
      return [];
    }
    
    // Obtener todos los movimientos
    const allMovements = await getMovements();
    
    // Filtrar movimientos del concepto Emma
    return allMovements.filter(m => m.conceptId === emmaConcept.id);
  } catch (error: any) {
    console.error('Error in getEmmaMovements:', error);
    return [];
  }
}

/**
 * Calcular estado de Emma desde movimientos reales
 */
export interface EmmaState {
  currentCapital: number;
  initialContribution: number;
  monthlyContribution: number;
  elapsedYears: number;
  elapsedMonths: number;
  startDate: string | null;
  totalContributions: number;
}

export async function getEmmaState(): Promise<EmmaState> {
  try {
    const movements = await getEmmaMovements();
    const emmaConfig = await getEmma();
    
    // Si no hay movimientos, retornar estado vacío
    if (movements.length === 0) {
      return {
        currentCapital: 0,
        initialContribution: 0,
        monthlyContribution: 0,
        elapsedYears: 0,
        elapsedMonths: 0,
        startDate: null,
        totalContributions: 0,
      };
    }
    
    // Ordenar movimientos por fecha
    const sortedMovements = [...movements].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calcular capital acumulado (suma de todos los movimientos de tipo ingreso)
    const currentCapital = sortedMovements
      .filter(m => m.type === 'ingreso')
      .reduce((sum, m) => sum + m.amountUSD, 0);
    
    // Aporte inicial es el primer movimiento
    const initialContribution = sortedMovements.length > 0 && sortedMovements[0].type === 'ingreso'
      ? sortedMovements[0].amountUSD
      : 0;
    
    // Calcular aporte mensual promedio (excluyendo el inicial)
    // Si hay más de un movimiento, calcular promedio de los movimientos posteriores al inicial
    const monthlyMovements = sortedMovements.slice(1).filter(m => m.type === 'ingreso');
    let monthlyContribution = 0;
    
    if (monthlyMovements.length > 0) {
      // Sumar todos los aportes posteriores al inicial
      const totalMonthly = monthlyMovements.reduce((sum, m) => sum + m.amountUSD, 0);
      monthlyContribution = totalMonthly / monthlyMovements.length;
    } else if (sortedMovements.length === 1 && sortedMovements[0].type === 'ingreso') {
      // Si solo hay un movimiento (el inicial), el aporte mensual es 0
      monthlyContribution = 0;
    }
    
    // Calcular tiempo transcurrido
    const startDate = sortedMovements[0].date;
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const elapsedYears = Math.floor(diffDays / 365.25);
    const elapsedMonths = Math.floor((diffDays % 365.25) / 30.44);
    
    // Total de aportes
    const totalContributions = sortedMovements
      .filter(m => m.type === 'ingreso')
      .reduce((sum, m) => sum + m.amountUSD, 0);
    
    return {
      currentCapital,
      initialContribution,
      monthlyContribution,
      elapsedYears,
      elapsedMonths,
      startDate,
      totalContributions,
    };
  } catch (error: any) {
    console.error('Error in getEmmaState:', error);
    return {
      currentCapital: 0,
      initialContribution: 0,
      monthlyContribution: 0,
      elapsedYears: 0,
      elapsedMonths: 0,
      startDate: null,
      totalContributions: 0,
    };
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
    console.error('Error in createInvestmentEvent:', error);
    throw error;
  }
}

export interface UpdateInvestmentEventData {
  type?: 'aporte' | 'retiro' | 'ajuste';
  amountUSD?: number;
  date?: string;
  note?: string | null;
}

/**
 * Actualizar un evento de inversión
 */
export async function updateInvestmentEvent(
  investmentId: string,
  eventId: string,
  data: UpdateInvestmentEventData
): Promise<ApiInvestmentEvent> {
  try {
    const response = await fetch(`/api/investments/${investmentId}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
    console.error('Error in updateInvestmentEvent:', error);
    throw error;
  }
}

/**
 * Eliminar un evento de inversión
 */
export async function deleteInvestmentEvent(
  investmentId: string,
  eventId: string
): Promise<void> {
  try {
    const response = await fetch(`/api/investments/${investmentId}/events/${eventId}`, {
      method: 'DELETE',
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
  } catch (error: any) {
    console.error('Error in deleteInvestmentEvent:', error);
    throw error;
  }
}

