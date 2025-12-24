# Fondo Emma
## Pulley Group — Proyecto Patrimonial de Largo Plazo

---

## Visión General

La pantalla del Fondo Emma muestra el estado y proyección de un proyecto patrimonial específico de largo plazo, basado en interés compuesto. Es una vista estratégica que permite monitorear el progreso hacia objetivos de 18, 25 y 30 años.

**Filosofía de Uso**
- Monitoreo del progreso hacia objetivos de largo plazo
- Comprensión del impacto del interés compuesto
- Toma de decisiones sobre aportes mensuales
- Sensación de control sobre un proyecto específico

**Paradigma de Eventos Patrimoniales**
- Cada aporte es un EVENTO con fecha específica
- Cambios de aporte mensual son EVENTOS que ajustan la proyección
- Aportes extraordinarios son EVENTOS que aceleran el crecimiento
- La proyección continúa desde el último evento, no desde cero
- El historial de eventos explica cada cambio en la curva

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px) — recalculada solo para el Fondo Emma
- Contenido principal con scroll vertical
- Cards limpias con información clara
- Sin gráficos ruidosos, sin sentimentalismo visual

---

## Layout General

### Estructura de la Página

```
┌─────────────────────────────────────────┐
│ HEADER (64px, fixed)                   │
├─────────────────────────────────────────┤
│ BARRA PROYECCIONES (56px, fixed)        │
│ (recalculada solo para Fondo Emma)      │
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
│  │ ESTADO ACTUAL DEL FONDO          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ PROYECCIÓN POR HITOS             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ EVOLUCIÓN TEMPORAL                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ NOMINAL VS REAL                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RELACIÓN CON PATRIMONIO GENERAL   │   │
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

Establece el contexto del Fondo Emma como proyecto patrimonial de largo plazo. Título claro y subtítulo sobrio, sin sentimentalismo.

### Por Qué Está Ahí

El usuario necesita entender que este es un proyecto específico de largo plazo. El encabezado responde: "¿Qué es el Fondo Emma? ¿Cuál es su propósito?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Fondo Emma" — identificación inmediata
2. El subtítulo sobrio — explicación de largo plazo

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después de la barra de proyecciones)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título**

- Texto: "Fondo Emma", 28px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante del encabezado**

**Subtítulo Sobrio**

- Texto: "Proyecto patrimonial de largo plazo basado en interés compuesto", 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Sobrio, de largo plazo, no emocional**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Subtítulo sobrio y estratégico
- Enfatiza "proyecto patrimonial" y "largo plazo"
- Sin sentimentalismo, solo información clara
- Mucho espacio respirable

---

## 2. Estado Actual del Fondo

### Propósito

Muestra el estado presente del Fondo Emma: capital acumulado, aportes realizados y tiempo transcurrido.

### Por Qué Está Ahí

El usuario necesita ver dónde está el fondo ahora antes de pensar en el futuro. Este bloque responde: "¿Cuánto tengo acumulado? ¿Cuánto he aportado? ¿Cuánto tiempo ha pasado?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Capital acumulado — el número más importante
2. Aporte mensual — acción actual
3. Aporte inicial — punto de partida
4. Tiempo transcurrido — contexto temporal

### Qué Decisión Habilita

- **Decisión:** ¿Debo aumentar el aporte mensual? ¿Estoy en el camino correcto?
- **Información clave:** El capital acumulado muestra el progreso actual
- **Contexto:** Los aportes y el tiempo transcurrido ayudan a entender la trayectoria

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)

**Layout Grid 2x2**

```
┌──────────────────┬──────────────────┐
│ CAPITAL ACUMULADO│ APORTE MENSUAL   │
├──────────────────┼──────────────────┤
│ APORTE INICIAL   │ TIEMPO TRANSCURR.│
└──────────────────┴──────────────────┘
```

**Elemento 1: Capital Acumulado**

**Posición:** Arriba izquierda, ocupa más espacio visual

**Diseño:**
- Label: "CAPITAL ACUMULADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 36px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- **Es el número más importante, por eso 36px (Display)**

**Por Qué Este Diseño:**
- El capital acumulado es la métrica principal
- Tamaño 36px porque es lo más importante
- Monospace para números grandes asegura legibilidad
- Ocupa la posición de mayor jerarquía

**Elemento 2: Aporte Mensual**

**Posición:** Arriba derecha

**Diseño:**
- Label: "APORTE MENSUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 0px (misma fila que capital acumulado)

**Por Qué Este Diseño:**
- Muestra la acción actual (aporte mensual)
- Tamaño 28px (Heading grande) porque es importante pero secundario al capital
- Información esencial para entender el crecimiento

**Elemento 3: Aporte Inicial**

**Posición:** Abajo izquierda

**Diseño:**
- Label: "APORTE INICIAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px (separación de la fila superior)

**Por Qué Este Diseño:**
- Muestra el punto de partida
- Tamaño 24px (Heading 1) porque es información de contexto
- Ayuda a entender el crecimiento desde el inicio

**Elemento 4: Tiempo Transcurrido**

**Posición:** Abajo derecha

**Diseño:**
- Label: "TIEMPO TRANSCURRIDO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: "X años" o "X años Y meses"
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Muestra el contexto temporal
- Mismo tamaño que aporte inicial (misma jerarquía)
- Ayuda a entender el ritmo de crecimiento

**Espaciado Entre Elementos**

- Horizontal (entre columnas): 48px
- Vertical (entre filas): 32px
- Los elementos no se tocan, hay mucho aire

**Por Qué Este Diseño General:**

- Grid organizado y legible
- Capital acumulado destacado como métrica principal
- Información completa pero no sobrecargada
- Comparación visual clara entre aportes y capital

---

## 3. Proyección por Hitos

### Propósito

Muestra las proyecciones del Fondo Emma en hitos temporales clave: 18, 25 y 30 años. Permite ver el capital proyectado en cada hito.

### Por Qué Está Ahí

El usuario necesita ver hacia dónde va el fondo en los hitos importantes. Esta proyección responde: "¿Cuánto tendré a los 18/25/30 años? ¿Estoy en camino de cumplir el objetivo?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Los valores proyectados (nominal y real) — métricas principales
2. Los hitos temporales (18, 25, 30 años) — contexto
3. Las diferencias entre hitos — trayectoria

### Qué Decisión Habilita

- **Decisión:** ¿Debo ajustar el aporte mensual? ¿Estoy en el camino correcto hacia el objetivo?
- **Información clave:** Los valores proyectados muestran si se cumplirá el objetivo
- **Contexto:** Los hitos ayudan a planificar decisiones de largo plazo

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "PROYECCIÓN POR HITOS", 18px, peso 600, color `#000000`
- Subtítulo: "Capital proyectado según interés compuesto", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Layout Grid 3 Columnas**

