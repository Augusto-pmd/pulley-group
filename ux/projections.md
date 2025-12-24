# Proyecciones
## Pulley Group — Vista Estratégica de Largo Plazo

---

## Visión General

La pantalla de Proyecciones muestra el futuro esperado del patrimonio según diferentes escenarios. Es una vista estratégica que permite planificar y tomar decisiones de largo plazo, no una promesa matemática exacta.

**Filosofía de Uso**
- Comprensión estratégica del futuro (hacia dónde va el patrimonio)
- Comparación de escenarios (qué puede pasar en diferentes situaciones)
- Toma de decisiones de largo plazo (ajustes de estrategia)
- Sensación de control sobre el futuro

**Paradigma de Eventos Patrimoniales**
- Las proyecciones se alimentan de EVENTOS reales
- Cada evento ajusta la proyección hacia adelante
- La proyección continúa desde el último evento, no desde cero
- El historial de eventos explica la evolución
- Las proyecciones son dinámicas, no estáticas

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px) — eje rector del sistema
- Contenido principal con scroll vertical
- Cards limpias con información comparativa
- Sin gráficos ruidosos, solo información clara

---

## Layout General

### Estructura de la Página

```
┌─────────────────────────────────────────┐
│ HEADER (64px, fixed)                   │
├─────────────────────────────────────────┤
│ BARRA PROYECCIONES (56px, fixed)        │
│ (eje rector del sistema)                │
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
│  │ COMPARATIVA DE ESCENARIOS        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ EVOLUCIÓN TEMPORAL                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ IMPACTO DEL IPC                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ PUENTE CON INVERSIONES            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RELACIÓN CON FONDO EMMA          │   │
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

Establece el contexto estratégico de la pantalla. Título claro y subtítulo conceptual que explica el propósito sin tecnicismos.

### Por Qué Está Ahí

El usuario necesita entender que esta es una vista estratégica, no una promesa exacta. El encabezado responde: "¿Qué es esta pantalla? ¿Para qué sirve?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Proyecciones" — identificación inmediata
2. El subtítulo conceptual — explicación estratégica

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después de la barra de proyecciones)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título**

- Texto: "Proyecciones", 28px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante del encabezado**

**Subtítulo Conceptual**

- Texto: "Escenarios futuros de tu patrimonio para planificar decisiones de largo plazo", 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Explica el propósito estratégico sin tecnicismos ni promesas**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Subtítulo estratégico, no técnico
- Enfatiza "escenarios" y "planificar", no "promesas" ni "garantías"
- Mucho espacio respirable

---

## 2. Uso de la Barra Superior de Proyecciones

### Propósito

La barra de proyecciones es el eje rector del sistema. En esta pantalla, se reafirma su importancia y se explica su alcance global.

### Por Qué Está Ahí

El usuario necesita entender que las proyecciones en la barra son globales al patrimonio completo, no solo a una inversión específica.

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La barra de proyecciones fija (siempre visible)
2. El contenido explicativo (si aplica)

### Diseño Detallado

**Barra de Proyecciones (Fija)**

- Mismo diseño que en el dashboard
- Posición: Fixed top, debajo del header principal
- Altura: 56px
- Z-index: 99
- Siempre visible, incluso al hacer scroll

**Contenido de la Barra:**

1. **Selector de Escenario:** Conservador | Base | Optimista
2. **Selector de Horizonte:** 5 años | 10 años | 20 años
3. **Valor Proyectado Nominal:** Número grande (24px)
4. **Valor Proyectado Real (IPC):** Número secundario (20px)

**Nota Explicativa (Opcional, Muy Sutil)**

Si se incluye una nota explicativa debajo del encabezado:

- Texto: "Las proyecciones muestran escenarios futuros de todo tu patrimonio, no garantías", 13px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 16px (después del subtítulo)
- **Muy discreta, solo para claridad**

**Cálculo Dinámico desde Eventos**

**Regla Inquebrantable:**
- Las proyecciones se calculan desde el ESTADO ACTUAL
- El estado actual es el resultado de todos los EVENTOS históricos
- Cada nuevo evento ajusta la proyección hacia adelante
- Nunca se recalculan hacia atrás

**Ejemplo:**
- Estado actual: $10.000.000 (resultado de eventos históricos)
- Proyección a 10 años: Se calcula desde $10.000.000
- Si ocurre un nuevo evento (ej: aporte de $500.000):
  - Estado actual se actualiza: $10.500.000
  - Proyección se recalcula desde $10.500.000
  - El evento queda en el historial

**Por Qué Este Diseño:**

- La barra es el elemento más importante, siempre visible
- Reafirma que es global al patrimonio completo
- La nota explicativa (si existe) es muy sutil y no intrusiva
- El usuario entiende el alcance sin explicaciones largas
- Las proyecciones son dinámicas, se ajustan con cada evento

---

## 3. Eventos Patrimoniales en Proyecciones

### Propósito

Las proyecciones se alimentan de EVENTOS patrimoniales reales. Cada evento ajusta la proyección hacia adelante, explicando la evolución del patrimonio.

### Por Qué Está Ahí

El usuario necesita entender que las proyecciones son dinámicas y se ajustan con cada evento real. Esta funcionalidad responde: "¿Cómo impactan los eventos en mis proyecciones? ¿Qué eventos explican la evolución?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La proyección actual — dónde voy
2. El estado actual — punto de partida
3. El historial de eventos — qué explica la proyección

### Qué Decisión Habilita

- **Decisión:** ¿Cómo impactan los eventos en mis proyecciones? ¿Qué eventos debo considerar?
- **Información clave:** El historial de eventos permite entender la evolución
- **Contexto:** Los eventos explican cambios en las proyecciones

### Diseño Detallado

**Estado Actual (Nuevo):**

**Card Contenedora:**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card:**

- Título: "ESTADO ACTUAL", 18px, peso 550, color `#000000`
- Subtítulo: "Punto de partida para proyecciones", 13px, peso 450, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Contenido:**

