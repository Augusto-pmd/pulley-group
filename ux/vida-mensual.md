# Vida Mensual
## Pulley Group — Base Real del Sistema Patrimonial

---

## Visión General

La pantalla de Vida Mensual es el módulo fundamental que registra todos los ingresos y egresos personales del usuario. Es la base real del sistema patrimonial, alimentando conceptualmente Dashboard, Proyecciones e Inversiones. Su objetivo es permitir el cierre mensual en 2-3 minutos, sin fricción operativa.

**Filosofía de Uso Mensual**
- Cerrar el mes rápidamente (2-3 minutos)
- Confirmar recurrentes sugeridos, no cargar desde cero
- Ver resultado inmediato del mes
- Entender el costo de vida real
- Usar el sistema todos los meses, durante años

**Paradigma de Eventos Patrimoniales**
- Cada ingreso y egreso es un EVENTO con fecha específica
- Los eventos no se modifican, se agregan nuevos si hay cambios
- El historial de eventos explica la evolución del costo de vida
- Las proyecciones se ajustan desde el último evento, no desde cero
- El sistema evoluciona con cada evento real del usuario

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px) — contexto del sistema
- Contenido principal con scroll vertical
- Cards limpias con información clara
- Flujo de cierre mensual asistido

---

## Layout General

### Estructura de la Página

```
┌─────────────────────────────────────────┐
│ HEADER (64px, fixed)                   │
├─────────────────────────────────────────┤
│ BARRA PROYECCIONES (56px, fixed)        │
├─────────────────────────────────────────┤
│                                         │
│  CONTENIDO PRINCIPAL (scroll)           │
│  Padding top: 48px                      │
│  Padding lateral: 64px                  │
│  Ancho máximo: 1200px                   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ENCABEZADO                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RESUMEN DEL MES                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RECURRENTES PENDIENTES            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ INGRESOS DEL MES                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ EGRESOS DEL MES                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RESULTADO NETO                   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Bloques

- Entre encabezado y primera sección: **48px**
- Entre secciones: **64px**
- Bottom padding del contenido: **64px**

---

## 1. Encabezado de la Pantalla

### Propósito

Establece el contexto de Vida Mensual como base real del sistema patrimonial. Título claro y selector de mes.

### Por Qué Está Ahí

El usuario necesita entender que esta es la base de datos real del sistema. El encabezado responde: "¿Qué mes estoy cerrando? ¿Cuál es el estado?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Vida Mensual" — identificación inmediata
2. El selector de mes — contexto temporal
3. El estado del mes — ¿cerrado o pendiente?

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después del header)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título y Selector**

- Título: "Vida Mensual", 28px, peso 550, color `#000000`
- Selector de mes: Dropdown discreto, mes/año (ej: "Marzo 2024")
- Estado del mes: Badge sutil "Cerrado" / "Pendiente" (si aplica)
- Layout: Flexbox horizontal (título izquierda, selector y estado derecha)

**Subtítulo Conceptual**

- Texto: "Base real del sistema patrimonial", 15px, peso 450, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Explica el propósito sin tecnicismos**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Selector de mes accesible pero discreto
- Estado visible pero no intrusivo
- Subtítulo conceptual, no técnico
- Mucho espacio respirable

---

## 2. Resumen del Mes

### Propósito

Muestra el estado general del mes en un vistazo. Permite entender rápidamente si el mes está bien o requiere atención.

### Por Qué Está Ahí

El usuario necesita ver el resumen del mes antes de entrar en detalles. Esta vista responde: "¿Cómo va el mes? ¿Está dentro del promedio?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El resultado neto del mes — número grande, escultórico
2. La comparación con el promedio — ¿arriba o abajo?
3. El gasto mínimo necesario — referencia de supervivencia

### Qué Decisión Habilita

- **Decisión:** ¿El mes está dentro de lo esperado? ¿Requiere ajustes?
- **Información clave:** El resumen permite evaluar rápidamente el mes
- **Contexto:** La comparación con promedio ayuda a entender variaciones

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Layout Grid 2x2**

