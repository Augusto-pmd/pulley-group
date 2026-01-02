# Reporte de Pruebas Funcionales - Pulley Group
**Fecha:** 2026-01-02  
**Ambiente:** Local (modo producción con PostgreSQL real)

---

## ✅ ENDPOINTS FUNCIONALES

### 1. GET /api/movements
- **Status:** 200 OK
- **Response:** `[]` (array vacío)
- **Estado:** ✅ FUNCIONA CORRECTAMENTE
- **Observación:** Retorna array vacío cuando no hay movimientos

### 2. POST /api/assets
- **Status:** 201 Created
- **Request:** `{"name":"Test Asset QA","type":"inmueble"}`
- **Response:** `{"id":"cmjx5s3wp000rq8f2euzvspik","name":"Test Asset QA","type":"inmueble","fiscalStatus":"no_declarado"}`
- **Estado:** ✅ FUNCIONA CORRECTAMENTE
- **Observación:** Crea activo con `fiscalStatus` por defecto `no_declarado`

### 3. GET /api/assets
- **Status:** 200 OK
- **Response:** Array con 4 assets
- **Estado:** ✅ FUNCIONA CORRECTAMENTE
- **Observación:** Retorna todos los activos correctamente

---

## ❌ ENDPOINTS CON FALLOS

### 1. POST /api/movements
- **Status:** 500 Internal Server Error
- **Request:** 
  ```json
  {
    "type": "ingreso",
    "amountUSD": 1000,
    "currencyOriginal": "USD",
    "date": "2026-01-02",
    "conceptId": "test-concept-id",
    "monthId": "test-month-id"
  }
  ```
- **Error:** 
  ```json
  {
    "error": "Failed to create movement",
    "message": "Invalid `prisma.movement.create()` invocation:\n\nForeign key constraint violated: `Movement_conceptId_fkey (index)`"
  }
  ```
- **Estado:** ❌ FALLA
- **Causa:** Foreign key constraint - `conceptId` o `monthId` no existen en la base de datos
- **Mensaje DB:** `Foreign key constraint violated: Movement_conceptId_fkey (index)`

### 2. GET /api/months/{year}/{month}
- **Status:** 500 Internal Server Error
- **Request:** `GET /api/months/2026/1`
- **Error:** 
  ```json
  {
    "error": "Failed to fetch month"
  }
  ```
- **Estado:** ❌ FALLA
- **Causa:** Error interno al obtener/crear el mes
- **Observación:** No se muestra mensaje detallado del error

### 3. GET /api/concepts
- **Status:** 500 Internal Server Error
- **Request:** `GET /api/concepts`
- **Error:** Error interno del servidor (sin detalles)
- **Estado:** ❌ FALLA
- **Causa:** Error no especificado en la respuesta

### 4. GET /api/months
- **Status:** 200 OK (pero retorna array vacío)
- **Response:** `[]`
- **Estado:** ⚠️ FUNCIONA PERO SIN DATOS
- **Observación:** No hay meses creados en la base de datos

---

## RESUMEN

### Endpoints OK (3/7)
1. ✅ GET /api/movements
2. ✅ POST /api/assets
3. ✅ GET /api/assets

### Endpoints que fallan (4/7)
1. ❌ POST /api/movements (Foreign key constraint)
2. ❌ GET /api/months/{year}/{month} (Error interno)
3. ❌ GET /api/concepts (Error interno)
4. ⚠️ GET /api/months (OK pero sin datos)

---

## PROBLEMAS IDENTIFICADOS

### 1. POST /api/movements
**Problema:** Requiere `conceptId` y `monthId` válidos, pero no hay forma fácil de obtenerlos porque:
- GET /api/concepts falla (500)
- GET /api/months/{year}/{month} falla (500)

**Impacto:** No se pueden crear movimientos desde el frontend si los endpoints de consulta fallan.

### 2. GET /api/months/{year}/{month}
**Problema:** Error 500 sin mensaje detallado
**Impacto:** No se puede obtener/crear meses automáticamente

### 3. GET /api/concepts
**Problema:** Error 500 sin mensaje detallado
**Impacto:** No se pueden listar conceptos para seleccionar en el formulario

---

## RECOMENDACIONES

1. **Investigar errores 500** en GET /api/concepts y GET /api/months/{year}/{month}
2. **Mejorar manejo de errores** para mostrar mensajes más descriptivos
3. **Validar existencia** de conceptId y monthId antes de crear movimiento
4. **Implementar bootstrap** automático de conceptos y meses si no existen

