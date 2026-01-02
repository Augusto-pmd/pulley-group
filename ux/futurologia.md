# Futurología - Simulación Fiscal y Patrimonial
## Pulley Group — Módulo de Planificación Predictiva

---

## Visión del Módulo

**Futurología** es un módulo de simulación que permite proyectar escenarios fiscales y patrimoniales futuros sin modificar datos reales ni generar obligaciones. Su objetivo es responder preguntas estratégicas antes de que ocurran los eventos.

**Principio Fundamental:**
- No toca datos reales
- No genera DDJJ
- No cambia estados
- Solo simula escenarios futuros
- Todo es "¿Qué pasaría si...?"

---

## Objetivos del Módulo

### Preguntas que Responde

1. **"¿Qué pasa si sigo así?"**
   - Proyección de facturación futura
   - Proyección de recategorización / exclusión de Monotributo
   - Proyección de impacto en Bienes Personales
   - Proyección de obligaciones fiscales futuras

2. **"¿Qué pasa si hago X?"**
   - Simulación de compra de activo
   - Simulación de venta de activo
   - Simulación de aumento de facturación
   - Simulación de reducción de facturación
   - Simulación de blanqueo de activos
   - Simulación de cambio en inversiones

3. **"¿Cuándo me conviene hacer X?"**
   - Timing óptimo para compras/ventas
   - Timing para cambios en facturación
   - Timing para declaraciones

---

## Estructura del Módulo

### 1. Vista Principal: Escenarios Activos

**Layout:**
- Lista de escenarios guardados
- Botón principal: "Nuevo Escenario"
- Filtros: Por tipo (Fiscal, Patrimonial, Mixto)
- Orden: Más recientes primero

**Card de Escenario:**
- Nombre del escenario
- Tipo (Fiscal / Patrimonial / Mixto)
- Fecha de creación
- Horizonte temporal
- Estado (Activo / Pausado)
- Acciones: Ver detalle, Duplicar, Eliminar

---

### 2. Creación de Escenario

**Paso 1: Definir Escenario Base**

- **Nombre del escenario**: Texto libre (ej: "Compra departamento 2025")
- **Tipo de escenario**:
  - Fiscal (solo impacto fiscal)
  - Patrimonial (solo impacto patrimonial)
  - Mixto (ambos)
- **Horizonte temporal**: 1, 2, 3, 5, 10 años
- **Fecha de inicio**: Default: hoy

**Paso 2: Seleccionar Variables a Simular**

**Variables Fiscales:**
- [ ] Facturación mensual futura
- [ ] Cambio en categoría de Monotributo
- [ ] Compra de activo declarable
- [ ] Venta de activo declarable
- [ ] Blanqueo de activo no declarado
- [ ] Cambio en gastos deducibles

**Variables Patrimoniales:**
- [ ] Compra de activo
- [ ] Venta de activo
- [ ] Nueva inversión
- [ ] Retiro de inversión
- [ ] Cambio en aportes mensuales
- [ ] Cambio en gastos mensuales

**Paso 3: Configurar Variables Seleccionadas**

Para cada variable seleccionada, mostrar formulario específico:

**Ejemplo: Facturación Mensual Futura**
- Monto mensual (USD o ARS)
- Fecha de inicio
- Duración (meses o hasta fecha)
- Aplicar inflación: Sí / No

**Ejemplo: Compra de Activo**
- Tipo de activo (Inmueble / Vehículo / Otro)
- Valor de compra (USD)
- Fecha de compra
- Financiamiento: Sí / No
  - Si Sí: Monto financiado, cuotas, valor cuota
- Estado fiscal: Declarado / No declarado

**Ejemplo: Blanqueo de Activo**
- Activo a blanquear (selector de activos no declarados)
- Fecha de blanqueo
- Valor declarado (USD)
- Impacto fiscal estimado

**Paso 4: Revisar y Crear**

- Resumen de variables configuradas
- Botón "Crear Escenario"
- Al crear, se ejecuta la simulación automáticamente

---

### 3. Vista de Detalle de Escenario

**Layout: 3 Columnas**

**Columna 1: Configuración del Escenario (Editable)**
- Nombre (editable)
- Tipo (no editable)
- Horizonte (editable)
- Variables configuradas (lista editable)
  - Cada variable tiene botón "Editar" y "Eliminar"
