# Reporte de Pruebas End-to-End - Pulley Group
**Fecha:** 2026-01-02 14:42:52  
**Ambiente:** Local (modo producción con PostgreSQL real)  
**Base de datos:** PostgreSQL productiva (DATABASE_URL)

---

## Tabla de Resultados

| Endpoint | Método | Status | Resultado | Error exacto |
|----------|--------|--------|-----------|--------------|
| `/api/months` | GET | 200 | ✅ OK | - |
| `/api/months/{year}/{month}` | GET | 500 | ❌ FALLA | `type "public.MonthStatus" does not exist` |
| `/api/concepts` | GET | 200 | ⚠️ VACÍO | Array vacío `[]` (bootstrap no ejecutado) |
| `/api/movements` | POST | N/A | ❌ NO PROBADO | No hay `conceptId` disponible (concepts retorna vacío) |
| `/api/movements` | GET | 200 | ✅ OK | Array vacío (esperado, no hay movimientos) |
| `/api/assets` | POST | 201 | ✅ OK | - |
| `/api/assets` | GET | 200 | ✅ OK | Activo creado aparece correctamente |

---

## Detalle de Pruebas

### A) HEALTH / BASE

**GET /api/months**
- **Status:** 200 OK
- **Body:** `[]` (array vacío)
- **Resultado:** ✅ Funciona correctamente
- **Observación:** Retorna array vacío cuando no hay meses

---

### B) MONTH (creación implícita)

**GET /api/months/2026/1**
- **Status:** 500 Internal Server Error
- **Error exacto:**
  ```json
  {
    "error": "Failed to fetch month",
    "message": "Invalid `prisma.month.upsert()` invocation:\n\nError occurred during query execution:\nConnectorError(ConnectorError { user_facing_error: None, kind: QueryError(PostgresError { code: \"42704\", message: \"type \\\"public.MonthStatus\\\" does not exist\", severity: \"ERROR\", detail: None, column: None, hint: None }), transient: false })"
  }
  ```
- **Resultado:** ❌ FALLA
- **Error raíz:** El enum `MonthStatus` no existe en PostgreSQL
- **Código PostgreSQL:** `42704` (tipo no existe)
- **Impacto:** No se puede crear/obtener meses automáticamente

---

### C) CONCEPTS

**GET /api/concepts**
- **Status:** 200 OK
- **Body:** `[]` (array vacío)
- **Resultado:** ⚠️ VACÍO
- **Observación:** 
  - El endpoint funciona (200 OK)
  - Pero retorna array vacío
  - El bootstrap no se ejecutó o falló silenciosamente
  - No hay conceptos disponibles para crear movimientos

---

### D) MOVEMENTS

**POST /api/movements**
- **Status:** N/A (no probado)
- **Razón:** No hay `conceptId` disponible porque GET /api/concepts retorna vacío
- **Payload intentado:**
  ```json
  {
    "type": "ingreso",
    "amountUSD": 1000,
    "currencyOriginal": "USD",
    "date": "2026-01-02",
    "conceptId": "<no disponible>",
    "monthId": "test-month-id"
  }
  ```
- **Resultado:** ❌ NO PROBADO (dependencia faltante)

**GET /api/movements**
- **Status:** 200 OK
- **Body:** `[]` (array vacío)
- **Resultado:** ✅ Funciona correctamente
- **Observación:** Retorna array vacío (esperado, no hay movimientos creados)

---

### E) ASSETS

**POST /api/assets**
- **Status:** 201 Created
- **Payload:**
  ```json
  {
    "name": "Activo Test",
    "type": "inmueble"
  }
  ```
- **Response:**
  ```json
  {
    "id": "cmjx5x0jh001mq8f2cjjc2gz0",
    "name": "Activo Test",
    "type": "inmueble",
    "fiscalStatus": "no_declarado"
  }
  ```
- **Resultado:** ✅ FUNCIONA CORRECTAMENTE
- **Observación:** Crea activo con `fiscalStatus` por defecto `no_declarado`

**GET /api/assets**
- **Status:** 200 OK
- **Body:** Array con 5 assets
- **Resultado:** ✅ FUNCIONA CORRECTAMENTE
- **Observación:** El activo creado aparece en la lista (ID: `cmjx5x0jh001mq8f2cjjc2gz0`)

---

## Conclusión

### ✅ Qué funciona (3/7 endpoints)

1. **GET /api/months** - Retorna array vacío correctamente
2. **GET /api/movements** - Retorna array vacío correctamente
3. **POST /api/assets** - Crea activos correctamente
4. **GET /api/assets** - Lista activos correctamente

### ❌ Qué falla (2/7 endpoints críticos)

1. **GET /api/months/{year}/{month}**
   - **Error raíz:** Enum `MonthStatus` no existe en PostgreSQL
   - **Código error:** `42704` (tipo no existe)
   - **Impacto:** CRÍTICO - No se pueden crear/obtener meses
   - **Bloquea:** Creación de movimientos (requiere monthId)

2. **GET /api/concepts**
   - **Error raíz:** Bootstrap no se ejecuta o falla silenciosamente
   - **Impacto:** CRÍTICO - No hay conceptos disponibles
   - **Bloquea:** Creación de movimientos (requiere conceptId)

### ⚠️ Endpoints no probados (1)

1. **POST /api/movements**
   - **Razón:** Dependencias faltantes (conceptId, monthId)
   - **Bloqueado por:** 
     - GET /api/concepts retorna vacío
     - GET /api/months/{year}/{month} falla con 500

---

## Errores Raíz Identificados

### 1. Enum `MonthStatus` faltante en PostgreSQL
- **Tipo:** Error de base de datos
- **Código:** `42704`
- **Mensaje:** `type "public.MonthStatus" does not exist`
- **Ubicación:** `app/api/months/[year]/[month]/route.ts` línea ~17 (upsert)
- **Solución requerida:** Crear enum `MonthStatus` en PostgreSQL con valores: `abierto`, `cerrado`

### 2. Bootstrap de conceptos no funciona
- **Tipo:** Lógica de aplicación
- **Ubicación:** `app/api/concepts/route.ts` línea ~17-31
- **Observación:** El código de bootstrap existe pero no se ejecuta o falla silenciosamente
- **Solución requerida:** Investigar por qué el bootstrap no crea conceptos

---

## Impacto en el Sistema

### Flujo bloqueado:
1. ❌ No se pueden obtener/crear meses → No hay `monthId`
2. ❌ No hay conceptos disponibles → No hay `conceptId`
3. ❌ No se pueden crear movimientos → Depende de `monthId` y `conceptId`
4. ✅ Assets funcionan independientemente

### Funcionalidad disponible:
- ✅ Crear y listar activos
- ✅ Consultar meses (lista vacía)
- ✅ Consultar movimientos (lista vacía)

### Funcionalidad bloqueada:
- ❌ Crear/obtener mes específico
- ❌ Crear movimientos
- ❌ Usar Vida Mensual (requiere movimientos)

---

## Recomendaciones

1. **URGENTE:** Crear enum `MonthStatus` en PostgreSQL
2. **URGENTE:** Investigar por qué el bootstrap de conceptos no funciona
3. **IMPORTANTE:** Mejorar manejo de errores para mostrar mensajes más descriptivos
4. **IMPORTANTE:** Validar existencia de enums antes de ejecutar queries

---

**Reporte generado:** 2026-01-02 14:42:52  
**Tester:** QA Automation  
**Ambiente:** Local Production Mode