- Patrimonio actual: 36px, peso 600, monospace, color `#000000`, letter-spacing -0.03em
- Fecha de actualización: 13px, peso 450, color `#666666`
- Descripción: "Resultado de todos los eventos históricos", 13px, peso 450, color `#666666`

**Historial de Eventos Recientes (Nuevo):**

**Card Contenedora:**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card:**

- Título: "EVENTOS RECIENTES", 18px, peso 550, color `#000000`
- Subtítulo: "Últimos eventos que impactan las proyecciones", 13px, peso 450, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Eventos (Últimos 5-10):**

**Cada Evento:**

- Layout horizontal:
  - Fecha (izquierda)
  - Tipo y monto (centro)
  - Impacto (derecha)

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
   - Tipo: 15px, peso 500, color `#000000` (ej: "Aporte inversión", "Ingreso mensual")
   - Monto: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em

3. **Impacto** (ancho: 200px)
   - Cambio en proyección: 15px, peso 600, monospace, color `#666666`
   - Alineación: Derecha

**Link a Historial Completo:**

- Texto: "Ver historial completo →", 13px, peso 500, color `#007AFF`
- Click: Navegación a vista completa de historial
- Posición: Debajo de la lista

**Impacto en Proyecciones:**

- Cada evento ajusta la proyección hacia adelante
- La proyección continúa desde el último evento
- Los eventos históricos explican cada cambio
- Nunca se recalculan hacia atrás

**Visualización de Impacto:**

- Al agregar un evento, la proyección se actualiza inmediatamente
- La comparativa de escenarios se recalcula
- La evolución temporal se ajusta
- Los hitos se recalculan desde el nuevo estado

**Por Qué Este Diseño:**

- Estado actual claro y visible
- Eventos recientes accesibles
- Impacto visible en proyecciones
- Historial completo navegable
- Sin modificación de eventos pasados

---

## 4. Bloque Comparativa de Escenarios

### Propósito

Muestra los tres escenarios (Conservador, Base, Optimista) lado a lado para comparación inmediata. Permite entender el rango de posibilidades.

### Por Qué Está Ahí

El usuario necesita ver todos los escenarios juntos para tomar decisiones estratégicas. Esta comparativa responde: "¿Cuál es el rango de posibilidades? ¿Qué diferencia hay entre escenarios?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Los valores proyectados (nominal y real) — métricas principales
2. Las diferencias entre escenarios — rango de posibilidades
3. Los labels de escenario — contexto

