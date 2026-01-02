# 🔍 Sistema de CI - Auditoría Automática

## Diseño del Pipeline

### Arquitectura General

```
GitHub Actions Workflow
├── Checkout código
├── Setup Node.js
├── Instalar dependencias (npm ci)
├── Build del proyecto (npm run build)
├── Lint del código (npm run lint)
├── TypeCheck TypeScript (npm run typecheck)
├── Smoke Tests - Render (npm run audit:smoke-render)
├── Validación Arquitectura (npm run audit:architecture)
├── Validación de Imports (npm run audit:imports)
├── Generar Reporte Final (npm run audit:report)
└── Resultado Final (OK / FAIL)
```

---

## Checks Obligatorios

### 1. **Instalación de Dependencias**
- **Script**: `npm ci`
- **Propósito**: Verificar que todas las dependencias se instalan correctamente
- **Criterio OK**: Exit code 0, sin errores de instalación
- **Criterio FAIL**: Exit code != 0, errores de dependencias faltantes o incompatibles

### 2. **Build del Proyecto**
- **Script**: `npm run build`
- **Propósito**: Verificar que el proyecto compila sin errores
- **Criterio OK**: Build exitoso, sin errores de TypeScript o Next.js
- **Criterio FAIL**: Errores de compilación, tipos incorrectos, o fallos de build

### 3. **Lint del Código**
- **Script**: `npm run lint`
- **Propósito**: Verificar calidad y consistencia del código
- **Criterio OK**: Sin errores de linting
- **Criterio FAIL**: Errores de ESLint o reglas de estilo

### 4. **TypeCheck (TypeScript)**
- **Script**: `npm run typecheck` → `node scripts/audit/typecheck.mjs`
- **Propósito**: Verificar tipos TypeScript sin emitir archivos
- **Criterio OK**: `tsc --noEmit` exitoso, sin errores de tipos
- **Criterio FAIL**: Errores de tipos, interfaces incompletas, o tipos incorrectos

---

## Smoke Tests

### 5. **Smoke Tests - Render de Páginas**
- **Script**: `npm run audit:smoke-render` → `node scripts/audit/smoke-render.mjs`
- **Propósito**: Verificar que las páginas principales pueden renderizarse
- **Páginas verificadas**:
  - `app/page.tsx` (Dashboard)
  - `app/vida-mensual/page.tsx`
  - `app/activos/page.tsx`
  - `app/investments/page.tsx`
  - `app/projections/page.tsx`
  - `app/emma/page.tsx`
  - `app/settings/page.tsx`
  - `app/layout.tsx`
- **Verificaciones**:
  - ✅ Archivo existe
  - ✅ Tiene `export default`
  - ✅ Tiene import de React/Next
  - ✅ Sintaxis válida
- **Criterio OK**: Todas las páginas pasan las verificaciones
- **Criterio FAIL**: Alguna página falla las verificaciones

---

## Validaciones Custom

### 6. **Validación Arquitectura (No Auth)**
- **Script**: `npm run audit:architecture` → `node scripts/audit/architecture.mjs`
- **Propósito**: Verificar que NO se use autenticación, tokens, o endpoints inexistentes
- **Patrones prohibidos detectados**:
  - ❌ `/api/auth`, `/api/login`, `/api/logout`, `/api/session`, `/api/user`
  - ❌ `login`, `Login`, `signin`, `signIn`, `authenticate`
  - ❌ `authToken`, `accessToken`, `refreshToken`, `jwt`, `JWT`
  - ❌ `localStorage.getItem('token')`, `sessionStorage.getItem('token')`
- **Endpoints válidos permitidos**:
  - ✅ `/api/months`
  - ✅ `/api/movements`
  - ✅ `/api/assets`
  - ✅ `/api/investments`
  - ✅ `/api/concepts`
- **Criterio OK**: No se encuentran patrones prohibidos
- **Criterio FAIL**: Se detecta código de autenticación o tokens

### 7. **Validación de Imports**
- **Script**: `npm run audit:imports` → `node scripts/audit/imports.mjs`
- **Propósito**: Verificar que todos los imports sean válidos y apunten a archivos existentes
- **Verificaciones**:
  - ✅ Imports relativos (`./`, `../`) resuelven a archivos existentes
  - ✅ Imports con alias `@/` resuelven correctamente
  - ✅ Extensiones de archivo válidas (`.ts`, `.tsx`, `.js`, `.jsx`)
  - ✅ Directorios con `index.ts`/`index.tsx` se resuelven correctamente
- **Criterio OK**: Todos los imports resuelven correctamente
- **Criterio FAIL**: Algún import no resuelve a archivo existente

---

## Generación de Reporte

