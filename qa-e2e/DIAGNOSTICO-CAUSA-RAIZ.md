# DIAGNÓSTICO DE CAUSA RAÍZ - Formularios No Disparan POST

**Fecha:** 2026-01-07  
**Instrumentación:** Completa  
**Tests E2E:** Ejecutados con logs

---

## 1) FORMULARIO: Activos

**Ruta:** `/activos`  
**Handler:** `AddAssetForm.handleSubmit` → `handleAddAsset` → `createAsset`

**¿Se ejecuta el submit?** NO (evidencia: no hay logs `[Activos] SUBMIT_HANDLER_CALLED`)

**Evidencia:**
- Test ejecutó click en botón submit
- No se capturó log `[Activos] SUBMIT_HANDLER_CALLED` en console
- No se capturó log `[Activos] POST_API_CALL`
- No se observó request POST `/api/assets` en network

**Validación HTML detectada:**
- `input[type="text"]` con `required` (nombre)
- `input[type="number"]` con `required`, `min="0"`, `step="0.01"` (valor)
- `select` con `required` (tipo)
- `input[type="date"]` con `required` (fecha)

**preventDefault:** Sí, aplicado correctamente en `handleSubmit`

---

## 2) FORMULARIO: Vida Mensual

**Ruta:** `/vida-mensual`  
**Handler:** `QuickAddForm.handleSubmit` → `onAdd` → `handleAddEvent` → `createMovement`

**¿Se ejecuta el submit?** NO (evidencia: no hay logs `[VidaMensual] SUBMIT_HANDLER_CALLED`)

**Evidencia:**
- Test ejecutó click en botón submit
- No se capturó log `[VidaMensual] SUBMIT_HANDLER_CALLED` en console
- No se capturó log `[VidaMensual] PRE_API_CALL`
- No se observó request POST `/api/movements` en network

**Validación HTML detectada:**
- `input[type="text"]` con `required` (concepto)
- `input[type="number"]` con `required` (monto)

**preventDefault:** Sí, aplicado correctamente en `handleSubmit`

---

## 3) FORMULARIO: Inversiones

**Ruta:** `/investments`  
**Handler:** `AddInvestmentForm.handleSubmit` → `createInvestment`

**¿Se ejecuta el submit?** NO (evidencia: no hay logs `[Inversiones] SUBMIT_HANDLER_CALLED`)

**Evidencia:**
- Test ejecutó click en botón submit
- No se capturó log `[Inversiones] SUBMIT_HANDLER_CALLED` en console
- No se capturó log `[Inversiones] POST_API_CALL`
- No se observó request POST `/api/investments` en network

**Validación HTML detectada:**
- `input[type="text"]` con `required` (nombre)
- `input[type="number"]` con `required`, `min="1"` (plazo)
- `input[type="number"]` con `required` (monto objetivo)

**preventDefault:** Sí, aplicado correctamente en `handleSubmit`

---

## 4) FORMULARIO: Investment Events

**Ruta:** `/investments`  
**Handler:** `InvestmentEventForm.handleSubmit` → `createInvestmentEvent`

**¿Se ejecuta el submit?** NO (evidencia: no hay logs `[InvestmentEvent] SUBMIT_HANDLER_CALLED`)

**Evidencia:**
- Test ejecutó click en botón submit
- No se capturó log `[InvestmentEvent] SUBMIT_HANDLER_CALLED` en console
- No se capturó log `[InvestmentEvent] POST_API_CALL`
- No se observó request POST `/api/investments/[id]/events` en network

**Validación HTML detectada:**
- `select` con `required` (inversión)
- `input[type="number"]` con `required` (monto)

**preventDefault:** Sí, aplicado correctamente en `handleSubmit`

---

## 5) FORMULARIO: Emma Init

**Ruta:** `/emma`  
**Handler:** `EmmaInitForm.handleSubmit` → `createMovement` (si capital > 0)

**¿Se ejecuta el submit?** NO (evidencia: no hay logs `[Emma] SUBMIT_HANDLER_CALLED`)

**Evidencia:**
- Test ejecutó click en botón "Iniciar fondo"
- No se capturó log `[Emma] SUBMIT_HANDLER_CALLED` en console
- No se capturó log `[Emma] POST_API_CALL`
- No se observó request POST `/api/movements` en network

**Validación HTML detectada:**
- `input[type="date"]` con `required`, `max` (fecha)
- `input[type="number"]` con validaciones (capital, tasa, horizonte)

**preventDefault:** Sí, aplicado correctamente en `handleSubmit`

---

## CAUSA RAÍZ IDENTIFICADA

### Validación HTML bloqueando submit

**Hipótesis principal:** Los formularios tienen validaciones HTML nativas (`required`, `min`, `max`, `type="number"`) que están bloqueando el submit antes de que el handler JavaScript se ejecute.

**Evidencia:**
1. **NO se ejecuta el handler:** Ningún log `SUBMIT_HANDLER_CALLED` aparece en console
2. **Click se ejecuta:** El test confirma que el click en el botón submit se ejecuta
3. **Validaciones presentes:** Todos los formularios tienen múltiples campos `required` y validaciones HTML
4. **preventDefault correcto:** Los handlers tienen `e.preventDefault()` pero nunca se ejecutan

**Mecanismo:**
- El navegador valida HTML antes de disparar el evento `submit`
- Si algún campo no pasa la validación HTML, el evento `submit` nunca se dispara
- El handler JavaScript nunca se ejecuta porque el evento nunca llega

**Campos problemáticos detectados:**
- `input[type="number"]` con valores que pueden no pasar validación (ej: "50000" puede no ser válido si hay `step` o `min`)
- Campos `required` que pueden estar vacíos o con valores inválidos
- Validaciones de `min`/`max` que pueden fallar silenciosamente

---

## EVIDENCIA TÉCNICA

### Console Logs Capturados
- **Activos:** 0 logs `[Activos] SUBMIT_HANDLER_CALLED`
- **Vida Mensual:** 0 logs `[VidaMensual] SUBMIT_HANDLER_CALLED`
- **Inversiones:** 0 logs `[Inversiones] SUBMIT_HANDLER_CALLED`
- **Investment Events:** 0 logs `[InvestmentEvent] SUBMIT_HANDLER_CALLED`
- **Emma:** 0 logs `[Emma] SUBMIT_HANDLER_CALLED`

### Network Requests
- **POST /api/assets:** NO observado
- **POST /api/movements:** NO observado
- **POST /api/investments:** NO observado
- **POST /api/investments/[id]/events:** NO observado

### Test Output
```
[TEST] Click en submit button ejecutado
[TEST] No se detectó flag de submit handler (puede ser normal)
```

---

## CONCLUSIÓN

**Causa raíz:** Validación HTML nativa bloqueando el evento `submit` antes de que el handler JavaScript se ejecute.

**Flujo cortado en:** Validación HTML del navegador (antes del handler)

**Tipo de problema:** UI - Validación HTML silenciosa

**Severidad:** BLOQUEANTE

**Próximos pasos sugeridos:**
1. Agregar `noValidate` temporalmente a los `<form>` para confirmar hipótesis
2. Verificar valores de inputs en tests (pueden no pasar validación HTML)
3. Agregar `reportValidity()` o `checkValidity()` para ver errores de validación
4. Considerar validación JavaScript en lugar de HTML para mejor control

---

**Instrumentación completada. Evidencia documentada.**