### Qué Decisión Habilita

- **Decisión:** ¿En qué escenario debo planificar? ¿Qué ajustes debo hacer a mi estrategia?
- **Información clave:** El rango entre conservador y optimista muestra la incertidumbre
- **Contexto:** La comparación ayuda a entender qué tan sensibles son las proyecciones a diferentes supuestos

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)

**Layout Grid 3 Columnas**

```
┌──────────────┬──────────────┬──────────────┐
│ CONSERVADOR  │     BASE     │  OPTIMISTA   │
│              │              │              │
│ Nominal      │ Nominal      │ Nominal      │
│ Real         │ Real         │ Real         │
│              │              │              │
│ Diferencia   │ Diferencia   │ Diferencia   │
└──────────────┴──────────────┴──────────────┘
```

**Cada Columna (Escenario)**

**Header de Escenario:**
- Título: "CONSERVADOR" / "BASE" / "OPTIMISTA", 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
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

**Diferencia con Base (Solo en Conservador y Optimista):**
- Label: "DIFERENCIA CON BASE", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 15px, peso 400, color `#666666`, monospace
- Signo: "+" o "-" antes del número
- Formato: Porcentaje o monto absoluto
- Alineación: Centro
- Margen inferior: 0px

**Espaciado Entre Columnas**

- Horizontal: 48px
- Los escenarios no se tocan, hay mucho aire

**Columna Base (Destacada Opcionalmente)**

- Si se quiere destacar la columna Base:
  - Borde vertical sutil: `1px solid #F5F5F5` a los lados
  - O fondo muy sutil: `#FAFAFA` (casi imperceptible)
- **No usar colores llamativos, solo diferenciación sutil**

**Por Qué Este Diseño:**

- Grid de 3 columnas permite comparación inmediata
- Valores nominal y real en cada escenario
- Diferencias muestran el rango de posibilidades
- Layout limpio y legible
- Sin gráficos, solo información textual clara

---

## 4. Bloque Evolución Temporal

### Propósito

Muestra cómo evoluciona el patrimonio año a año en el escenario activo. Enfoque en tendencia, no en precisión matemática.

### Por Qué Está Ahí

El usuario necesita ver la trayectoria del patrimonio a lo largo del tiempo. Esta evolución responde: "¿Cómo crece mi patrimonio año a año? ¿Cuál es la tendencia?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El valor actual (año 0) — punto de partida
2. El valor final (año del horizonte) — destino
3. Los valores intermedios — trayectoria

### Qué Decisión Habilita

- **Decisión:** ¿Estoy en el camino correcto? ¿Necesito ajustar mi estrategia?
- **Información clave:** La tendencia muestra si el patrimonio crece de forma sostenible
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
- Subtítulo: "Escenario [Conservador/Base/Optimista] - Horizonte [X años]", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Tabla de Evolución**

**Estructura:**
- Filas: Años (0, 1, 2, 3, ... hasta el horizonte)
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
   - Formato: "Año 0", "Año 1", etc.
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

**Nota Conceptual (Debajo de la Tabla)**

- Texto: "Estos valores son proyecciones basadas en supuestos. La realidad puede variar según múltiples factores.", 11px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 24px
- **Muy discreta, solo para claridad**

**Por Qué Este Diseño:**

- Tabla minimalista sin grid visible
- Enfoque en tendencia, no en precisión matemática
- Valores nominal y real visibles
- Variación año a año para entender el ritmo
- Nota conceptual discreta que no promete exactitud

---

## 5. Impacto del IPC

### Propósito

Explica cómo la inflación erosiona o preserva el valor del patrimonio. Comparación clara entre nominal y real.

### Por Qué Está Ahí

El usuario necesita entender que el valor nominal no es lo mismo que el poder adquisitivo real. Esta sección responde: "¿Cuánto vale realmente mi patrimonio en el futuro? ¿Cómo me afecta la inflación?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La diferencia entre nominal y real — impacto del IPC
2. El valor real proyectado — poder adquisitivo
3. La explicación conceptual — cómo funciona

### Qué Decisión Habilita

- **Decisión:** ¿Mis inversiones están protegiendo mi poder adquisitivo? ¿Debo ajustar mi estrategia?
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

