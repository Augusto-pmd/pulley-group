# REPORTE E2E - PULLEY

**Timestamp:** 2026-01-07T02:37:59.119Z

---

## RESULTADOS

- **Build:** PASS
- **API QA runner:** PASS
- **E2E:** EXECUTED (6 failed, 22 passed, 4 skipped)

---

## ERRORES DETECTADOS

### ERROR 1

**Módulo:** Activos  
**Ruta:** /activos  
**Paso que falla:** Crear asset - No se disparó request POST /api/assets  
**Severidad:** BLOQUEANTE

**Evidencia:**
- Request esperado: POST /api/assets
- Request observado: Ninguno
- Status code: N/A
- **Análisis:** El botón "Agregar activo" existe y se puede hacer click, pero no se dispara request POST a la API. Esto indica que el formulario no está correctamente cableado o el submit no funciona.

---

### ERROR 2

**Módulo:** Vida Mensual  
**Ruta:** /vida-mensual  
**Paso que falla:** Crear movement - No se disparó request POST /api/movements  
**Severidad:** BLOQUEANTE

**Evidencia:**
- Request esperado: POST /api/movements
- Request observado: Ninguno
- Status code: N/A
- **Análisis:** El formulario de agregar movement no dispara request POST. Puede ser que el formulario rápido no esté correctamente conectado o que falte el handler de submit.

---

### ERROR 3

**Módulo:** Inversiones  
**Ruta:** /investments  
**Paso que falla:** Crear investment - No se disparó request POST /api/investments  
**Severidad:** BLOQUEANTE

**Evidencia:**
- Request esperado: POST /api/investments
- Request observado: Ninguno
- Status code: N/A
- **Análisis:** Similar a Activos, el formulario de crear inversión no dispara request POST.

---

### ERROR 4

**Módulo:** Inversiones  
**Ruta:** /investments  
**Paso que falla:** Crear event - No se disparó request POST /api/investments/[id]/events  
**Severidad:** BLOQUEANTE

**Evidencia:**
- Request esperado: POST /api/investments/[id]/events
- Request observado: Ninguno
- Status code: N/A
- **Análisis:** El formulario de registrar evento no dispara request POST.

---

### ERROR 5

**Módulo:** Inversiones  
**Ruta:** /investments  
**Paso que falla:** Eliminar event - No existe botón para eliminar event  
**Severidad:** BLOQUEANTE

**Evidencia:**
- Request esperado: DELETE /api/investments/[id]/events/[eventId]
- Request observado: N/A (no existe botón)
- Status code: N/A
- **Análisis:** No hay UI para eliminar eventos de inversión desde la lista.

---

### ERROR 6

**Módulo:** Emma  
**Ruta:** /emma  
**Paso que falla:** Iniciar fondo - Botón interceptado por overlay (Ring)  
**Severidad:** ALTA

**Evidencia:**
- Request esperado: POST /api/emma o POST /api/movements
- Request observado: N/A (no se pudo hacer click)
- Status code: N/A
- Console errors: Element interceptado por overlay del Ring
- **Análisis:** El botón "Iniciar fondo" está visible pero no es clickeable porque el Ring (overlay central) intercepta los eventos de pointer. Problema de z-index o pointer-events.

---

### ERROR 7

**Módulo:** Concepts  
**Ruta:** /api/concepts  
**Paso que falla:** Bootstrap de conceptos - Solo crea 3 en lugar de 8+  
**Severidad:** MEDIA

**Evidencia:**
- Request esperado: POST /api/concepts (múltiples)
- Request observado: Solo 3 conceptos creados
- Status code: 200 (pero cantidad incorrecta)
- **Análisis:** El bootstrap de conceptos no está creando todos los conceptos base esperados.

---

## RESUMEN DE SEVERIDAD

- **BLOQUEANTE:** 5 errores (formularios no disparan requests, botones faltantes)
- **ALTA:** 1 error (UI no usable por overlay)
- **MEDIA:** 1 error (bootstrap incompleto)

---

## CONCLUSIÓN

Los tests E2E detectaron **7 errores críticos** que impiden el funcionamiento correcto de los flujos CRUD:

1. **Formularios no cableados:** Los formularios de crear (Activos, Vida Mensual, Inversiones, Events) no disparan requests POST a la API.
2. **Botones faltantes:** No existe UI para eliminar events de inversión.
3. **Problemas de UI:** El Ring intercepta clicks en Emma.
4. **Bootstrap incompleto:** Conceptos base no se crean correctamente.

**Recomendación:** Revisar handlers de submit en formularios y conexión con API. Verificar z-index del Ring en Emma.