```
┌──────────────┬──────────────┬──────────────┐
│ 18 AÑOS      │ 25 AÑOS      │ 30 AÑOS      │
│              │              │              │
│ Nominal      │ Nominal      │ Nominal      │
│ Real         │ Real         │ Real         │
│              │              │              │
│ % Objetivo   │ % Objetivo   │ % Objetivo   │
└──────────────┴──────────────┴──────────────┘
```

**Cada Columna (Hito)**

**Header de Hito:**
- Título: "18 AÑOS" / "25 AÑOS" / "30 AÑOS", 15px, peso 600, color `#000000`
- Alineación: Centro
- Margen inferior: 16px

**Valor Proyectado Nominal:**
- Label: "PROYECCIÓN NOMINAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Alineación: Centro
- Margen inferior: 16px

**Valor Proyectado Real:**
- Label: "PROYECCIÓN REAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Alineación: Centro
- Margen inferior: 24px

**Porcentaje del Objetivo:**
- Label: "PROGRESO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 18px, peso 600, color `#000000`, monospace
- Formato: "XX.X%" del objetivo
- Alineación: Centro
- Margen inferior: 0px

**Espaciado Entre Columnas**

- Horizontal: 48px
- Los hitos no se tocan, hay mucho aire

**Por Qué Este Diseño:**

