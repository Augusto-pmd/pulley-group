# REPORTE DE AUDITORÍA QA - PULLEY
**Fecha:** 2026-01-07  
**Auditor:** QA Lead + Full-Stack Auditor  
**Alcance:** Validación técnica, escaneo de rutas, matriz CRUD, consistencia de datos

---

## 1) RESULTADO BUILD

**Estado:** ✅ PASS

**Detalles:**
- Compilación exitosa sin errores de TypeScript
- Next.js build completado correctamente
- 14 páginas estáticas generadas
- Sin errores de linting ni validación de tipos

---

## 2) RESULTADO RUNNER (npm run qa)

**Estado:** ✅ PASS

**Endpoints probados:**
- GET /api/concepts: ✅ PASS (200)
- GET /api/months: ✅ PASS (200)
- GET /api/months/2026/01: ✅ PASS (200)
- POST /api/movements: ✅ PASS (201)
- GET /api/movements: ✅ PASS (200)
- POST /api/investments: ✅ PASS (201)
- GET /api/investments: ✅ PASS (200)
- POST /api/assets: ✅ PASS (201)
- GET /api/assets: ✅ PASS (200)

**Total:** 9/9 tests pasados

---

## 3) ERRORES POR MÓDULO

### ERROR 1: Investment Events - Sin edición ni eliminación
**Módulo:** Inversiones  
**Ruta:** /investments/[id]  
**Qué no funciona:** Los eventos de inversión (aportes, retiros, ajustes) se pueden crear pero NO se pueden editar ni eliminar desde la UI.

**Cómo reproducir:**
1. Ir a /investments
2. Seleccionar una inversión existente
3. Ir a la pestaña "Flujos"
4. Observar que los eventos se muestran (pero son datos mock, no reales)
5. No hay botones de editar/eliminar en cada evento

**Error observado:** 
- Componente `InvestmentFlows` usa datos mock (`mockFlows`) en lugar de datos reales de la API
- No hay endpoints DELETE ni PUT para `/api/investments/[id]/events`
- No hay funciones en `lib/api.ts` para `deleteInvestmentEvent` o `updateInvestmentEvent`
- No hay UI para editar/eliminar eventos individuales

**Severidad:** ALTA

---

### ERROR 2: Asset Valuations - Sin eliminación
**Módulo:** Activos  
**Ruta:** /activos  
**Qué no funciona:** Las valuaciones de activos se pueden crear pero NO se pueden eliminar desde la UI.

**Cómo reproducir:**
1. Ir a /activos
2. Seleccionar un activo
3. En el panel de edición, ver la sección de valuaciones
4. Observar que se pueden agregar nuevas valuaciones
5. No hay botón para eliminar valuaciones existentes

**Error observado:**
- No hay endpoint DELETE para `/api/assets/[id]/valuations`
- No hay función en `lib/api.ts` para `deleteAssetValuation`
- No hay UI para eliminar valuaciones individuales en `AssetEditPanel`

**Severidad:** MEDIA

---

### ERROR 3: InvestmentFlows muestra datos mock en lugar de reales
**Módulo:** Inversiones  
**Ruta:** /investments/[id]  
**Qué no funciona:** La pestaña "Flujos" muestra datos hardcodeados en lugar de eventos reales de la API.

**Cómo reproducir:**
1. Ir a /investments/[id]
2. Ir a la pestaña "Flujos"
3. Observar que los datos mostrados son siempre los mismos (mockFlows)
4. Los eventos reales creados desde "Registrar evento" no aparecen aquí

**Error observado:**
- `InvestmentFlows` componente usa `mockFlows` hardcodeado
- No carga eventos reales desde `getInvestmentEvents`
- No hay integración con la API

**Severidad:** ALTA

---

### ERROR 4: EmmaMovementsList - handleDeleteMovement no elimina
**Módulo:** Emma  
**Ruta:** /emma  
**Qué no funciona:** El handler `handleDeleteMovement` en `EmmaMovementsList` no llama a la API para eliminar, solo recarga la página.

**Cómo reproducir:**
1. Ir a /emma
2. Ver lista de movimientos de Emma
3. Click en un movimiento para editar
4. En el modal, click en "Eliminar"
5. Confirmar eliminación
6. Observar que `handleDeleteMovement` solo recarga la página sin llamar a `deleteMovement`

**Error observado:**
```typescript
// components/emma/EmmaMovementsList.tsx línea 45-54
const handleDeleteMovement = async (id: string) => {
  // Recargar movimientos desde la API
  const emmaMovements = await getEmmaMovements();
  setMovements(emmaMovements.sort(...));
  setEditingMovement(null);
  // Refrescar página para actualizar estado de Emma
  window.location.reload();
};
```
- No llama a `deleteMovement(id)` antes de recargar
- Solo recarga la página, no elimina realmente

