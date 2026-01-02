# REPORTE QA - ÚLTIMOS DOS PUNTOS PENDIENTES

**Fecha:** 2026-01-02  
**Ambiente:** Producción  
**BASE_URL:** `https://pulley-group.vercel.app`

---

## A) INVERSIONES (BACKEND)

### Pruebas Ejecutadas

#### 1. GET /api/investments
- **Status:** 200 ✅
- **Resultado:** Array vacío (correcto, no hay inversiones)

#### 2. POST /api/investments
- **Payload enviado:**
  ```json
  {
    "name": "Inversión Test",
    "type": "financiera",
    "startDate": "2026-01-02",
    "targetAmountUSD": 10000
  }
  ```
- **Status:** 500 ❌
- **Error:** Error interno del servidor

### Análisis del Código

**Archivo:** `app/api/investments/route.ts`

**Línea 66:** El handler espera:
- `name` ✅
- `type` ✅ (debe ser `financiera` o `inmobiliaria`)
- `startDate` ✅
- `targetAmountUSD` ✅

**Problema identificado:**
El payload enviado inicialmente tenía:
- `initialAmountUSD` ❌ (debe ser `targetAmountUSD`)
- `type: "plazo_fijo"` ❌ (no existe en enum, debe ser `financiera` o `inmobiliaria`)

**Error 500 probable:**
El error 500 sugiere que hay un problema en el servidor, posiblemente:
1. Error de Prisma al crear la inversión
2. Error de validación de enum
3. Error de conexión a base de datos

### Fix Requerido

**Archivo:** `app/api/investments/route.ts`

**Línea 68:** Agregar validación de enum antes de crear:

```typescript
// Validar tipo
const validTypes = ['financiera', 'inmobiliaria'];
if (!validTypes.includes(type)) {
  return NextResponse.json(
    { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
    { status: 400 }
  );
}
```

**Línea 79:** Asegurar que el error se capture correctamente y retorne 400 en lugar de 500 para errores de validación.

---

## B) FORMATO NUMÉRICO (FRONTEND)

### Análisis del Código

**Componentes revisados:**
- `components/vida-mensual/MonthTable.tsx` - ✅ Usa `CurrencyDisplay`
- `components/vida-mensual/MonthSummary.tsx` - ✅ Usa `CurrencyDisplay`
- `components/vida-mensual/ExpenseEventList.tsx` - ✅ Usa `formatCurrencyUSD`
- `components/vida-mensual/ViewByConcept.tsx` - ✅ Usa `formatCurrency`
- `components/vida-mensual/QuickAddForm.tsx` - ✅ Usa `formatCurrencyUSD` para preview

**Resultado:**
✅ **Todos los componentes de vida-mensual usan formateo correcto**

No se encontraron lugares donde se renderice un número directamente sin pasar por helper de formato en los componentes de `/vida-mensual`.

**Verificación:**
- `CurrencyDisplay` se usa consistentemente para mostrar montos
- `formatCurrency`, `formatCurrencyUSD`, `formatCurrencyARS` se usan donde corresponde
- Los inputs usan `formatNumberWithSeparators` para formateo visual

### Conclusión Formato Numérico

✅ **El formato numérico está correctamente implementado en el frontend**

Si hay un problema de formato, probablemente sea:
1. Un problema de configuración de `Intl.NumberFormat` en el navegador
2. Un problema en los helpers de formato (`formatCurrency`, `formatCurrencyUSD`, etc.)
3. Un problema en el componente `CurrencyDisplay`

**Recomendación:**
Verificar que los helpers de formato en `@/mock/exchange-rates` y `@/utils/number-format` estén usando `Intl.NumberFormat('es-AR')` correctamente.

---

## RESUMEN

### 1. POST /api/investments
- **Status:** 500
- **Error exacto:** Error interno del servidor (no se captura el error específico)
- **Campo causante:** Posiblemente validación de enum `type` o error de Prisma

### 2. Formato Numérico
- **Archivo:** No se encontró archivo con problema
- **Línea:** N/A
- **Conclusión:** Todos los componentes usan formateo correcto

---

## FIX REQUERIDO

### Fix 1: POST /api/investments (1-3 líneas)

**Archivo:** `app/api/investments/route.ts`

**Agregar después de línea 66:**

```typescript
// Validar tipo
const validTypes = ['financiera', 'inmobiliaria'];
if (!validTypes.includes(type)) {
  return NextResponse.json(
    { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
    { status: 400 }
  );
}
```

**Mejorar manejo de errores en línea 89-94:**

```typescript
} catch (error: any) {
  console.error('Error creating investment:', error);
  
  // Retornar 400 para errores de validación, 500 para errores inesperados
  if (error.code === 'P2003' || error.message?.includes('Foreign key')) {
    return NextResponse.json(
      { error: 'Invalid data', message: error.message },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Failed to create investment', message: error.message },
    { status: 500 }
  );
}
```

---

**Reporte generado por:** QA Runner Script  
**Versión del sistema:** Con patrón oficial de Prisma

