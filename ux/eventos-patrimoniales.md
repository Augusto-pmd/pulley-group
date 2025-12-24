# Eventos Patrimoniales
## Pulley Group — Paradigma Central del Sistema

---

## Visión General

Pulley Group funciona bajo el paradigma de **EVENTOS PATRIMONIALES**. Cada cambio real en el patrimonio es un evento con fecha específica que impacta hacia adelante. Las proyecciones se alimentan de eventos, tienen historial, son editables y continúan desde el último estado.

**Filosofía Fundamental**
- Todo valor proyectado tiene estado actual e historial de eventos
- Ningún cambio pisa datos históricos
- Ningún cambio recalcula hacia atrás
- Ningún cambio borra contexto
- El sistema evoluciona con cada evento real

---

## Definición de Evento Patrimonial

### ¿Qué es un Evento Patrimonial?

Un evento patrimonial es:

- **Un cambio real ocurrido en una fecha específica**
- **Que impacta hacia adelante**
- **Que ajusta una proyección existente**
- **Que queda registrado para siempre**

### Características de un Evento

**Obligatorias:**
- Tipo de evento
- Fecha específica
- Monto / valor (si aplica)
- Contexto (inversión, fondo, vida mensual, etc.)

**Opcionales:**
- Nota / contexto
- Decisión relacionada (Bitácora)
- Archivos adjuntos (si aplica)

### Reglas Inquebrantables

1. **Los eventos NO se modifican**
   - Si hay un error, se agrega un evento de corrección
   - El evento original queda en el historial
   - El historial explica la evolución

2. **Los eventos NO se eliminan**
   - Si un evento fue incorrecto, se agrega un evento de corrección
   - El historial completo se mantiene
   - La evolución queda documentada

3. **Los eventos impactan hacia adelante**
   - Cada evento ajusta la proyección desde su fecha
   - La proyección continúa desde el último evento
   - Nunca se recalculan hacia atrás

4. **Los eventos tienen contexto**
   - Cada evento está fechado
   - Cada evento tiene tipo y monto
   - Cada evento puede tener nota explicativa

---

## Tipos de Eventos Patrimoniales

### 1. Eventos de Vida Mensual

**Ingreso:**
- Tipo: Ingreso
- Fecha: Fecha del ingreso
- Monto: Monto del ingreso
- Concepto: Concepto reutilizable o nuevo
- Categoría: Fijo / Variable / Extraordinario

**Egreso:**
- Tipo: Egreso
- Fecha: Fecha del egreso
- Monto: Monto del egreso
- Concepto: Concepto reutilizable o nuevo
- Categoría: Fijo / Variable / Extraordinario

**Impacto:**
- Ajusta el resultado neto del mes
- Alimenta el cálculo de gasto mensual promedio
- Impacta proyecciones de "meses de vida"

### 2. Eventos de Inversiones

**Capital Inicial:**
- Tipo: Capital inicial
- Fecha: Fecha de inicio de la inversión
- Monto: Capital inicial invertido
- Inversión: Inversión asociada

**Aporte:**
- Tipo: Aporte
- Fecha: Fecha del aporte
- Monto: Monto del aporte
- Inversión: Inversión asociada

**Retiro:**
- Tipo: Retiro
- Fecha: Fecha del retiro
- Monto: Monto retirado
- Inversión: Inversión asociada

**Cambio de Rendimiento:**
- Tipo: Cambio de rendimiento
- Fecha: Fecha del cambio
- Valor: Nuevo rendimiento esperado
- Inversión: Inversión asociada

**Pausa / Reanudación:**
- Tipo: Pausa / Reanudación
- Fecha: Fecha de pausa o reanudación
- Inversión: Inversión asociada

**Impacto:**
- Ajusta el capital de la inversión
- Ajusta la proyección de la inversión
- Impacta proyecciones globales

### 3. Eventos de Fondo Emma

**Aporte Inicial:**
- Tipo: Aporte inicial
- Fecha: Fecha de inicio del fondo
- Monto: Capital inicial