- Botón "Agregar Variable"
- Botón "Re-simular" (recalcula con nuevas variables)

**Columna 2: Resultados de Simulación (Read-only)**

**Sección: Impacto Fiscal**

**Monotributo:**
- Proyección de facturación acumulada (12 meses)
- % del tope de categoría actual
- Categoría proyectada (si cambia)
- Fecha estimada de recategorización
- Alerta: "Recategorización en X meses"

**Bienes Personales:**
- Base imponible proyectada (ARS)
- % del mínimo no imponible
- Debe presentar: Sí / No
- Monto estimado (si aplica)
- Alerta: "Presentación requerida en X años"

**IIBB:**
- Estado proyectado
- Obligaciones futuras

**Sección: Impacto Patrimonial**

**Patrimonio Total:**
- Valor actual (USD)
- Valor proyectado al final del horizonte (USD)
- Variación absoluta (USD)
- Variación porcentual (%)

**Distribución Proyectada:**
- Activos: X USD (%)
- Inversiones: X USD (%)
- Liquidez: X USD (%)
- Fondo Emma: X USD (%)

**Flujo de Caja Proyectado:**
- Ingresos mensuales promedio
- Egresos mensuales promedio
- Resultado mensual promedio
- Acumulado al final del horizonte

**Columna 3: Alertas y Recomendaciones**

**Alertas Predictivas:**
- Recategorización de Monotributo en riesgo
- Presentación de Bienes Personales requerida
- Liquidez insuficiente proyectada
- Crecimiento patrimonial bajo expectativa

**Recomendaciones:**
- "Considerar reducir facturación en X meses"
- "Blanquear activo Y antes de Z fecha"
- "Aumentar aportes a inversiones para alcanzar objetivo"

---

### 4. Comparación de Escenarios

**Vista: Comparación Side-by-Side**

- Selector de 2-3 escenarios a comparar
- Tabla comparativa:
  - Variable por variable
  - Resultado fiscal por resultado fiscal
  - Resultado patrimonial por resultado patrimonial
- Gráfico comparativo (opcional):
  - Evolución temporal de patrimonio
  - Evolución de facturación acumulada
  - Impacto fiscal acumulado

---

## Integración con Módulos Existentes

### Vida Mensual
- Usa ingresos y egresos históricos como base
- Proyecta ingresos/egresos futuros según variables del escenario
- No modifica eventos reales

### Activos
- Lee activos actuales (declarados y no declarados)
- Simula compras/ventas sin modificar activos reales
- Calcula impacto en patrimonio declarado

### Inversiones
- Lee inversiones actuales
- Simula nuevas inversiones o retiros
- Calcula impacto en patrimonio total

### Vista Contador
- Usa lógica fiscal existente
- Aplica variables del escenario
- Calcula obligaciones proyectadas
- No modifica estado fiscal real

### Proyecciones
- Usa supuestos de proyección existentes
- Aplica variables del escenario
- Calcula patrimonio proyectado
- No modifica proyecciones reales

---

## Reglas de Simulación

### Reglas Fiscales

1. **Monotributo:**
   - Usa topes actuales (o permite configurar topes futuros)
   - Calcula facturación acumulada últimos 12 meses
   - Determina categoría según topes
   - Alerta si excede tope

2. **Bienes Personales:**
   - Calcula base imponible: activos declarados + inversiones declaradas
   - Convierte a ARS usando TC proyectado
   - Compara con mínimo no imponible
   - Calcula monto estimado si excede

3. **IIBB:**
   - Proyecta obligaciones mensuales
   - No calcula monto (depende de jurisdicción)

### Reglas Patrimoniales

1. **Patrimonio Total:**
   - Suma: Activos (valor - pasivos) + Inversiones + Liquidez + Emma
   - Aplica variables del escenario
   - Proyecta hacia adelante con supuestos de proyección

2. **Flujo de Caja:**
   - Usa promedio histórico de Vida Mensual
   - Aplica cambios según variables
   - Proyecta acumulado

### Reglas de Validación

- No permite escenarios con datos inconsistentes
- Alerta si variables generan estados imposibles
- Valida que fechas sean futuras
- Valida que montos sean positivos

---

## Estados del Escenario

- **Activo**: Escenario visible y editable
- **Pausado**: Escenario guardado pero no visible en lista principal
- **Archivado**: Escenario histórico, solo lectura