```
┌──────────────────┬──────────────────┐
│ RESULTADO NETO   │ PROMEDIO MENSUAL │
│ (número grande)  │ (número mediano) │
└──────────────────┴──────────────────┘
┌──────────────────┬──────────────────┐
│ GASTO MÍNIMO     │ VARIACIÓN        │
│ (número mediano) │ (indicador)      │
└──────────────────┴──────────────────┘
```

**Elemento 1: Resultado Neto del Mes**

- Label: "RESULTADO NETO", 11px, peso 450, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 36px, peso 600, monospace, color `#000000`, letter-spacing -0.03em
- Signo: Positivo (verde sutil) / Negativo (rojo sutil) / Neutro (gris)
- Alineación: Izquierda
- **Es el elemento más importante del resumen**

**Elemento 2: Promedio Mensual (Últimos 12 meses)**

- Label: "PROMEDIO MENSUAL", 11px, peso 450, color `#999999`, uppercase
- Valor: 24px, peso 600, monospace, color `#666666`, letter-spacing -0.025em
- Alineación: Derecha
- **Referencia histórica**

**Elemento 3: Gasto Mínimo Necesario**

- Label: "GASTO MÍNIMO", 11px, peso 450, color `#999999`, uppercase
- Valor: 24px, peso 600, monospace, color `#000000`, letter-spacing -0.025em
- Descripción: "Conceptos esenciales (fijos + variables básicos)"
- Alineación: Izquierda
- **Referencia de supervivencia**

**Elemento 4: Variación vs Promedio**

- Label: "VARIACIÓN", 11px, peso 450, color `#999999`, uppercase
- Valor: 20px, peso 550, monospace, color según variación
- Indicador: Flecha sutil ↑ ↓ = (si aplica)
- Alineación: Derecha
- **Comparación con histórico**

**Por Qué Este Diseño:**

- Grid 2x2 permite comparación inmediata
- Resultado neto destacado (número grande)
- Referencias claras (promedio, mínimo)
- Variación visible pero no intrusiva
- Información esencial sin ruido

---

## 3. Recurrentes Pendientes

### Propósito

Muestra los conceptos recurrentes que el sistema sugiere para el mes actual. Permite confirmar, ajustar o omitir en pocos clics.

### Por Qué Está Ahí

El usuario necesita cerrar el mes rápidamente. Esta sección responde: "¿Qué conceptos recurrentes debo confirmar este mes?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La lista de recurrentes pendientes — qué falta confirmar
2. Los montos sugeridos — valores esperados
3. Los botones de acción — confirmar, ajustar, omitir

### Qué Decisión Habilita

- **Decisión:** ¿Confirmo estos recurrentes? ¿Ajusto algún monto? ¿Omito alguno este mes?
- **Información clave:** Los recurrentes pendientes permiten cerrar el mes rápidamente
- **Contexto:** El sistema sugiere basándose en historial, el usuario confirma

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card**

- Título: "RECURRENTES PENDIENTES", 18px, peso 550, color `#000000`
- Subtítulo: "Conceptos que suelen repetirse cada mes", 13px, peso 450, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Recurrentes**

**Cada Recurrente:**

- Layout horizontal:
  - Checkbox (izquierda)
  - Concepto y monto (centro)
  - Botones de acción (derecha)

**Diseño de Cada Fila:**

- Altura: 64px
- Padding: 16px horizontal / 16px vertical
- Fondo: `rgba(255, 255, 255, 0.3)` (muy sutil)
- Hover: Fondo `rgba(255, 255, 255, 0.5)`
- Sin bordes entre filas
- Espaciado entre filas: 4px

**Elementos de Cada Fila:**

1. **Checkbox** (ancho: 48px)
   - Checkbox estilo macOS
   - Estado: No marcado por defecto
   - Click: Marca/desmarca para confirmar