**Aporte Mensual:**
- Tipo: Aporte mensual
- Fecha: Fecha del aporte (mensual)
- Monto: Monto del aporte mensual

**Cambio de Aporte Mensual:**
- Tipo: Cambio de aporte mensual
- Fecha: Fecha del cambio
- Monto anterior: Monto anterior
- Monto nuevo: Nuevo monto mensual

**Aporte Extraordinario:**
- Tipo: Aporte extraordinario
- Fecha: Fecha del aporte
- Monto: Monto extraordinario

**Pausa / Reanudación:**
- Tipo: Pausa / Reanudación
- Fecha: Fecha de pausa o reanudación

**Impacto:**
- Ajusta el capital del fondo
- Ajusta la proyección del fondo
- Impacta proyecciones globales

### 4. Eventos de Proyecciones

**Ajuste de Supuestos:**
- Tipo: Ajuste de supuestos
- Fecha: Fecha del ajuste
- Supuesto: Supuesto modificado (ej: IPC, rendimiento)
- Valor anterior: Valor anterior
- Valor nuevo: Nuevo valor

**Impacto:**
- Ajusta todas las proyecciones hacia adelante
- No recalcula hacia atrás
- El historial explica el cambio

---

## Dos Capas de Datos

### Capa 1: Estado Actual

**Definición:**
- Lo que existe hoy
- Resultado de todos los eventos históricos
- Punto de partida para proyecciones

**Características:**
- Se actualiza con cada nuevo evento
- Es el resultado acumulado de eventos
- Nunca se modifica directamente
- Solo se actualiza desde eventos

**Ejemplo:**
- Estado actual del patrimonio: $10.000.000
- Este es el resultado de todos los eventos históricos
- Cada nuevo evento ajusta este estado

### Capa 2: Historial de Eventos

**Definición:**
- Lo que fue ocurriendo
- Fechado y explicado
- Orden cronológico

**Características:**
- Cada evento tiene fecha específica
- Cada evento tiene tipo y monto
- Cada evento puede tener nota
- El historial nunca se modifica

**Ejemplo:**
- Evento 1: "Capital inicial - $1.000.000" (01/01/2023)
- Evento 2: "Aporte - $200.000" (01/06/2023)
- Evento 3: "Retiro - $100.000" (01/12/2023)
- Estado actual: $1.100.000 (resultado de eventos)

---

## Cálculo de Proyecciones

### Fórmula Fundamental

**Proyección = Estado Actual + Eventos Futuros + Supuestos**

**Desglose:**
1. **Estado Actual**: Resultado de todos los eventos históricos
2. **Eventos Futuros**: Eventos programados o esperados
3. **Supuestos**: Rendimientos, IPC, etc.

### Reglas de Cálculo

1. **Siempre desde el estado actual**
   - La proyección comienza desde el estado actual
   - No se recalcula desde cero
   - No se recalcula hacia atrás

2. **Ajuste con cada evento**
   - Cada nuevo evento ajusta la proyección
   - La proyección se recalcula desde el nuevo estado
   - El historial explica el cambio

3. **Continuidad de la curva**
   - La proyección continúa desde el último evento
   - No hay saltos hacia atrás
   - La evolución es continua

### Ejemplo de Cálculo

**Estado Actual:**
- Patrimonio: $10.000.000
- Fecha: 01/03/2024

**Eventos Futuros (Programados):**
- Aporte mensual: $50.000 (cada mes)
- Aporte extraordinario: $500.000 (01/06/2024)

**Supuestos:**
- Rendimiento: 8% anual
- IPC: 25% anual

**Proyección a 10 años:**
- Se calcula desde $10.000.000
- Se agregan aportes programados
- Se aplican supuestos de rendimiento e IPC
- Se ajusta con cada nuevo evento

---

## UX Universal de Eventos

### Agregar Evento

**Modal Universal:**

**Campos Obligatorios:**
1. **Tipo de Evento**
   - Dropdown con tipos según contexto
   - Requerido