---

## Acciones Disponibles

### Por Escenario

- **Ver detalle**: Abre vista de detalle
- **Editar**: Permite modificar variables
- **Duplicar**: Crea copia del escenario
- **Re-simular**: Recalcula resultados sin cambiar variables
- **Exportar**: Genera PDF o CSV con resultados
- **Eliminar**: Elimina escenario (con confirmación)

### Globales

- **Nuevo Escenario**: Crea escenario desde cero
- **Comparar Escenarios**: Abre vista de comparación
- **Plantillas**: Usar escenarios guardados como plantilla

---

## Visualización de Resultados

### Números Principales

- **Patrimonio Proyectado**: Número grande, USD, con variación vs. actual
- **Facturación Acumulada**: Número mediano, ARS, con % del tope
- **Impacto Fiscal**: Número mediano, ARS, con alerta si aplica

### Gráficos (Opcional)

- Evolución temporal de patrimonio
- Evolución de facturación acumulada
- Comparación de escenarios

### Alertas Visuales

- **Verde**: Todo OK, sin riesgos
- **Amarillo**: Atención requerida, riesgo medio
- **Rojo**: Acción urgente, riesgo alto

---

## Flujo de Uso Típico

### Caso 1: "¿Qué pasa si compro un departamento?"

1. Click "Nuevo Escenario"
2. Nombre: "Compra departamento 2025"
3. Tipo: Mixto
4. Horizonte: 5 años
5. Seleccionar: "Compra de activo"
6. Configurar:
   - Tipo: Inmueble
   - Valor: 150,000 USD
   - Fecha: 01/06/2025
   - Financiamiento: Sí (100,000 USD, 120 cuotas, 1,000 USD/cuota)
   - Estado fiscal: Declarado
7. Click "Crear Escenario"
8. Revisar resultados:
   - Impacto en patrimonio total
   - Impacto en Bienes Personales
   - Impacto en flujo de caja (cuota mensual)
   - Alertas si aplica

### Caso 2: "¿Qué pasa si sigo facturando así?"

1. Click "Nuevo Escenario"
2. Nombre: "Continuidad actual"
3. Tipo: Fiscal
4. Horizonte: 2 años
5. Seleccionar: "Facturación mensual futura"
6. Configurar:
   - Monto mensual: Promedio histórico (auto-calculado)
   - Fecha inicio: Hoy
   - Duración: 24 meses
   - Aplicar inflación: Sí
7. Click "Crear Escenario"
8. Revisar resultados:
   - Proyección de recategorización
   - Fecha estimada de exclusión
   - Alertas si aplica

---

## Consideraciones Técnicas

### Datos Base

- Usa datos reales como punto de partida
- No modifica datos reales
- Crea copia virtual para simulación

### Cálculos

- Usa misma lógica que módulos reales
- Aplica variables del escenario
- Proyecta hacia adelante

### Performance

- Simulaciones deben ejecutarse rápido (< 2 segundos)
- Cachear resultados si variables no cambian
- Lazy load de gráficos si aplica

---

## Integración con Roadmap

**Versión:** V3 o V4 (después de que módulos base estén estables)

**Dependencias:**
- Vida Mensual (V1)
- Activos (V1)
- Inversiones (V1)
- Vista Contador (V2)
- Proyecciones (V1)

**Valor:**
- Permite planificación estratégica
- Reduce riesgos fiscales
- Optimiza decisiones patrimoniales
- Diferencia Pulley Group de herramientas básicas

---

## Notas de Diseño

- Módulo debe sentirse como "laboratorio de experimentos"
- Claridad sobre qué es simulación vs. realidad
- Visualización clara de resultados
- Alertas útiles, no alarmistas
- Exportación para compartir con contador

---

## Preguntas Abiertas (Para Refinar)

1. ¿Permitir simular múltiples variables simultáneamente?
2. ¿Guardar historial de simulaciones?
3. ¿Permitir comparar más de 3 escenarios?
4. ¿Incluir gráficos o solo números?
5. ¿Exportar a PDF o solo CSV?

---

## Próximos Pasos

1. Validar con usuario si las preguntas son las correctas
2. Refinar flujo de creación de escenarios
3. Definir visualización exacta de resultados
4. Priorizar qué simulaciones son más valiosas
5. Integrar con roadmap de producto