### 8. **Generar Reporte Final**
- **Script**: `npm run audit:report` → `node scripts/audit/report.mjs`
- **Propósito**: Consolidar todos los resultados en un único reporte JSON
- **Output**: `audit-report.json`
- **Estructura del reporte**:
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "project": "Pulley Group",
  "version": "1.0.0",
  "checks": {
    "install": { "name": "...", "status": "PASS|FAIL", "command": "..." },
    "build": { ... },
    "lint": { ... },
    "typecheck": { ... },
    "smoke_render": { ... },
    "arch_validation": { ... },
    "imports_validation": { ... }
  },
  "summary": {
    "total": 7,
    "passed": 7,
    "failed": 0
  },
  "errors": [],
  "final_status": "OK|FAIL"
}
```

---

## Criterios de Éxito / Fracaso

### ✅ **Estado OK (PASS)**
El pipeline se considera **EXITOSO** si:
- ✅ Todos los checks (7) pasan sin errores
- ✅ `audit-report.json` muestra `"final_status": "OK"`
- ✅ `summary.failed === 0`
- ✅ No hay errores en `errors[]`

### ❌ **Estado FAIL**
El pipeline se considera **FALLIDO** si:
- ❌ Cualquier check falla (exit code != 0)
- ❌ `audit-report.json` muestra `"final_status": "FAIL"`
- ❌ `summary.failed > 0`
- ❌ Hay errores en `errors[]`

---

## Scripts NPM Disponibles

### Scripts Individuales
```bash
npm run typecheck              # TypeCheck TypeScript
npm run audit:smoke-render     # Smoke tests de render
npm run audit:architecture     # Validación arquitectura (no auth)
npm run audit:imports          # Validación de imports
npm run audit:report           # Generar reporte final
```

### Script Completo
```bash
npm run audit:all              # Ejecuta todos los checks en secuencia
```

---

## Compatibilidad

### GitHub Actions
- ✅ Compatible con GitHub Actions (ubuntu-latest)
- ✅ Compatible con self-hosted runners
- ✅ Usa `actions/checkout@v4` y `actions/setup-node@v4`
- ✅ Cache de npm habilitado

### Ejecución Local
Todos los scripts pueden ejecutarse localmente:
```bash
# Ejecutar checks individuales
npm run typecheck
npm run audit:smoke-render
npm run audit:architecture
npm run audit:imports

# Ejecutar todos
npm run audit:all
```

---

## Output y Artifacts

### Artifacts de GitHub Actions
- **Nombre**: `audit-report.json`
- **Retención**: 30 días
- **Ubicación**: Raíz del proyecto

### Logs de Consola
Cada check genera logs detallados:
- ✅ Checks exitosos muestran resumen
- ❌ Checks fallidos muestran errores específicos
- 📊 Reporte final muestra resumen consolidado

---

## Estructura de Archivos

```
.github/
└── workflows/
    └── audit.yml                    # Workflow de GitHub Actions

scripts/
└── audit/
    ├── typecheck.mjs               # TypeCheck TypeScript
    ├── smoke-render.mjs            # Smoke tests de render
    ├── architecture.mjs            # Validación arquitectura
    ├── imports.mjs                 # Validación de imports
    ├── report.mjs                  # Generador de reporte
    └── final-status.mjs            # Determinador de estado final

audit-report.json                   # Reporte final (generado)
```

---

## Flujo de Ejecución

### 1. Trigger
- Push a `main`/`master`
- Pull Request a `main`/`master`
- Ejecución manual (`workflow_dispatch`)

### 2. Ejecución Paralela
Todos los checks se ejecutan en secuencia (no paralelo para mejor diagnóstico):
1. Install → 2. Build → 3. Lint → 4. TypeCheck → 5. Smoke → 6. Arch → 7. Imports

### 3. Consolidación
- `audit:report` genera `audit-report.json`
- `final-status.mjs` determina estado final
- GitHub Actions marca el job como PASS/FAIL

### 4. Artifacts
- `audit-report.json` se sube como artifact
- Disponible para descarga por 30 días

---

## Criterios de Validación Detallados

### TypeCheck
- ✅ `tsc --noEmit` exitoso
- ✅ Sin errores de tipos
- ✅ Sin errores de sintaxis TypeScript

### Smoke Render
- ✅ Archivos de páginas existen
- ✅ Tienen `export default`
- ✅ Tienen imports válidos
- ✅ Sintaxis válida

### Arquitectura
- ✅ No hay código de autenticación
- ✅ No hay manejo de tokens
- ✅ No hay endpoints inexistentes
- ✅ Solo endpoints válidos en uso

### Imports
- ✅ Todos los imports relativos resuelven
- ✅ Todos los imports con `@/` resuelven
- ✅ No hay imports rotos

---

## Notas de Implementación

### No Modifica Código
- ✅ Todos los scripts son de **solo lectura**
- ✅ No modifican archivos del proyecto
- ✅ Solo generan reportes y logs

### Compatible Self-Hosted
- ✅ No requiere secrets de GitHub
- ✅ No requiere servicios externos
- ✅ Funciona en cualquier runner con Node.js 20+

### Extensible
- ✅ Fácil agregar nuevos checks
- ✅ Fácil modificar criterios
- ✅ Reporte JSON estructurado

---

## Ejemplo de Uso

### Ejecución Local Completa
```bash
# Instalar dependencias
npm ci

# Ejecutar auditoría completa
npm run audit:all

# Ver reporte
cat audit-report.json
```

### Ejecución en GitHub Actions
El workflow se ejecuta automáticamente en cada push/PR.

---

## Troubleshooting

### Check Falla
1. Revisar logs del check específico
2. Revisar `audit-report.json` para detalles
3. Ejecutar el check individualmente: `npm run <check-name>`

### Reporte No Generado
1. Verificar que `audit:report` se ejecutó
2. Verificar permisos de escritura en raíz del proyecto
3. Verificar que no hay errores en `report.mjs`

---

**Diseño completado** ✅
**Listo para implementación** ✅

