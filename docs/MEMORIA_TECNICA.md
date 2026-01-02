# MEMORIA TÉCNICA — PULLEY

## Versión: v1.0.0

## Fecha: 2026-01-02

---

## 1. Contexto

Pulley es un sistema de gestión patrimonial personal construido con:

- **Frontend/Backend:** Next.js 14 (App Router)
- **Base de datos:** PostgreSQL (Prisma ORM)
- **Hosting:** Vercel (Serverless Functions)
- **Arquitectura:** API REST + SSR/SSG híbrido

El sistema gestiona conceptos, meses, movimientos, activos e inversiones con cálculos patrimoniales en tiempo real.

---

## 2. Errores de Enfoque Cometidos

### 2.1. Atacar UI antes de validar backend real
**Error:** Modificar componentes frontend cuando el problema raíz estaba en la API o la base de datos.

**Impacto:** Tiempo perdido en cambios superficiales que no resolvían el problema real.

**Lección:** Siempre validar backend (API + DB) antes de tocar UI.

---

### 2.2. Probar en entornos distintos sin unificar base URL
**Error:** Ejecutar tests locales contra `localhost` mientras producción usaba `https://pulley-group.vercel.app`.

**Impacto:** Diferencias de comportamiento entre entornos que generaban confusión.

**Lección:** Unificar base URL en variable de entorno y validar siempre contra producción.

---

### 2.3. Asumir enums sin migración
**Error:** Definir enums en `prisma/schema.prisma` y asumir que Prisma los crearía automáticamente en PostgreSQL.

**Impacto:** Errores 500 con mensaje `type "public.XxxType" does not exist` en producción.

**Enums afectados:**
- `AssetType`, `FiscalStatus`
- `MovementType`, `MovementStatus`
- `MonthStatus`
- `ConceptType`, `ConceptNature`
- `InvestmentType`
- `InvestmentEventType`

**Lección:** Los enums de Prisma requieren migración SQL explícita en PostgreSQL.

---

### 2.4. Confiar en build exitoso como señal de funcionamiento
**Error:** Asumir que si `npm run build` pasaba, el sistema funcionaba correctamente.

**Impacto:** Errores de runtime en producción que no se detectaban en build time.

**Lección:** Build exitoso ≠ sistema funcional. Validar con tests E2E.

---

### 2.5. Inicializar Prisma con patrones no oficiales
**Error:** Implementar lazy initialization manual de PrismaClient con proxy y funciones custom.

**Impacto:** Errores de build en Vercel: `cannot reassign to a variable declared with const` y `the name 'prisma' is defined multiple times`.

**Lección:** Usar siempre el patrón oficial de Prisma para Next.js App Router con `globalThis`.

---

## 3. Señales Ignoradas (Early Warnings)

### 3.1. Errores 500 genéricos
**Señal:** Respuestas 500 sin mensaje de error claro o con stack traces genéricos.

**Causa raíz:** Enums faltantes en PostgreSQL o inicialización incorrecta de Prisma.

**Acción requerida:** Revisar logs de Vercel y validar schema de DB vs Prisma schema.

---

### 3.2. Diferencias entre runner y producción
**Señal:** Tests pasaban localmente pero fallaban en producción (o viceversa).

**Causa raíz:** Diferencias en:
- Variables de entorno
- Estado de la base de datos
- Versiones de dependencias
- Configuración de Prisma

**Acción requerida:** Ejecutar runner siempre contra URL de producción.

---

### 3.3. Endpoints vacíos sin error
**Señal:** `GET /api/concepts` devolvía `[]` sin error, pero el sistema esperaba datos.

**Causa raíz:** Base de datos vacía sin bootstrap automático.

**Acción requerida:** Implementar bootstrap idempotente en endpoints críticos.

---

### 3.4. Persistencia inexistente
**Señal:** Datos creados en POST no aparecían en GET posterior.

**Causa raíz:** 
- Errores silenciosos en creación (500 no manejado)
- Validaciones que rechazaban datos válidos
- Foreign keys faltantes

**Acción requerida:** Validar flujo completo: POST → GET → Verificación en UI.

---

## 4. Reglas Técnicas Permanentes (NO NEGOCIABLES)

### 4.1. Runner QA antes de cualquier deploy
**Regla:** Ejecutar `npm run qa` y verificar `QA PASSED — SISTEMA OPERATIVO` antes de hacer push o deploy.

**Justificación:** Detecta problemas estructurales antes de llegar a producción.