2. **Concepto y Monto** (ancho: flexible)
   - Concepto: 15px, peso 500, color `#000000`
   - Frecuencia: 11px, peso 450, color `#666666` (ej: "Mensual", "Bimestral")
   - Monto sugerido: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
   - Último monto: 13px, peso 450, color `#666666` (ej: "Último: $50.000")

3. **Botones de Acción** (ancho: 200px)
   - "Confirmar": Botón primario discreto (azul sistema)
   - "Ajustar": Botón texto (abre modal para editar monto)
   - "Omitir": Botón texto (marca como omitido este mes)

**Estado Vacío**

- Mensaje: "No hay recurrentes pendientes para este mes"
- Subtítulo: "Todos los conceptos recurrentes ya fueron confirmados"
- Tipografía: 15px, peso 450, color `#666666`
- Centrado en el área de contenido

**Acción Masiva (Opcional)**

- Botón: "Confirmar todos", 13px, peso 500, color `#007AFF`
- Posición: Arriba a la derecha del header
- Click: Confirma todos los recurrentes con montos sugeridos

**Por Qué Este Diseño:**

- Lista clara y accesible
- Checkbox permite selección múltiple
- Montos sugeridos visibles
- Botones de acción discretos pero accesibles
- Acción masiva opcional para velocidad
- Sin fricción, solo confirmar

---

## 4. Ingresos del Mes

### Propósito

Muestra todos los ingresos registrados para el mes actual. Permite agregar nuevos ingresos y ver el total.

### Por Qué Está Ahí

El usuario necesita ver y registrar todos los ingresos del mes. Esta sección responde: "¿Qué ingresos tuve este mes? ¿Falta registrar alguno?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El total de ingresos — número grande
2. La lista de ingresos — conceptos y montos
3. El botón de agregar — acción principal

### Qué Decisión Habilita

- **Decisión:** ¿Registré todos los ingresos? ¿Falta alguno?
- **Información clave:** El total permite verificar completitud
- **Contexto:** La lista muestra cada ingreso individual

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card**

- Título: "INGRESOS DEL MES", 18px, peso 550, color `#000000`
- Total: 28px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
- Layout: Flexbox horizontal (título izquierda, total derecha)
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Ingresos**

**Cada Ingreso:**

- Layout horizontal:
  - Concepto (izquierda)
  - Monto (derecha)
  - Tipo (fijo/variable/extraordinario) — badge sutil

**Diseño de Cada Fila:**

- Altura: 56px
- Padding: 16px horizontal / 16px vertical
- Fondo: `rgba(255, 255, 255, 0.3)` (muy sutil)
- Hover: Fondo `rgba(255, 255, 255, 0.5)`
- Sin bordes entre filas
- Espaciado entre filas: 4px

**Elementos de Cada Fila:**

1. **Concepto** (ancho: flexible)
   - Texto: 15px, peso 500, color `#000000`
   - Badge tipo: 11px, peso 450, color según tipo
     - Fijo: Gris
     - Variable: Azul sutil
     - Extraordinario: Naranja sutil

2. **Monto** (ancho: 200px)
   - Texto: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
   - Alineación: Derecha

**Botón Agregar Ingreso**

- Posición: Debajo de la lista
- Texto: "Agregar ingreso", 15px, peso 500, color `#007AFF`
- Click: Abre modal para agregar ingreso
- Margen superior: 16px

**Separación por Tipo (Opcional)**

- Si hay muchos ingresos, separar visualmente:
  - Fijos (arriba)
  - Variables (medio)
  - Extraordinarios (abajo)
- Subtítulos sutiles: "Fijos", "Variables", "Extraordinarios"

**Por Qué Este Diseño:**

- Total destacado en el header
- Lista clara y legible
- Badges sutiles para tipos
- Botón agregar accesible
- Separación opcional si es necesario

---

## 5. Egresos del Mes

### Propósito