- Grid de 3 columnas permite comparación inmediata
- Valores nominal y real en cada hito
- Porcentaje del objetivo para ver progreso
- Lectura clara, sin dramatismo
- Layout limpio y legible

---

## 4. Evolución Temporal

### Propósito

Muestra cómo evoluciona el Fondo Emma año a año. Enfoque en trayectoria, no en precisión matemática.

### Por Qué Está Ahí

El usuario necesita ver la trayectoria del fondo a lo largo del tiempo. Esta evolución responde: "¿Cómo crece el fondo año a año? ¿Cuál es la tendencia?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El valor actual (año 0) — punto de partida
2. Los valores en los hitos (18, 25, 30 años) — destinos
3. Los valores intermedios — trayectoria

### Qué Decisión Habilita

- **Decisión:** ¿Estoy en el camino correcto? ¿Necesito ajustar el aporte mensual?
- **Información clave:** La tendencia muestra si el fondo crece de forma sostenible
- **Contexto:** Los valores intermedios ayudan a entender el ritmo de crecimiento

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "EVOLUCIÓN TEMPORAL", 18px, peso 600, color `#000000`
- Subtítulo: "Crecimiento año a año del fondo", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Tabla de Evolución**

**Estructura:**
- Filas: Años (0, 1, 2, 3, ... hasta 30 años, o solo hitos)
- Columnas: Año, Capital Nominal, Capital Real, Variación

**Header de Tabla:**
- Altura: 48px
- Fondo: `#FAFAFA`
- Texto: 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Borde inferior: `1px solid #E5E5E5`
- Padding: 16px horizontal / 12px vertical

**Columnas:**

1. **Año** (ancho: 80px)
   - Texto: 15px, peso 400, color `#000000`
   - Formato: "Año 0", "Año 1", etc., o solo hitos "18 años", "25 años", "30 años"
   - Alineación: Izquierda

2. **Capital Nominal** (ancho: 200px)
   - Texto: 15px, peso 600, color `#000000`, monospace
   - Alineación: Derecha
   - **Es la métrica principal**

3. **Capital Real** (ancho: 200px)
   - Texto: 15px, peso 400, color `#666666`, monospace
   - Alineación: Derecha
   - **Información complementaria**

4. **Variación** (ancho: 140px)
   - Texto: 15px, peso 400, color `#666666`, monospace
   - Formato: "XX.X%" o "+XX.X%"
   - Alineación: Derecha

**Filas:**
- Altura: 48px
- Fondo: `#FFFFFF`
- Padding: 16px horizontal / 12px vertical
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas

**Fila Especial: Año 0 (Actual)**
- Fondo: `#FAFAFA` (muy sutil, para destacar)
- O borde superior más visible: `1px solid #E5E5E5`

**Filas de Hitos (18, 25, 30 años)**
- Pueden tener fondo ligeramente diferente: `#FAFAFA` (muy sutil)
- O peso tipográfico ligeramente mayor (600 en lugar de 400)

**Nota Conceptual (Debajo de la Tabla)**

- Texto: "Estos valores son proyecciones basadas en interés compuesto. La realidad puede variar según múltiples factores.", 11px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 24px
- **Muy discreta, solo para claridad**

**Por Qué Este Diseño:**

- Tabla minimalista sin grid visible
- Enfoque en trayectoria, no en precisión matemática
- Valores nominal y real visibles
- Variación año a año para entender el ritmo
- Nota conceptual discreta que no promete exactitud

---

## 5. Nominal vs Real

### Propósito

Muestra la diferencia entre el valor nominal y real del Fondo Emma a lo largo del tiempo. Explica el impacto del IPC en el largo plazo.

### Por Qué Está Ahí

El usuario necesita entender cómo la inflación afecta el poder adquisitivo del fondo. Esta comparativa responde: "¿Cuánto vale realmente el fondo en el futuro? ¿Cómo me afecta la inflación?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La diferencia entre nominal y real — impacto del IPC
2. El valor real proyectado — poder adquisitivo
3. La explicación conceptual — cómo funciona