**Implementación:** Script `qa` en `package.json` ejecuta `qa/runner.js` contra producción.

---

### 4.2. Enums siempre con migración explícita
**Regla:** Cada enum definido en `prisma/schema.prisma` debe tener su migración SQL manual correspondiente.

**Formato de migración:**
```sql
CREATE TYPE "EnumName" AS ENUM ('value1', 'value2', 'value3');
```

**Ubicación:** `prisma/migrations/<timestamp>_add_<enum_name>_enum/migration.sql`

**Aplicación:** `npx prisma migrate deploy` después de crear la migración.

---

### 4.3. Prisma usando patrón oficial con globalThis
**Regla:** Usar siempre el patrón singleton oficial de Prisma para Next.js App Router.

**Implementación en `lib/prisma.ts`:**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Prohibido:** Lazy init manual, proxies, funciones `getPrisma()` custom.

---

### 4.4. Bootstrap automático desde DB vacía
**Regla:** Endpoints críticos deben crear datos base automáticamente si la tabla está vacía.

**Ejemplo:** `GET /api/concepts` crea conceptos base si `concepts.length === 0`.

**Implementación:**
```typescript
let concepts = await prisma.concept.findMany();
if (concepts.length === 0) {
  await prisma.concept.createMany({
    data: [/* conceptos base */],
    skipDuplicates: true,
  });
  concepts = await prisma.concept.findMany();
}
```

**Características:**
- Idempotente (usar `skipDuplicates: true`)
- No bloqueante (si falla, retornar array vacío)
- Logging para debugging

---

### 4.5. Validaciones devuelven 400, no 500
**Regla:** Errores de validación (campos faltantes, tipos incorrectos, FKs inexistentes) deben retornar 400 con mensaje claro.

**500 solo para:**
- Errores inesperados del servidor
- Fallos de conexión a DB
- Errores de Prisma no manejados

**Ejemplo:**
```typescript
if (!conceptId || !monthId) {
  return NextResponse.json(
    { error: 'conceptId and monthId are required' },
    { status: 400 }
  );
}

const concept = await prisma.concept.findUnique({ where: { id: conceptId } });
if (!concept) {
  return NextResponse.json(
    { error: `Concept with id "${conceptId}" does not exist` },
    { status: 400 }
  );
}
```

---

### 4.6. Una sola URL de producción válida
**Regla:** Todos los tests y validaciones deben usar la misma URL de producción.

**URL oficial:** `https://pulley-group.vercel.app`

**Configuración:** Variable `BASE_URL` en `qa/runner.js` y scripts de validación.

**Prohibido:** Hardcodear URLs diferentes o usar `localhost` para validar producción.

---

## 5. Patrones Aprobados

### 5.1. Runner QA E2E en Node (fetch + asserts)
**Patrón:** Script Node.js que ejecuta tests E2E contra producción usando `fetch` nativo.

**Ubicación:** `qa/runner.js`

**Características:**
- Tests secuenciales con dependencias (conceptId → movement)
- Validación de status codes y estructura de datos
- Generación de reporte JSON (`qa/report.json`)
- Exit code 0 si todos pasan, 1 si hay fallos

**Uso:** `npm run qa`

---

### 5.2. Bootstrap idempotente (createMany + skipDuplicates)
**Patrón:** Crear datos base usando `createMany` con `skipDuplicates: true`.

**Ventajas:**
- No falla si los datos ya existen
- Puede ejecutarse múltiples veces
- Transaccional (todo o nada)

**Ejemplo:**
```typescript
await prisma.concept.createMany({
  data: [
    { name: 'Ingreso', type: 'ingreso', nature: 'variable' },
    { name: 'Gasto', type: 'egreso', nature: 'variable' },
  ],
  skipDuplicates: true,
});
```

---

### 5.3. Upsert para entidades temporales (Month)
**Patrón:** Usar `prisma.month.upsert` para crear o leer meses automáticamente.

**Ventajas:**
- No requiere verificar existencia antes de crear
- Crea con valores por defecto si no existe
- Retorna siempre el registro (creado o existente)

**Ejemplo:**
```typescript
const monthRecord = await prisma.month.upsert({
  where: { year_month: { year, month } },
  update: {},
  create: { year, month, status: 'abierto', openDate: new Date() },
});
```

---

### 5.4. Separación API (numbers) vs UI (format)
**Patrón:** API siempre devuelve números como `number` (no strings). UI se encarga del formato.