Muestra todos los egresos registrados para el mes actual. Permite agregar nuevos egresos y ver el total.

### Por Qué Está Ahí

El usuario necesita ver y registrar todos los egresos del mes. Esta sección responde: "¿Qué egresos tuve este mes? ¿Falta registrar alguno?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El total de egresos — número grande
2. La lista de egresos — conceptos y montos
3. El botón de agregar — acción principal

### Qué Decisión Habilita

- **Decisión:** ¿Registré todos los egresos? ¿Falta alguno?
- **Información clave:** El total permite verificar completitud
- **Contexto:** La lista muestra cada egreso individual

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card**

- Título: "EGRESOS DEL MES", 18px, peso 550, color `#000000`
- Total: 28px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
- Layout: Flexbox horizontal (título izquierda, total derecha)
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Egresos**

**Cada Egreso:**

- Layout horizontal:
  - Concepto (izquierda)
  - Monto (derecha)
  - Tipo (fijo/variable/extraordinario) — badge sutil

**Diseño de Cada Fila:**

- Altura: 56px
- Padding: 16px horizontal / 16px vertical
- Fondo: `rgba(255, 255, 255, 0.3)` (muy sutil)
- Hover: Fondo `rgba(255, 255, 255, 0.5)`
- Sin bordes entre filas
- Espaciado entre filas: 4px

**Elementos de Cada Fila:**

1. **Concepto** (ancho: flexible)
   - Texto: 15px, peso 500, color `#000000`
   - Badge tipo: 11px, peso 450, color según tipo
     - Fijo: Gris
     - Variable: Azul sutil
     - Extraordinario: Naranja sutil

2. **Monto** (ancho: 200px)
   - Texto: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
   - Alineación: Derecha

**Botón Agregar Egreso**

- Posición: Debajo de la lista
- Texto: "Agregar egreso", 15px, peso 500, color `#007AFF`
- Click: Abre modal para agregar egreso
- Margen superior: 16px

**Separación por Tipo (Opcional)**

- Si hay muchos egresos, separar visualmente:
  - Fijos (arriba)
  - Variables (medio)
  - Extraordinarios (abajo)
- Subtítulos sutiles: "Fijos", "Variables", "Extraordinarios"

**Por Qué Este Diseño:**

- Total destacado en el header
- Lista clara y legible
- Badges sutiles para tipos
- Botón agregar accesible
- Separación opcional si es necesario

---

## 6. Resultado Neto del Mes

### Propósito

Muestra el resultado neto final del mes (ingresos - egresos). Permite verificar que el mes está completo.

### Por Qué Está Ahí

El usuario necesita ver el resultado final del mes. Esta sección responde: "¿Cuál es el resultado neto del mes? ¿Está completo?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El resultado neto — número muy grande, escultórico
2. El desglose — ingresos y egresos
3. El indicador de estado — ¿positivo, negativo, neutro?

### Qué Decisión Habilita

- **Decisión:** ¿El mes está completo? ¿El resultado es esperado?
- **Información clave:** El resultado neto permite evaluar el mes
- **Contexto:** El desglose ayuda a entender de dónde viene el resultado

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 48px (vertical) / 48px (horizontal) — más generoso
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Layout Vertical Centrado**

- Alineación: Centro
- Espaciado: 24px entre elementos

**Elemento 1: Resultado Neto**

- Label: "RESULTADO NETO DEL MES", 11px, peso 450, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 48px, peso 600, monospace, color según resultado, letter-spacing -0.03em
  - Positivo: Verde sutil `#34C759`
  - Negativo: Rojo sutil `#FF3B30`
  - Neutro: Negro `#000000`
- Signo: `+` o `-` antes del valor (si aplica)
- Margen superior: 0px
- Margen inferior: 32px
- **Es el elemento más importante**

**Elemento 2: Desglose**

- Layout horizontal:
  - Ingresos (izquierda)
  - Separador (centro)
  - Egresos (derecha)