### Qué Decisión Habilita

- **Decisión:** ¿El fondo está protegiendo mi poder adquisitivo? ¿Debo ajustar la estrategia?
- **Información clave:** La diferencia entre nominal y real muestra el impacto de la inflación
- **Contexto:** Entender el IPC ayuda a planificar mejor el futuro

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "NOMINAL VS REAL", 18px, peso 600, color `#000000`
- Subtítulo: "Impacto del IPC en el poder adquisitivo", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Comparación por Hitos (Grid 3 Columnas)**

```
┌──────────────┬──────────────┬──────────────┐
│ 18 AÑOS      │ 25 AÑOS      │ 30 AÑOS      │
│              │              │              │
│ Nominal      │ Nominal      │ Nominal      │
│ Real         │ Real         │ Real         │
│              │              │              │
│ Diferencia   │ Diferencia   │ Diferencia   │
└──────────────┴──────────────┴──────────────┘
```

**Cada Columna (Hito)**

**Header de Hito:**
- Título: "18 AÑOS" / "25 AÑOS" / "30 AÑOS", 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Alineación: Centro
- Margen inferior: 16px

**Valor Nominal:**
- Label: "NOMINAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Alineación: Centro
- Margen inferior: 12px

**Valor Real:**
- Label: "REAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Alineación: Centro
- Margen inferior: 16px

**Diferencia:**
- Label: "DIFERENCIA", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 15px, peso 400, color `#666666`, monospace
- Descripción: "Erosión por IPC", 11px, peso 400, color `#999999`
- Alineación: Centro
- Margen inferior: 0px

**Espaciado Entre Columnas**

- Horizontal: 48px
- Los hitos no se tocan

**Explicación Conceptual (Debajo del Grid)**

- Texto: "El valor nominal muestra el monto en pesos. El valor real muestra cuánto puedes comprar realmente con ese monto, considerando la inflación. La diferencia es la erosión del poder adquisitivo a lo largo del tiempo.", 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen superior: 32px
- Padding: 0px
- **Explicación clara y conceptual, no técnica**

**Por Qué Este Diseño:**

- Comparación visual clara entre nominal y real por hitos
- Valores destacados para comparación inmediata
- Diferencia visible para entender el impacto del IPC
- Explicación conceptual que no usa jerga técnica
- Enfoque en comprensión del largo plazo

---

## 6. Relación con el Patrimonio General

### Propósito

Muestra cómo el Fondo Emma impacta en las proyecciones del patrimonio general. Sin duplicar la pantalla de Proyecciones.

### Por Qué Está Ahí

El usuario necesita ver cómo Emma contribuye al futuro del patrimonio completo. Esta sección responde: "¿Cómo impacta Emma en mis proyecciones globales? ¿Qué porcentaje representa?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La contribución a las proyecciones — impacto futuro
2. El porcentaje del patrimonio — proporción
3. El valor proyectado — magnitud

### Qué Decisión Habilita

- **Decisión:** ¿Emma está cumpliendo su rol estratégico? ¿Debo ajustar su peso en el patrimonio?
- **Información clave:** La contribución muestra si Emma es significativa en el futuro
- **Contexto:** No se duplica la pantalla de Proyecciones, solo se muestra la relación

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "RELACIÓN CON PATRIMONIO GENERAL", 18px, peso 600, color `#000000`
- Subtítulo: "Contribución a las proyecciones globales", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Grid 2x2**

```
┌──────────────────┬──────────────────┐
│ CONTRIBUCIÓN   │ % DEL PATRIMONIO   │
├──────────────────┼──────────────────┤
│ VALOR PROYECTADO │ (información)    │
└──────────────────┴──────────────────┘
```

**Elemento 1: Contribución a Proyecciones**

- Label: "CONTRIBUCIÓN", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Descripción: "A las proyecciones de [horizonte]", 13px, peso 400, color `#666666`
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen inferior: 32px

**Elemento 2: Porcentaje del Patrimonio**