- Título: "IMPACTO DEL IPC", 18px, peso 600, color `#000000`
- Subtítulo: "Cómo la inflación afecta el poder adquisitivo de tu patrimonio", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Comparación Visual (Grid 2 Columnas)**

```
┌──────────────────┬──────────────────┐
│ VALOR NOMINAL    │ VALOR REAL       │
│                  │                  │
│ $X.XXX.XXX       │ $X.XXX.XXX      │
│                  │                  │
│ (sin ajuste IPC) │ (ajustado IPC)   │
└──────────────────┴──────────────────┘
```

**Columna 1: Valor Nominal**

- Título: "VALOR NOMINAL", 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Descripción: "Sin ajuste por inflación", 13px, peso 400, color `#999999`
- Alineación: Centro
- Margen inferior: 0px

**Columna 2: Valor Real**

- Título: "VALOR REAL", 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Descripción: "Ajustado por inflación (IPC)", 13px, peso 400, color `#999999`
- Alineación: Centro
- Margen inferior: 0px

**Espaciado Entre Columnas**

- Horizontal: 48px
- Las columnas no se tocan

**Diferencia (Debajo del Grid)**

- Título: "Diferencia", 15px, peso 500, color `#000000`
- Valor: 20px, peso 600, color `#000000`, monospace
- Descripción: "Erosión del poder adquisitivo por inflación", 13px, peso 400, color `#666666`
- Alineación: Centro
- Margen superior: 32px

**Explicación Conceptual (Debajo)**

- Texto: "El valor nominal muestra el monto en pesos. El valor real muestra cuánto puedes comprar realmente con ese monto, considerando la inflación. La diferencia es la erosión del poder adquisitivo.", 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen superior: 32px
- Padding: 0px
- **Explicación clara y conceptual, no técnica**

**Por Qué Este Diseño:**

- Comparación visual clara entre nominal y real
- Valores destacados (28px) para comparación inmediata
- Explicación conceptual que no usa jerga técnica
- Enfoque en comprensión, no en precisión matemática

---

## 6. Puente con Inversiones

### Propósito

Muestra cómo cada tipo de inversión aporta a la proyección global. Sin listar todo, solo criterio y principios.

### Por Qué Está Ahí

El usuario necesita entender qué inversiones contribuyen más a las proyecciones. Esta sección responde: "¿Qué inversiones impactan más en mi futuro? ¿Cómo debo balancear mi cartera?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El principio general — cómo las inversiones aportan
2. Los tipos de inversión — clasificación
3. El impacto relativo — contribución a la proyección

### Qué Decisión Habilita

- **Decisión:** ¿Debo ajustar mi cartera? ¿Qué tipos de inversión debo priorizar?
- **Información clave:** El impacto relativo de cada tipo ayuda a entender qué inversiones son más estratégicas
- **Contexto:** No se listan todas las inversiones, solo se muestra el criterio y los principios

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "CONTRIBUCIÓN DE INVERSIONES", 18px, peso 600, color `#000000`
- Subtítulo: "Cómo cada tipo de inversión aporta a la proyección", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Principio General (Arriba)**

- Texto: "Las proyecciones consideran el capital y rendimiento esperado de cada tipo de inversión en tu cartera.", 15px, peso 400, color `#000000`
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 32px

**Lista de Tipos de Inversión**

**Cada Tipo:**

- Layout horizontal:
  - Tipo (izquierda)
  - Impacto relativo (derecha)

**Diseño de Cada Fila:**

- Altura: 48px
- Padding: 16px horizontal / 12px vertical
- Fondo: `#FFFFFF`
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas

**Columnas:**

1. **Tipo de Inversión** (ancho: flexible, mínimo 200px)
   - Texto: 15px, peso 500, color `#000000`
   - Ejemplos: "Acciones", "Bonos", "Fondos", "Inmuebles", etc.
   - Alineación: Izquierda

2. **Impacto Relativo** (ancho: 200px)
   - Texto: 15px, peso 400, color `#666666`, monospace
   - Formato: Porcentaje del total proyectado o descripción cualitativa
   - Alineación: Derecha

**Sin Detalle Individual**