**Cada Columna:**

- Label: "INGRESOS" / "EGRESOS", 11px, peso 450, color `#999999`, uppercase
- Valor: 24px, peso 600, monospace, color `#666666`, letter-spacing -0.025em
- Alineación: Centro

**Separador:**

- Texto: "—", 20px, peso 400, color `#E5E5E5`
- Alineación: Centro

**Elemento 3: Indicador de Estado (Opcional)**

- Badge: "Mes completo" / "Pendiente", 13px, peso 500, color según estado
- Posición: Debajo del resultado neto
- Margen superior: 16px

**Por Qué Este Diseño:**

- Resultado neto muy destacado (48px)
- Desglose claro y legible
- Color según resultado (sutil, no intrusivo)
- Centrado para énfasis
- Información esencial sin ruido

---

## 7. Sistema de Conceptos

### Propósito

Permite crear conceptos reutilizables una sola vez y autocompletar al cargar movimientos. Evita escribir nombres repetidos.

### Por Qué Está Ahí

El usuario necesita evitar escribir los mismos conceptos cada mes. Esta funcionalidad responde: "¿Cómo evito escribir 'Alquiler' cada mes?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El campo de autocompletado — al escribir, sugiere conceptos existentes
2. La lista de conceptos frecuentes — conceptos más usados
3. El botón de crear concepto — acción para nuevos conceptos

### Qué Decisión Habilita

- **Decisión:** ¿Uso un concepto existente o creo uno nuevo?
- **Información clave:** El autocompletado sugiere conceptos relevantes
- **Contexto:** La lista de frecuentes muestra los más usados

### Diseño Detallado

**Autocompletado en Modal de Agregar Movimiento**

**Campo de Concepto:**
- Input de texto con autocompletado
- Al escribir, muestra sugerencias debajo
- Sugerencias: Conceptos existentes que coinciden
- Click en sugerencia: Selecciona y autocompleta

**Lista de Sugerencias:**
- Altura máxima: 200px
- Scroll si hay muchas sugerencias
- Cada sugerencia:
  - Concepto: 15px, peso 500, color `#000000`
  - Tipo: 11px, peso 450, color `#666666` (ej: "Recurrente - Mensual")
  - Frecuencia: 11px, peso 450, color `#666666` (ej: "Último uso: Marzo 2024")
- Hover: Fondo `rgba(250, 250, 250, 0.8)`
- Click: Selecciona el concepto

**Crear Nuevo Concepto:**
- Botón: "Crear nuevo concepto", 13px, peso 500, color `#007AFF`
- Posición: Debajo del campo de autocompletado
- Click: Abre modal para crear concepto nuevo

**Modal de Crear Concepto:**

**Campos:**
1. **Nombre del concepto**
   - Input de texto
   - Placeholder: "Ej: Alquiler"
   - Requerido

2. **Tipo**
   - Radio buttons: Ingreso / Egreso
   - Requerido

3. **Categoría**
   - Radio buttons: Fijo / Variable / Extraordinario
   - Requerido

4. **Recurrencia**
   - Checkbox: "Es recurrente"
   - Si está marcado, muestra selector de frecuencia:
     - Dropdown: Mensual / Bimestral / Trimestral / Semestral / Anual / Libre
   - Opcional

5. **Monto estimado (opcional)**
   - Input numérico
   - Placeholder: "Ej: 50000"
   - Opcional

**Botones:**
- "Crear": Botón primario (azul sistema)
- "Cancelar": Botón texto

**Por Qué Este Diseño:**

- Autocompletado evita escribir repetidamente
- Sugerencias claras y accesibles
- Crear concepto es simple pero completo
- Recurrencia opcional pero accesible
- Sin fricción, solo eficiencia

---

## 8. Recurrentes Inteligentes

### Propósito

Cada mes, el sistema sugiere los conceptos recurrentes basándose en el historial. El usuario puede confirmar, ajustar o omitir.