- Label: "% DEL PATRIMONIO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: "XX.X%" del patrimonio proyectado
- Descripción: "En [horizonte]", 13px, peso 400, color `#666666`
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen inferior: 32px

**Elemento 3: Valor Proyectado**

- Label: "VALOR PROYECTADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Descripción: "A [horizonte]", 13px, peso 400, color `#666666`
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 0px

**Espaciado Entre Elementos**

- Horizontal: 48px
- Vertical: 32px
- Los elementos no se tocan

**Link a Proyecciones (Opcional)**

- Texto: "Ver proyecciones globales →", 13px, peso 400, color `#007AFF` (azul sistema)
- Alineación: Derecha
- Hover: Color `#0051D5`
- Click: Navegación a pantalla de Proyecciones
- Margen superior: 32px

**Por Qué Este Diseño:**

- Muestra la relación sin duplicar contenido
- Grid organizado con información esencial
- Contribución y porcentaje para contexto
- Valor proyectado para magnitud
- Link a proyecciones globales para información completa

---

## 7. Uso de la Barra Superior de Proyecciones

### Propósito

La barra de proyecciones se recalcula solo para el Fondo Emma. Mantiene coherencia visual y conceptual con el resto del sistema.

### Por Qué Está Ahí

El usuario necesita ver las proyecciones del Fondo Emma siempre visibles, igual que en otras pantallas. La barra responde: "¿Hacia dónde va el Fondo Emma?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La barra de proyecciones fija (siempre visible)
2. El valor proyectado (escenario activo)
3. Los selectores (escenario y horizonte)

### Diseño Detallado

**Barra de Proyecciones (Fija)**

- Mismo diseño que en otras pantallas
- Posición: Fixed top, debajo del header principal
- Altura: 56px
- Z-index: 99
- Siempre visible, incluso al hacer scroll

**Contenido de la Barra (Recalculada para Emma):**

1. **Selector de Escenario:** Conservador | Base | Optimista
   - Las proyecciones se calculan solo para el Fondo Emma
   - Los escenarios reflejan diferentes tasas de interés compuesto

2. **Selector de Horizonte:** 5 años | 10 años | 20 años
   - Los horizontes se ajustan a los hitos del fondo (18, 25, 30 años)
   - O se mantienen genéricos (5, 10, 20 años)

3. **Valor Proyectado Nominal:** Número grande (24px)
   - Proyección del Fondo Emma en el escenario y horizonte activos

4. **Valor Proyectado Real (IPC):** Número secundario (20px)
   - Proyección ajustada por inflación del Fondo Emma

**Diferencia Clave:**

- **Las proyecciones se calculan solo para el Fondo Emma**
- **No incluyen el resto del patrimonio**
- **Mantienen coherencia visual con el sistema**

**Nota Explicativa (Opcional, Muy Sutil)**

Si se incluye una nota explicativa debajo del encabezado:

- Texto: "Las proyecciones muestran escenarios futuros del Fondo Emma, no garantías", 13px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 16px (después del subtítulo)
- **Muy discreta, solo para claridad**

**Por Qué Este Diseño:**

- La barra es el elemento más importante, siempre visible
- Recalculada para Emma mantiene coherencia conceptual
- El usuario entiende que son proyecciones del fondo específico
- Mantiene la misma experiencia visual que otras pantallas

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Barra de Proyecciones** (fija, siempre visible)
   - El usuario ve primero las proyecciones del Fondo Emma
   - Responde: "¿Hacia dónde va el Fondo Emma?"

2. **Encabezado** (título y subtítulo)
   - El usuario entiende el propósito del fondo
   - Responde: "¿Qué es el Fondo Emma?"

3. **Estado Actual del Fondo** (primer bloque)
   - El usuario ve el estado presente
   - Responde: "¿Cuánto tengo acumulado? ¿Cuánto aporto?"

4. **Proyección por Hitos** (segundo bloque)
   - El usuario ve los hitos temporales
   - Responde: "¿Cuánto tendré a los 18/25/30 años?"