2. **Fecha**
   - Selector de fecha
   - Default: Fecha actual
   - Requerido

3. **Monto / Valor**
   - Input numérico
   - Requerido según tipo

**Campos Opcionales:**
4. **Nota**
   - Textarea
   - Placeholder: "Contexto del evento"
   - Opcional

5. **Decisión Relacionada**
   - Selector de decisión (Bitácora)
   - Opcional

**Botones:**
- "Agregar evento": Botón primario (azul sistema)
- "Cancelar": Botón texto

**Feedback:**
- Al agregar evento, la proyección se actualiza inmediatamente
- El evento aparece en el historial
- El estado actual se actualiza

### Historial de Eventos

**Card Universal:**

**Header:**
- Título: "HISTORIAL DE EVENTOS", 18px, peso 550
- Subtítulo: Contexto específico (ej: "Evolución de la inversión")
- Padding: 24px

**Lista:**
- Orden cronológico (más reciente primero o más antiguo primero)
- Cada evento: Fecha, Tipo, Monto, Impacto
- Altura de fila: 56px
- Hover: Fondo sutil

**Filtros (Opcional):**
- Por tipo de evento
- Por rango de fechas
- Por monto

**Navegación:**
- Click en evento: Vista detalle (si aplica)
- Scroll infinito o paginación (si hay muchos eventos)

---

## Aplicación por Módulo

### Vida Mensual

- Ingresos y egresos son eventos
- Recurrentes generan eventos mensuales sugeridos
- Cambios de monto crean nuevo evento (no sobrescriben)
- El historial explica la evolución del costo de vida

### Inversiones

- Capital inicial = evento
- Aportes posteriores = eventos
- Retiros = eventos
- Cambios de rendimiento = eventos
- La curva continúa desde el último evento

### Fondo Emma

- Cada aporte tiene fecha y monto
- Cambios de aporte mensual son eventos
- Aportes extraordinarios ajustan la proyección hacia adelante
- El historial explica cada cambio de curva

### Proyecciones

- La barra superior muestra el resultado dinámico
- Se recalcula a partir de eventos, no de supuestos fijos
- El estado actual es el punto de partida
- Los eventos futuros ajustan la proyección

### Bitácora

- Registra automáticamente eventos relevantes
- Conecta decisión + impacto + contexto
- Los eventos generados aparecen en la decisión
- La decisión explica el contexto de los eventos

### Dashboard

- Muestra el estado actual (resultado de eventos)
- Las proyecciones se calculan desde el estado actual
- Cada nuevo evento ajusta el dashboard
- El dashboard es dinámico, no estático

---

## Principios de Diseño

### 1. Inmutabilidad

- Los eventos nunca se modifican
- Los eventos nunca se eliminan
- El historial es permanente

### 2. Trazabilidad

- Cada evento tiene fecha
- Cada evento tiene contexto
- Cada evento tiene impacto visible

### 3. Continuidad

- Las proyecciones continúan desde el último evento
- No hay saltos hacia atrás
- La evolución es continua

### 4. Claridad

- Los eventos son claros y fechados
- El historial es navegable
- El impacto es visible

### 5. Edición Segura

- Agregar eventos es simple
- Modificar eventos pasados está prohibido
- Corregir eventos se hace agregando nuevos eventos

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] Cada módulo tiene sección de eventos
- [ ] Cada módulo tiene historial de eventos
- [ ] Los eventos no se modifican ni eliminan
- [ ] Las proyecciones se calculan desde el estado actual
- [ ] Los eventos impactan hacia adelante
- [ ] El historial es navegable y legible
- [ ] Agregar evento es simple pero completo
- [ ] El impacto es visible inmediatamente
- [ ] La conexión con Bitácora está definida
- [ ] El sistema evoluciona con cada evento

---

**Última actualización**: Paradigma de Eventos Patrimoniales definido
**Versión**: 1.0
**Estado**: Completo y listo para referencia de implementación