**Severidad:** BLOQUEANTE

---

### ERROR 5: Activos - handleDeleteAsset no llama a deleteAsset
**Módulo:** Activos  
**Ruta:** /activos  
**Qué no funciona:** El handler `handleDeleteAsset` en `app/activos/page.tsx` no llama a la función `deleteAsset` de la API.

**Cómo reproducir:**
1. Ir a /activos
2. Seleccionar un activo
3. En el panel de edición, click en "Eliminar"
4. Confirmar eliminación
5. Observar que solo recarga la lista pero no elimina realmente

**Error observado:**
```typescript
// app/activos/page.tsx línea 133-150
const handleDeleteAsset = async (id: string) => {
  try {
    // Recargar activos desde la API
    const apiAssets = await getAssets();
    // ... solo recarga, no elimina
  }
}
```
- No llama a `deleteAsset(id)` de `lib/api.ts`
- Solo recarga la lista sin eliminar

**Severidad:** BLOQUEANTE

---

### ERROR 6: Dashboard - No refleja cambios en tiempo real
**Módulo:** Dashboard  
**Ruta:** /  
**Qué no funciona:** El dashboard (anillo) no se actualiza automáticamente cuando se crean/editan/eliminan activos, inversiones o movimientos.

**Cómo reproducir:**
1. Ir a / (dashboard)
2. Anotar el patrimonio total mostrado
3. Ir a /activos y crear un nuevo activo con valuación
4. Volver a / (dashboard)
5. Observar que el patrimonio total no cambió

**Error observado:**
- El dashboard solo carga datos al montar
- No hay suscripción a cambios en otros módulos
- Requiere recargar la página manualmente para ver cambios

**Severidad:** MEDIA

---

## 4) MATRIZ CRUD

| Entidad | Crear | Editar | Eliminar | Estado |
|---------|-------|--------|----------|--------|
| **Movement** | ✅ OK | ✅ OK | ⚠️ FAIL* | Parcial |
| **Asset** | ✅ OK | ✅ OK | ⚠️ FAIL** | Parcial |
| **Investment** | ✅ OK | ✅ OK | ✅ OK | Completo |
| **Investment Event** | ✅ OK | ❌ FAIL | ❌ FAIL | Incompleto |
| **Asset Valuation** | ✅ OK | ❌ FAIL | ❌ FAIL | Incompleto |
| **Emma Movement** | ✅ OK | ✅ OK | ⚠️ FAIL*** | Parcial |

**Notas:**
- \* Movement: Eliminar funciona en API pero `EmmaMovementsList.handleDeleteMovement` no llama a la API
- \** Asset: Eliminar funciona en API pero `app/activos/page.tsx.handleDeleteAsset` no llama a la API
- \*** Emma Movement: Mismo problema que Movement

---

## 5) ENDPOINTS FALTANTES

### DELETE /api/investments/[id]/events/[eventId]
**Estado:** ❌ NO EXISTE  
**Impacto:** No se pueden eliminar eventos de inversión individuales  
**Severidad:** ALTA

### PUT /api/investments/[id]/events/[eventId]
**Estado:** ❌ NO EXISTE  
**Impacto:** No se pueden editar eventos de inversión  
**Severidad:** ALTA

### DELETE /api/assets/[id]/valuations/[valuationId]
**Estado:** ❌ NO EXISTE  
**Impacto:** No se pueden eliminar valuaciones de activos  
**Severidad:** MEDIA

### PUT /api/assets/[id]/valuations/[valuationId]
**Estado:** ❌ NO EXISTE  
**Impacto:** No se pueden editar valuaciones existentes  
**Severidad:** MEDIA

---

## 6) INCONSISTENCIAS DE NAVEGACIÓN

### Navegación Jarvis/Anillo
**Estado:** ✅ FUNCIONAL
- Command Palette (⌘K o /) funciona correctamente
- Navegación radial del anillo funciona
- Retorno al dashboard desde cualquier módulo funciona

**Sin errores detectados en navegación.**

---

## RESUMEN EJECUTIVO

**Total de errores detectados:** 6

**Por severidad:**
- BLOQUEANTE: 2
- ALTA: 3
- MEDIA: 1

**Funcionalidades críticas rotas:**
1. Eliminación de movimientos de Emma no funciona realmente
2. Eliminación de activos no funciona realmente
3. Eventos de inversión no se pueden editar ni eliminar
4. Valuaciones de activos no se pueden eliminar
5. InvestmentFlows muestra datos mock en lugar de reales

**Recomendación:** Priorizar corrección de errores BLOQUEANTE y ALTA antes de deploy a producción.