5. **Evolución Temporal** (tercer bloque)
   - El usuario ve la trayectoria año a año
   - Responde: "¿Cómo crece el fondo en el tiempo?"

6. **Nominal vs Real** (cuarto bloque)
   - El usuario entiende el efecto de la inflación
   - Responde: "¿Cuánto vale realmente el fondo?"

7. **Relación con Patrimonio General** (quinto bloque)
   - El usuario ve cómo Emma contribuye
   - Responde: "¿Cómo impacta Emma en mi patrimonio?"

### Tiempo de Lectura

- **Lectura rápida (15 segundos):** Barra de proyecciones + Estado actual
- **Lectura media (2 minutos):** Todo lo anterior + Proyección por hitos
- **Lectura completa (5 minutos):** Todo lo anterior + Evolución temporal + Nominal vs Real + Relación patrimonio

---

## Estados Vacíos y Carga

### Estado Vacío (Fondo No Iniciado)

- Mensaje: "El Fondo Emma aún no ha sido iniciado"
- Subtítulo: "Configura el aporte inicial y mensual para comenzar"
- Botón: "Configurar fondo" (botón primario, opcional)
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Proyecciones Disponibles

- Mensaje discreto: "Las proyecciones se generan automáticamente cuando hay suficiente información"
- Tipografía: 13px, peso 400, color `#999999`
- Centrado en el área de contenido

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 3 columnas en proyección por hitos
- Grid de 2 columnas en otros bloques
- Todo el contenido visible con scroll vertical

### Large Desktop (1920px+)

- Mismo diseño, más espacio lateral
- El contenido se centra (máximo 1200px)
- Más espacio respirable

### Tablet (1024px - 1439px)

- Grids se convierten en 1 columna
- Las cards se apilan verticalmente
- El espaciado se mantiene
- La barra de proyecciones puede requerir scroll horizontal

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] El encabezado es sobrio y de largo plazo (no emocional)
- [ ] La barra de proyecciones está siempre visible (fixed)
- [ ] La barra se recalcula solo para el Fondo Emma
- [ ] El estado actual muestra capital, aportes y tiempo
- [ ] La proyección por hitos muestra 18, 25, 30 años claramente
- [ ] La evolución temporal muestra trayectoria, no precisión
- [ ] El nominal vs real es comparativo y explicativo
- [ ] La relación con patrimonio no duplica la pantalla de Proyecciones
- [ ] No hay gráficos ruidosos
- [ ] No hay sentimentalismo visual
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable

---

---

## 7. Eventos Patrimoniales en Fondo Emma

### Propósito

Cada aporte al Fondo Emma es un EVENTO patrimonial con fecha específica. Los cambios de aporte mensual y aportes extraordinarios son eventos que ajustan la proyección hacia adelante.

### Por Qué Está Ahí

El usuario necesita entender que cada aporte es un evento real que impacta hacia adelante. Esta funcionalidad responde: "¿Qué eventos ocurrieron en el Fondo Emma? ¿Cómo explican la evolución?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El estado actual del fondo — dónde está hoy
2. El historial de eventos — qué ocurrió
3. La capacidad de agregar eventos — acción principal

### Qué Decisión Habilita

- **Decisión:** ¿Qué eventos ocurrieron en el Fondo Emma? ¿Cómo impactan en el futuro?
- **Información clave:** El historial de eventos permite entender la evolución
- **Contexto:** Los eventos explican cambios en la proyección

### Diseño Detallado

**Tipos de Eventos en Fondo Emma:**

1. **Aporte Inicial**
   - Fecha: Fecha de inicio del fondo
   - Monto: Capital inicial
   - Tipo: Evento único

2. **Aporte Mensual**
   - Fecha: Fecha del aporte (mensual)
   - Monto: Monto del aporte mensual
   - Tipo: Evento recurrente (mensual)

3. **Cambio de Aporte Mensual**
   - Fecha: Fecha del cambio
   - Monto anterior: Monto anterior
   - Monto nuevo: Nuevo monto mensual
   - Tipo: Ajuste de proyección