### Por Qué Está Ahí

El usuario necesita cerrar el mes rápidamente. Esta funcionalidad responde: "¿Qué conceptos recurrentes debo confirmar este mes?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La lista de recurrentes pendientes — qué falta confirmar
2. Los montos sugeridos — valores esperados
3. Los botones de acción — confirmar, ajustar, omitir

### Qué Decisión Habilita

- **Decisión:** ¿Confirmo estos recurrentes? ¿Ajusto algún monto? ¿Omito alguno este mes?
- **Información clave:** Los recurrentes pendientes permiten cerrar el mes rápidamente
- **Contexto:** El sistema sugiere basándose en historial, el usuario confirma

### Diseño Detallado

**Lógica de Sugerencias:**

**Criterios para Sugerir:**
1. Concepto marcado como "Recurrente"
2. Frecuencia coincide con el mes actual
3. No fue confirmado aún en el mes actual
4. Tiene historial de uso (al menos 2 meses anteriores)

**Monto Sugerido:**
- Si tiene monto estimado: Usa ese monto
- Si no tiene monto estimado: Usa el promedio de los últimos 3 meses
- Si no hay historial: No sugiere monto (usuario debe ingresarlo)

**Frecuencia:**
- Mensual: Se sugiere cada mes
- Bimestral: Se sugiere cada 2 meses
- Trimestral: Se sugiere cada 3 meses
- Semestral: Se sugiere cada 6 meses
- Anual: Se sugiere cada 12 meses
- Libre: No se sugiere automáticamente

**Acciones del Usuario:**

**Confirmar:**
- Click en checkbox o botón "Confirmar"
- Crea el movimiento con el monto sugerido
- Marca el concepto como confirmado para el mes

**Ajustar:**
- Click en botón "Ajustar"
- Abre modal para editar monto
- Usuario ingresa nuevo monto
- Confirma y crea el movimiento con monto ajustado

**Omitir:**
- Click en botón "Omitir"
- Marca el concepto como omitido para el mes
- No crea movimiento
- Aparece en historial como "Omitido"

**Por Qué Este Diseño:**

- Sugerencias inteligentes basadas en historial
- Montos sugeridos para velocidad
- Acciones claras y accesibles
- Omitir permite flexibilidad
- Sin fricción, solo confirmar

---

## 9. Imputación Mensual Asistida

### Propósito

Permite cerrar el mes en 2-3 minutos mediante un flujo asistido. El sistema sugiere, el usuario confirma.

### Por Qué Está Ahí

El usuario necesita usar el sistema todos los meses durante años. Esta funcionalidad responde: "¿Cómo cierro el mes rápidamente?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La lista de recurrentes pendientes — qué falta confirmar
2. Los botones de acción — confirmar, ajustar, omitir
3. El resultado del mes — feedback inmediato

### Qué Decisión Habilita

- **Decisión:** ¿Confirmo estos recurrentes? ¿Ajusto algún monto? ¿Omito alguno este mes?
- **Información clave:** El flujo asistido permite cerrar el mes rápidamente
- **Contexto:** El sistema sugiere, el usuario confirma

### Diseño Detallado

**Flujo de Cierre Mensual:**

**Paso 1: Entrar al Mes**
- Usuario selecciona el mes en el selector
- Sistema muestra recurrentes pendientes
- Sistema muestra ingresos y egresos ya registrados

**Paso 2: Confirmar Recurrentes**
- Usuario revisa lista de recurrentes pendientes
- Usuario marca checkboxes de los que confirma
- Usuario ajusta montos si es necesario
- Usuario omite los que no aplican este mes
- Click en "Confirmar seleccionados"

**Paso 3: Agregar Movimientos Faltantes**
- Usuario agrega ingresos faltantes (si aplica)
- Usuario agrega egresos faltantes (si aplica)
- Usuario usa autocompletado para conceptos