- **No se listan todas las inversiones individuales**
- **Solo se muestra el criterio y los tipos**
- **El detalle está en la pantalla de Inversiones**

**Nota de Navegación (Opcional)**

- Texto: "Ver detalle de inversiones →", 13px, peso 400, color `#007AFF` (azul sistema)
- Alineación: Derecha
- Hover: Color `#0051D5`
- Click: Navegación a pantalla de Inversiones
- Margen superior: 24px

**Por Qué Este Diseño:**

- Muestra el criterio sin sobrecargar con detalles
- Lista de tipos, no de inversiones individuales
- Impacto relativo para entender contribución
- Link a pantalla de Inversiones para el detalle
- Enfoque en principios, no en listas exhaustivas

---

## 7. Relación con Fondo Emma

### Propósito

Muestra cómo el Fondo Emma impacta en las proyecciones de largo plazo. Sin duplicar la pantalla específica de Emma.

### Por Qué Está Ahí

El usuario necesita ver cómo Emma contribuye al futuro del patrimonio. Esta sección responde: "¿Cómo impacta Emma en mis proyecciones? ¿Estoy en camino de cumplir el objetivo?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El progreso del Fondo Emma — estado actual
2. La contribución a la proyección — impacto futuro
3. El objetivo — meta de largo plazo

### Qué Decisión Habilita

- **Decisión:** ¿Debo aumentar el aporte mensual a Emma? ¿Estoy en el camino correcto?
- **Información clave:** El progreso y la contribución muestran si Emma está cumpliendo su rol estratégico
- **Contexto:** No se duplica la pantalla de Emma, solo se muestra la relación con las proyecciones

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "FONDO EMMA", 18px, peso 600, color `#000000`
- Subtítulo: "Contribución a las proyecciones de largo plazo", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Grid 2x2**

```
┌──────────────────┬──────────────────┐
│ PROGRESO ACTUAL  │ OBJETIVO         │
├──────────────────┼──────────────────┤
│ CONTRIBUCIÓN     │ PROYECCIÓN EMMA  │
└──────────────────┴──────────────────┘
```

**Elemento 1: Progreso Actual**

- Label: "PROGRESO ACTUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: Porcentaje "XX.X%" o monto
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen inferior: 32px

**Elemento 2: Objetivo**

- Label: "OBJETIVO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen inferior: 32px

**Elemento 3: Contribución a Proyección**

- Label: "CONTRIBUCIÓN", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Descripción: "A las proyecciones de [horizonte]", 13px, peso 400, color `#666666`
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 0px

**Elemento 4: Proyección Emma**

- Label: "PROYECCIÓN EMMA", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Descripción: "Valor esperado a [horizonte]", 13px, peso 400, color `#666666`
- Espaciado: 8px entre label y valor
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 0px

**Espaciado Entre Elementos**

- Horizontal: 48px
- Vertical: 32px
- Los elementos no se tocan

**Link a Detalle (Opcional)**

- Texto: "Ver detalle de Fondo Emma →", 13px, peso 400, color `#007AFF` (azul sistema)
- Alineación: Derecha
- Hover: Color `#0051D5`
- Click: Navegación a pantalla específica de Emma
- Margen superior: 32px

**Por Qué Este Diseño:**

- Muestra la relación con las proyecciones sin duplicar contenido
- Grid organizado con información esencial
- Progreso y objetivo para contexto
- Contribución y proyección para impacto futuro
- Link a detalle para información completa

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Barra de Proyecciones** (fija, siempre visible)
   - El usuario ve primero las proyecciones principales
   - Responde: "¿Hacia dónde va mi patrimonio?"

2. **Encabezado** (título y subtítulo)
   - El usuario entiende el propósito estratégico
   - Responde: "¿Qué es esta pantalla?"

3. **Comparativa de Escenarios** (primer bloque)
   - El usuario compara los tres escenarios
   - Responde: "¿Cuál es el rango de posibilidades?"

4. **Evolución Temporal** (segundo bloque)
   - El usuario ve la trayectoria año a año
   - Responde: "¿Cómo crece mi patrimonio en el tiempo?"

5. **Impacto del IPC** (tercer bloque)
   - El usuario entiende el efecto de la inflación
   - Responde: "¿Cuánto vale realmente mi patrimonio?"