4. **Aporte Extraordinario**
   - Fecha: Fecha del aporte
   - Monto: Monto extraordinario
   - Tipo: Evento puntual

5. **Pausa / Reanudación**
   - Fecha: Fecha de pausa o reanudación
   - Tipo: Cambio de estado

**Regla Inquebrantable:**
- Los eventos NO se modifican
- Si hay un cambio, se agrega un NUEVO evento
- El evento original queda en el historial
- La proyección se ajusta desde el nuevo evento

**Ejemplo:**
- Evento 1: "Aporte inicial - $1.000.000" (01/01/2022)
- Evento 2: "Aporte mensual - $50.000" (01/02/2022)
- Evento 3: "Aporte mensual - $50.000" (01/03/2022)
- Si el aporte mensual cambia a $60.000 en abril:
  - NO se modifican los eventos anteriores
  - Se agrega nuevo evento: "Cambio de aporte mensual - $50.000 → $60.000" (01/04/2022)
  - Todos los eventos quedan en el historial

**Historial de Eventos (Nueva Sección):**

**Card Contenedora:**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card:**

- Título: "HISTORIAL DE EVENTOS", 18px, peso 550, color `#000000`
- Subtítulo: "Evolución del Fondo Emma", 13px, peso 450, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Eventos (Orden Cronológico):**

**Cada Evento:**

- Layout horizontal:
  - Fecha (izquierda)
  - Tipo y monto (centro)
  - Capital acumulado (derecha)

**Diseño de Cada Fila:**

- Altura: 56px
- Padding: 16px horizontal / 16px vertical
- Fondo: `rgba(255, 255, 255, 0.3)` (muy sutil)
- Hover: Fondo `rgba(255, 255, 255, 0.5)`
- Sin bordes entre filas
- Espaciado entre filas: 4px

**Elementos de Cada Fila:**

1. **Fecha** (ancho: 120px)
   - Texto: 13px, peso 450, color `#666666`
   - Formato: "DD/MM/YYYY"

2. **Tipo y Monto** (ancho: flexible)
   - Tipo: 15px, peso 500, color `#000000` (ej: "Aporte mensual", "Aporte extraordinario")
   - Monto: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
   - Signo: `+` (aporte) / `→` (cambio)

3. **Capital Acumulado** (ancho: 200px)
   - Valor: 15px, peso 600, monospace, color `#666666`
   - Alineación: Derecha
   - **Capital después del evento**

**Agregar Evento:**

**Modal de Agregar Evento:**

**Campos:**
1. **Tipo de Evento**
   - Dropdown: Aporte inicial / Aporte mensual / Cambio de aporte mensual / Aporte extraordinario / Pausa / Reanudación
   - Requerido

2. **Fecha**
   - Selector de fecha
   - Default: Fecha actual
   - Requerido

3. **Monto / Valores**
   - Input numérico (si aplica)
   - Para "Cambio de aporte mensual": Dos inputs (anterior y nuevo)
   - Requerido según tipo de evento

4. **Nota (Opcional)**
   - Textarea
   - Placeholder: "Contexto del evento"
   - Opcional

**Botones:**
- "Agregar evento": Botón primario (azul sistema)
- "Cancelar": Botón texto

**Impacto en Proyección:**

- Cada evento ajusta la proyección hacia adelante
- La curva continúa desde el último evento
- Los eventos históricos explican cada cambio
- Nunca se recalculan hacia atrás

**Visualización de Impacto:**

- Al agregar un evento, la proyección se actualiza inmediatamente
- La curva muestra el punto de ajuste
- El historial explica cada cambio de trayectoria
- Los hitos (18, 25, 30 años) se recalculan desde el último evento

**Por Qué Este Diseño:**

- Eventos claros y fechados
- Historial navegable y legible
- Agregar evento es simple pero completo
- Sin modificación de eventos pasados
- Impacto visible en proyección

---

**Última actualización**: Diseño completo de Fondo Emma + Eventos Patrimoniales
**Versión**: 1.1
**Estado**: Completo y listo para referencia de implementación