**Ventajas:**
- Consistencia en API
- Flexibilidad en UI (diferentes formatos según contexto)
- Validación más simple (solo verificar tipo)

**Ejemplo:**
- API: `{ "amountUSD": 10000 }` (number)
- UI: `formatCurrency(10000)` → "10.000" o "$10,000"

---

## 6. Antipatrones Prohibidos

### 6.1. Lazy init manual de Prisma
**Antipatrón:**
```typescript
let prisma: PrismaClient | null = null;
export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}
```

**Problema:** No funciona correctamente en Vercel serverless functions. Causa errores de build.

**Solución:** Usar patrón oficial con `globalThis`.

---

### 6.2. Hardcodear URLs de API
**Antipatrón:**
```typescript
const response = await fetch('http://localhost:3000/api/concepts');
```

**Problema:** No funciona en producción, crea diferencias entre entornos.

**Solución:** Usar variable de entorno o constante centralizada.

---

### 6.3. Usar mocks para validar lógica productiva
**Antipatrón:** Validar funcionalidad usando datos mock en lugar de API real.

**Problema:** No detecta problemas reales de integración con DB o API.

**Solución:** Eliminar mocks y usar siempre APIs reales con bootstrap automático.

---

### 6.4. Deployar sin QA PASS
**Antipatrón:** Hacer push y deploy sin ejecutar `npm run qa` o ignorar fallos del runner.

**Problema:** Errores en producción que se podrían haber detectado antes.

**Solución:** Proceso obligatorio: QA PASS → Deploy → Verificación.

---

## 7. Proceso Oficial de Deploy

### Paso a paso obligatorio:

1. **Ejecutar QA:**
   ```bash
   npm run qa
   ```

2. **Verificar resultado:**
   - Debe mostrar: `QA PASSED — SISTEMA OPERATIVO`
   - Todos los tests deben pasar (9/9)
   - Si hay fallos, corregir antes de continuar

3. **Verificar estado del repo:**
   ```bash
   git status
   ```

4. **Commit y push (si hay cambios):**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push
   ```

5. **Deploy a producción:**
   ```bash
   npx vercel --prod --force
   ```

6. **Verificar timestamp del deployment:**
   - Confirmar que el deployment es reciente (minutos)
   - Verificar que la URL de producción responde correctamente

### Reglas durante deploy:
- ❌ NO modificar código durante el proceso
- ❌ NO tocar variables de entorno
- ❌ NO crear migraciones nuevas (a menos que sea el objetivo del deploy)

---

## 8. Estado Actual del Sistema

### Versión: v1.0.0 (2026-01-02)

### Estado operativo:
- ✅ **Sistema 100% operativo:** Todos los endpoints críticos funcionan
- ✅ **QA automatizado:** Runner E2E validando 9 endpoints
- ✅ **DB sincronizada:** Todos los enums creados en PostgreSQL
- ✅ **Baseline congelado:** Estado estable documentado

### Endpoints validados:
1. `GET /api/concepts` - Bootstrap automático
2. `GET /api/months` - Lista de meses
3. `GET /api/months/{year}/{month}` - Upsert automático
4. `POST /api/movements` - Creación con validaciones
5. `GET /api/movements` - Lista de movimientos
6. `POST /api/investments` - Creación de inversiones
7. `GET /api/investments` - Lista de inversiones
8. `POST /api/assets` - Creación de activos
9. `GET /api/assets` - Lista de activos

### Migraciones aplicadas:
- `AssetType`, `FiscalStatus`
- `MovementType`, `MovementStatus`
- `MonthStatus`
- `ConceptType`, `ConceptNature`
- `InvestmentType`
- `InvestmentEventType`

### Próximos pasos recomendados:
- Validar formato numérico en UI (requiere acceso visual)
- Expandir tests QA a más endpoints
- Documentar APIs con OpenAPI/Swagger
- Implementar CI/CD con validación automática de QA

---

## 9. Referencias Técnicas

### Documentación oficial:
- [Prisma Next.js Guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-serverless-environments)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

### Archivos clave del proyecto:
- `lib/prisma.ts` - Inicialización de Prisma (patrón oficial)
- `qa/runner.js` - Runner QA E2E
- `prisma/schema.prisma` - Schema de base de datos
- `package.json` - Scripts y dependencias

---

**Última actualización:** 2026-01-02  
**Mantenido por:** Equipo de desarrollo Pulley  
**Versión del documento:** 1.0.0