6. **Puente con Inversiones** (cuarto bloque)
   - El usuario ve cómo las inversiones contribuyen
   - Responde: "¿Qué inversiones impactan más?"

7. **Relación con Fondo Emma** (quinto bloque)
   - El usuario ve cómo Emma contribuye
   - Responde: "¿Cómo va Emma hacia el objetivo?"

### Tiempo de Lectura

- **Lectura rápida (15 segundos):** Barra de proyecciones + Comparativa de escenarios
- **Lectura media (2 minutos):** Todo lo anterior + Evolución temporal + Impacto IPC
- **Lectura completa (5 minutos):** Todo lo anterior + Puente inversiones + Relación Emma

---

## Estados Vacíos y Carga

### Estado Vacío (Sin Datos para Proyectar)

- Mensaje: "No hay suficiente información para generar proyecciones"
- Subtítulo: "Agrega inversiones y movimientos para ver escenarios futuros"
- Botón: "Agregar inversión" (botón primario, opcional)
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Proyecciones Disponibles

- Mensaje discreto: "Las proyecciones se generan automáticamente cuando hay suficiente información histórica"
- Tipografía: 13px, peso 400, color `#999999`
- Centrado en el área de contenido

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 3 columnas en comparativa de escenarios
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

- [ ] El encabezado es estratégico y conceptual (no técnico)
- [ ] La barra de proyecciones está siempre visible (fixed)
- [ ] La comparativa de escenarios muestra los tres escenarios claramente
- [ ] La evolución temporal muestra tendencia, no precisión matemática
- [ ] El impacto del IPC es explicativo y claro
- [ ] El puente con inversiones muestra criterio, no listas exhaustivas
- [ ] La relación con Emma no duplica la pantalla específica
- [ ] No hay gráficos ruidosos
- [ ] No hay sliders ni controles complejos
- [ ] No hay promesas ni garantías
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable

---

---

## Integración con Vida Mensual

### Bloque "Capital en Meses de Vida" (Nuevo)

**Propósito**

Muestra el capital proyectado expresado en "meses de vida". Permite entender el patrimonio futuro en términos de tiempo de vida cubierto.

**Por Qué Está Ahí**

El usuario necesita entender sus proyecciones en términos de vida mensual. Esta integración responde: "¿Cuántos meses de vida tendré en el futuro? ¿Cómo impacta el costo de vida en mis proyecciones?"

**Jerarquía Visual**

**Qué Mira el Ojo Primero:**
1. El capital proyectado — valor futuro
2. Los meses de vida — tiempo cubierto
3. La comparación entre escenarios — diferencias en meses

**Diseño Detallado**

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Layout Grid 3 Columnas (por Escenario)**

```
┌──────────────┬──────────────┬──────────────┐
│ CONSERVADOR  │     BASE     │  OPTIMISTA   │
│              │              │              │
│ Capital      │ Capital      │ Capital      │
│ Meses        │ Meses        │ Meses        │
└──────────────┴──────────────┴──────────────┘
```

**Cada Columna (Escenario):**

- Título: "CONSERVADOR" / "BASE" / "OPTIMISTA", 15px, peso 550, color `#000000`
- Capital proyectado: 24px, peso 600, monospace, color `#666666`, letter-spacing -0.025em
- Meses de vida: 28px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
- Cálculo: Capital proyectado / Gasto mensual promedio (de Vida Mensual)
- Alineación: Centro

**Nota Conceptual**

- Texto: "Basado en gasto mensual promedio de los últimos 12 meses", 11px, peso 450, color `#999999`
- Alineación: Izquierda
- Margen superior: 16px

**Posición en Proyecciones**

- Se agrega después de "Comparativa de Escenarios"
- Antes de "Evolución Temporal"
- Espaciado: 64px entre bloques

**Por Qué Este Diseño:**

- Grid 3 columnas permite comparación entre escenarios
- Meses de vida destacados (28px)
- Información conceptual clara
- Integración con Vida Mensual sin duplicación

---

**Última actualización**: Diseño completo de Proyecciones + Integración Vida Mensual
**Versión**: 1.1
**Estado**: Completo y listo para referencia de implementación