**Paso 4: Ver Resultado**
- Sistema muestra resultado neto del mes
- Usuario verifica que el mes está completo
- Usuario puede marcar mes como "Cerrado"

**Tiempo Objetivo:**
- 2-3 minutos para cerrar el mes
- Mayoría del tiempo: Confirmar recurrentes
- Menor tiempo: Agregar movimientos faltantes

**Feedback Inmediato:**
- Al confirmar recurrentes: Aparecen en lista de ingresos/egresos
- Al agregar movimiento: Aparece en lista inmediatamente
- Resultado neto se actualiza en tiempo real

**Por Qué Este Diseño:**

- Flujo claro y lineal
- Sugerencias inteligentes
- Confirmación rápida
- Feedback inmediato
- Sin fricción, solo eficiencia

---

## 10. Integración con el Sistema Existente

### Propósito

Vida Mensual alimenta conceptualmente Dashboard, Proyecciones e Inversiones. No duplica pantallas, integra como capa base.

### Por Qué Está Ahí

El usuario necesita que Vida Mensual sea la base real del sistema. Esta integración responde: "¿Cómo se relaciona Vida Mensual con el resto del sistema?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Los indicadores en Dashboard — gasto mensual, % de vida cubierta
2. Las proyecciones en "meses de vida" — capital expresado en tiempo
3. Las inversiones en "meses de vida" — cuántos meses cubre cada inversión

### Qué Decisión Habilita

- **Decisión:** ¿Cuántos meses de vida tengo? ¿Cuántos meses cubre esta inversión?
- **Información clave:** La integración permite entender el patrimonio en términos de vida mensual
- **Contexto:** El costo de vida real impacta todas las decisiones patrimoniales

### Diseño Detallado

**Dashboard - Indicadores Agregados:**

**Bloque "Costo de Vida" (Nuevo):**
- Gasto mensual promedio: 24px, peso 600, monospace
- % de vida cubierta: 20px, peso 600, monospace
- Tendencia: Flecha sutil ↑ ↓ = (si aplica)
- Card translúcida, border radius 24px

**Integración Visual:**
- Se agrega después de "Estado Patrimonial"
- Antes de "Distribución del Patrimonio"
- Espaciado: 64px entre bloques

**Proyecciones - "Meses de Vida":**

**Bloque "Capital en Meses de Vida" (Nuevo):**
- Capital proyectado: 28px, peso 600, monospace
- Meses de vida: 24px, peso 600, monospace
- Cálculo: Capital / Gasto mensual promedio
- Card translúcida, border radius 24px

**Integración Visual:**
- Se agrega después de "Comparativa de Escenarios"
- Antes de "Evolución Temporal"
- Espaciado: 64px entre bloques

**Inversiones - "Meses de Vida Cubiertos":**

**En Vista Detalle de Inversión:**
- Nueva métrica: "Meses de vida cubiertos"
- Cálculo: Valor de inversión / Gasto mensual promedio
- 20px, peso 600, monospace
- Posición: En pestaña "Resumen"

**Integración Visual:**
- Se agrega después de "ROI Real"
- Antes de "Estado"
- Espaciado: 24px entre métricas

**Por Qué Este Diseño:**

- Integración conceptual, no duplicación
- Indicadores claros y accesibles
- Cálculos simples y comprensibles
- Visual consistente con el sistema
- Sin ruido, solo información esencial

---

## 11. Navegación Actualizada

### Propósito

Agrega "Vida Mensual" al menú principal al mismo nivel que Dashboard, Inversiones y Flujos.

### Por Qué Está Ahí

El usuario necesita acceso rápido a Vida Mensual todos los meses. Esta navegación responde: "¿Dónde está Vida Mensual?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El item "Vida Mensual" en el menú — acceso directo
2. La posición en el menú — mismo nivel que otras pantallas principales

### Qué Decisión Habilita

- **Decisión:** ¿Cómo accedo a Vida Mensual?
- **Información clave:** La navegación permite acceso rápido
- **Contexto:** Vida Mensual es una pantalla principal, no secundaria

### Diseño Detallado

**Header - Menú Principal:**

**Items del Menú (Actualizado):**
1. Dashboard
2. Inversiones
3. Flujos
4. **Vida Mensual** (nuevo)
5. Proyecciones
6. Emma
7. Bitácora
8. Ajustes

**Posición:**
- Después de "Flujos"
- Antes de "Proyecciones"
- Mismo estilo visual que otros items

**Estilo:**
- Texto: 15px, peso 450, color según estado (activo/inactivo)
- Hover: Color `#000000`
- Active: Color `#000000`, peso 500
- Transición: 200ms ease

**Por Qué Este Diseño:**

- Posición lógica en el menú
- Estilo consistente con otros items
- Acceso rápido y directo
- Sin cambios visuales innecesarios

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Encabezado** (título y selector de mes)
   - El usuario entiende qué mes está cerrando
   - Responde: "¿Qué mes estoy viendo?"

2. **Resumen del Mes**
   - El usuario ve el estado general del mes
   - Responde: "¿Cómo va el mes?"

3. **Recurrentes Pendientes**
   - El usuario ve qué falta confirmar
   - Responde: "¿Qué debo confirmar?"

4. **Ingresos del Mes**
   - El usuario ve todos los ingresos
   - Responde: "¿Qué ingresos tuve?"

5. **Egresos del Mes**
   - El usuario ve todos los egresos
   - Responde: "¿Qué egresos tuve?"

6. **Resultado Neto**
   - El usuario ve el resultado final
   - Responde: "¿Cuál es el resultado?"

### Tiempo de Lectura

- **Lectura rápida (10 segundos):** Encabezado + Resumen
- **Cierre mensual (2-3 minutos):** Todo lo anterior + Confirmar recurrentes + Agregar faltantes
- **Revisión completa (5 minutos):** Todo lo anterior + Revisar todos los movimientos

---

## Estados Vacíos y Carga

### Estado Vacío (Sin Movimientos)

- Mensaje: "No hay movimientos registrados para este mes"
- Subtítulo: "Confirma los recurrentes pendientes o agrega movimientos manualmente"
- Botón: "Confirmar recurrentes" (si hay recurrentes pendientes)
- Tipografía: 15px, peso 450, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Recurrentes Pendientes

- Mensaje: "No hay recurrentes pendientes para este mes"
- Subtítulo: "Todos los conceptos recurrentes ya fueron confirmados"
- Tipografía: 15px, peso 450, color `#666666`
- Centrado en el área de contenido

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid 2x2 en resumen del mes
- Todo el contenido visible con scroll vertical

### Large Desktop (1920px+)

- Mismo diseño, más espacio lateral
- El contenido se centra (máximo 1200px)
- Más espacio respirable

### Tablet (1024px - 1439px)

- Grids se convierten en 1 columna
- Las cards se apilan verticalmente
- El espaciado se mantiene

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] El encabezado tiene selector de mes y estado
- [ ] El resumen del mes muestra resultado neto, promedio, mínimo y variación
- [ ] Los recurrentes pendientes se muestran con checkboxes y botones de acción
- [ ] Los ingresos y egresos se muestran en listas claras
- [ ] El resultado neto está destacado y centrado
- [ ] El sistema de conceptos permite autocompletado y creación
- [ ] Los recurrentes inteligentes sugieren basándose en historial
- [ ] La imputación mensual asistida permite cerrar el mes en 2-3 minutos
- [ ] La integración con Dashboard, Proyecciones e Inversiones está definida
- [ ] La navegación incluye "Vida Mensual" al mismo nivel que otras pantallas
- [ ] No hay duplicación con la pantalla de Flujos
- [ ] El flujo está optimizado para uso mensual durante años
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable

---

**Última actualización**: Diseño completo de Vida Mensual
**Versión**: 1.0
**Estado**: Completo y listo para referencia de implementación

