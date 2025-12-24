# Flujos
## Pulley Group — Vista Transversal del Dinero en Movimiento

---

## Visión General

La pantalla de Flujos muestra todos los movimientos de dinero del patrimonio: ingresos, gastos, aportes a inversiones y retiros. Es una vista transversal que permite entender el flujo de caja y la relación entre diferentes tipos de movimientos.

**Filosofía de Uso**
- Comprensión del flujo de dinero (de dónde viene, a dónde va)
- Identificación de patrones (gastos recurrentes, ingresos estables)
- Toma de decisiones sobre gastos y aportes
- Control del flujo de caja

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px) — contexto del sistema
- Contenido principal con scroll vertical
- Cards limpias con información clara
- Filtros temporales discretos

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
│  │ FILTROS TEMPORALES               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ VISTA GENERAL DE FLUJOS          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ INGRESOS                          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ GASTOS                            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ APORTES                           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RETIROS                           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ INDICADORES DE TENDENCIA         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Bloques

- Entre encabezado y filtros: **32px**
- Entre filtros y vista general: **32px**
- Entre vista general y primera sección: **48px**
- Entre secciones de flujos: **48px**
- Entre última sección e indicadores: **48px**
- Bottom padding del contenido: **64px**

---

## 1. Encabezado de la Pantalla

### Propósito

Establece el contexto de la pantalla. Título claro y subtítulo conceptual que explica qué es esta vista.

### Por Qué Está Ahí

El usuario necesita entender inmediatamente qué está viendo. El encabezado responde: "¿Qué es esta pantalla? ¿Para qué sirve?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Flujos" — identificación inmediata
2. El subtítulo conceptual — explicación del propósito

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después de la barra de proyecciones)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título**

- Texto: "Flujos", 28px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante del encabezado**

**Subtítulo Conceptual**

- Texto: "Movimientos de dinero que entran y salen de tu patrimonio", 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Explica el concepto sin tecnicismos**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Subtítulo conceptual, no técnico
- Explica el propósito sin jerga financiera
- Mucho espacio respirable

---

## 2. Vista General de Flujos

### Propósito

Muestra un resumen ejecutivo de todos los flujos del período seleccionado. Permite ver el balance general de una mirada.

### Por Qué Está Ahí

El usuario necesita ver el panorama general antes de profundizar en detalles. Esta vista responde: "¿Cuánto entró? ¿Cuánto salió? ¿Cuál es el resultado neto?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Resultado Neto del Período — el balance final
2. Ingresos Totales — dinero que entra
3. Gastos Totales — dinero que sale
4. Aportes y Retiros — movimientos de inversiones

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)

**Layout Grid 2x3**

```
┌──────────────────┬──────────────────┐
│ RESULTADO NETO   │ (vacío)          │
├──────────────────┼──────────────────┤
│ INGRESOS TOTALES │ GASTOS TOTALES   │
├──────────────────┼──────────────────┤
│ APORTES          │ RETIROS          │
└──────────────────┴──────────────────┘
```

**Elemento 1: Resultado Neto del Período**

**Posición:** Arriba izquierda, ocupa más espacio visual

**Diseño:**
- Label: "RESULTADO NETO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 36px, peso 600, color `#000000`, monospace
- Signo: "+" o "-" antes del número, mismo tamaño
- Espaciado entre label y valor: 8px
- Padding: 0px
- **Es el número más importante, por eso 36px (Display)**

**Por Qué Este Diseño:**
- El resultado neto es la métrica principal
- Tamaño 36px porque es lo más importante
- Monospace para números grandes asegura legibilidad
- El signo matemático comunica dirección sin color

**Elemento 2: Ingresos Totales**

**Posición:** Centro izquierda

**Diseño:**
- Label: "INGRESOS TOTALES", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px (separación de la fila superior)

**Por Qué Este Diseño:**
- Muestra todo el dinero que entró
- Tamaño 28px (Heading grande) porque es importante pero secundario al resultado neto
- Información esencial para entender el flujo

**Elemento 3: Gastos Totales**

**Posición:** Centro derecha

**Diseño:**
- Label: "GASTOS TOTALES", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Muestra todo el dinero que salió
- Mismo tamaño que ingresos (misma jerarquía)
- Permite comparar entradas vs salidas

**Elemento 4: Aportes**

**Posición:** Abajo izquierda

**Diseño:**
- Label: "APORTES", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Muestra dinero invertido en inversiones
- Tamaño 24px (Heading 1) porque es información de contexto
- Ayuda a entender hacia dónde va el dinero

**Elemento 5: Retiros**

**Posición:** Abajo derecha

**Diseño:**
- Label: "RETIROS", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Muestra dinero retirado de inversiones
- Mismo tamaño que aportes (misma jerarquía)
- Complementa la información de aportes

**Espaciado Entre Elementos**

- Horizontal (entre columnas): 48px
- Vertical (entre filas): 32px
- Los elementos no se tocan, hay mucho aire

**Por Qué Este Diseño General:**

- Grid organizado y legible
- Resultado neto destacado como métrica principal
- Información completa pero no sobrecargada
- Comparación visual clara entre ingresos y gastos

---

## 3. Separación por Tipo de Flujo

### Propósito

Organiza los flujos por tipo para facilitar la lectura y el análisis. Cada tipo tiene su propia sección con lectura visual clara.

### Por Qué Está Ahí

El usuario necesita ver los flujos organizados por tipo para entender patrones y tomar decisiones. Esta organización responde: "¿Qué tipo de flujos tengo? ¿Cuáles son los más importantes?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título de la sección — identificación del tipo
2. El total de la sección — magnitud del tipo
3. La lista de flujos — detalle individual

### Diseño Detallado

**Estructura de Cada Sección**

Cada tipo de flujo (Ingresos, Gastos, Aportes, Retiros) tiene su propia card con:

1. Header de sección con título y total
2. Lista de flujos individuales
3. Indicadores opcionales (tendencias, alertas)

---

### 3.1. Sección: Ingresos

**Card Contenedora**

- Tipo: Card con Header
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Sección**

- Título: "INGRESOS", 18px, peso 600, color `#000000`
- Total: 24px, peso 600, color `#000000`, monospace, alineado a la derecha
- Layout: Flexbox horizontal (título izquierda, total derecha)
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Lista de Flujos**

**Cada Flujo Individual:**

- Layout horizontal:
  - Fecha (izquierda)
  - Descripción/Concepto (centro)
  - Inversión asociada (centro, opcional)
  - Monto (derecha)

**Diseño de Cada Fila:**

- Altura: 48px
- Padding: 16px horizontal / 12px vertical
- Fondo: `#FFFFFF`
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas
- Espaciado entre filas: 0px

**Columnas:**

1. **Fecha** (ancho: 100px)
   - Texto: 13px, peso 400, color `#666666`
   - Formato: "DD/MM"
   - Alineación: Izquierda

2. **Descripción/Concepto** (ancho: flexible, mínimo 200px)
   - Texto: 15px, peso 400, color `#000000`
   - Alineación: Izquierda
   - **Es el elemento más importante para identificación**

3. **Inversión Asociada** (ancho: 180px, opcional)
   - Texto: 13px, peso 400, color `#666666`
   - Alineación: Izquierda
   - Link: Color `#007AFF` (azul sistema) si es clickeable
   - Hover: Color `#0051D5`

4. **Monto** (ancho: 140px)
   - Texto: 15px, peso 600, color `#000000`, monospace
   - Alineación: Derecha
   - **Es la métrica principal**

**Total de Sección (Footer Opcional)**

- Borde superior: `1px solid #F5F5F5` (muy sutil)
- Padding: 16px horizontal / 12px vertical
- Texto: "Total", 13px, peso 500, color `#666666`
- Valor: 18px, peso 600, color `#000000`, monospace, alineado a la derecha
- Layout: Flexbox horizontal (texto izquierda, valor derecha)

**Por Qué Este Diseño:**

- Header claro con total visible
- Lista minimalista sin grid visible
- Información esencial: fecha, concepto, monto
- Link a inversión asociada si aplica
- Total al final para confirmación

---

### 3.2. Sección: Gastos

**Card Contenedora**

- Mismo diseño que Ingresos
- Tipo: Card con Header
- Padding: 24px
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Sección**

- Título: "GASTOS", 18px, peso 600, color `#000000`
- Total: 24px, peso 600, color `#000000`, monospace, alineado a la derecha
- Layout: Flexbox horizontal
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Lista de Flujos**

- Mismo diseño que Ingresos
- Altura de fila: 48px
- Columnas: Fecha, Descripción, Inversión (opcional), Monto
- Hover: Fondo `#FAFAFA`

**Diferencias Visuales (Mínimas):**

- No hay diferencia visual extrema con Ingresos
- El contexto (título "GASTOS") comunica la naturaleza
- El signo matemático en el monto puede ser implícito (negativo)

**Por Qué Este Diseño:**

- Consistencia visual con Ingresos
- El título comunica la naturaleza del flujo
- Sin colores diferenciadores (mantiene minimalismo)

---

### 3.3. Sección: Aportes

**Card Contenedora**

- Mismo diseño que Ingresos y Gastos
- Tipo: Card con Header
- Padding: 24px
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Sección**

- Título: "APORTES", 18px, peso 600, color `#000000`
- Total: 24px, peso 600, color `#000000`, monospace, alineado a la derecha
- Layout: Flexbox horizontal
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Lista de Flujos**

- Mismo diseño que Ingresos y Gastos
- **Diferencia clave:** La columna "Inversión Asociada" es obligatoria (no opcional)
- Cada aporte está asociado a una inversión específica
- El link a la inversión es más prominente

**Por Qué Este Diseño:**

- Los aportes siempre están asociados a una inversión
- El link a la inversión es esencial
- Consistencia visual con otras secciones

---

### 3.4. Sección: Retiros

**Card Contenedora**

- Mismo diseño que las otras secciones
- Tipo: Card con Header
- Padding: 24px
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Sección**

- Título: "RETIROS", 18px, peso 600, color `#000000`
- Total: 24px, peso 600, color `#000000`, monospace, alineado a la derecha
- Layout: Flexbox horizontal
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Lista de Flujos**

- Mismo diseño que Aportes
- La columna "Inversión Asociada" es obligatoria
- Cada retiro está asociado a una inversión específica

**Por Qué Este Diseño:**

- Los retiros siempre están asociados a una inversión
- Consistencia visual con Aportes
- El link a la inversión es esencial

---

## 4. Relación con Inversiones

### Propósito

Cada flujo está asociado a una inversión (cuando aplica). Esta relación debe ser clara y navegable.

### Por Qué Está Ahí

El usuario necesita entender la conexión entre flujos e inversiones. Esta relación responde: "¿De qué inversión viene este flujo? ¿A qué inversión va?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El flujo individual (fecha, concepto, monto)
2. La inversión asociada (si aplica)
3. El link a la inversión (si es clickeable)

### Diseño Detallado

**Columna "Inversión Asociada" en Listas de Flujos**

**Cuando Aplica:**
- Aportes: siempre asociados a una inversión
- Retiros: siempre asociados a una inversión
- Ingresos: opcional (dividendos, intereses pueden estar asociados)
- Gastos: opcional (gastos relacionados con inversiones)

**Diseño:**
- Texto: 13px, peso 400, color `#666666`
- Si es clickeable: Color `#007AFF` (azul sistema)
- Hover: Color `#0051D5`
- Alineación: Izquierda
- Ancho: 180px

**Interacción:**
- Hover: Color cambia a `#0051D5` (más oscuro)
- Click: Navegación a vista detalle de la inversión
- Transición: 150ms ease

**Filtro por Inversión**

**Ubicación:** En la card de filtros temporales (sección 5)

**Diseño:**
- Label: "Inversión", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: "Todas" | Lista de inversiones
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 200px

**Comportamiento:**
- Al seleccionar una inversión, se filtran todos los flujos asociados
- Las secciones muestran solo flujos de esa inversión
- El filtro se mantiene al cambiar de sección

**Por Qué Este Diseño:**

- La relación con inversiones es clara y navegable
- El link es discreto pero accesible
- El filtro permite análisis por inversión
- Consistencia visual con el resto de la aplicación

---

## 5. Filtros Temporales

### Propósito

Permite cambiar el período de análisis. Los filtros son discretos pero accesibles.

### Por Qué Está Ahí

El usuario necesita ver flujos de diferentes períodos. Los filtros responden: "¿Qué período quiero analizar?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Las cards de flujos (el contenido principal)
2. Los filtros temporales (herramientas discretas)

### Diseño Detallado

**Card Contenedora de Filtros**

- Tipo: Card Simple
- Padding: 16px (vertical) / 24px (horizontal) — más compacta
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)
- **Siempre visible, no colapsable**

**Layout Horizontal**

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ MES      │ TRIMESTRE│ AÑO      │ CUSTOM   │ INVERSIÓN│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Filtro 1: Mes**

- Label: "Mes", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto o botones texto
- Opciones: Mes actual + últimos 12 meses
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 140px

**Filtro 2: Trimestre**

- Label: "Trimestre", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: Trimestre actual + últimos 8 trimestres
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 140px

**Filtro 3: Año**

- Label: "Año", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: Año actual + últimos 5 años
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 100px

**Filtro 4: Custom (Conceptual)**

- Label: "Período", 13px, peso 400, color `#666666`
- Selector: Input de fecha o rango de fechas
- Diseño: Input estándar (borde `1px solid #E5E5E5`, padding 12px vertical / 16px horizontal)
- Focus: Borde `#007AFF`, outline sutil
- Ancho: Flexible, mínimo 200px

**Filtro 5: Inversión**

- Label: "Inversión", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: "Todas" | Lista de inversiones
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 200px

**Espaciado Entre Filtros**

- Horizontal: 24px
- Los filtros se alinean horizontalmente
- Si no caben, se apilan en 2 filas

**Estados Activos**

- Filtro activo: Peso 600, color `#000000`
- Filtro inactivo: Peso 400, color `#666666`
- Sin fondos de color, solo tipografía

**Comportamiento**

- Solo un filtro temporal puede estar activo a la vez (Mes, Trimestre, Año, o Custom)
- El filtro de Inversión es independiente (puede combinarse con cualquier filtro temporal)
- Al cambiar de filtro, el contenido se actualiza inmediatamente

**Por Qué Este Diseño:**

- Discreto pero accesible
- No compite con las cards de flujos
- Los filtros son herramientas, no el contenido
- Layout horizontal compacto
- Sin colores llamativos, solo tipografía

---

## 6. Indicadores de Tendencia

### Propósito

Muestra patrones y tendencias en los flujos sin ser intrusivo. Alertas suaves, sin popups.

### Por Qué Está Ahí

El usuario necesita identificar patrones para tomar decisiones. Los indicadores responden: "¿Hay algo que deba notar? ¿Qué patrones veo?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Las cards de flujos (el contenido principal)
2. Los indicadores de tendencia (información complementaria)

### Diseño Detallado

**Card Contenedora de Indicadores**

- Tipo: Card Simple
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)
- **Solo visible si hay indicadores relevantes**

**Indicador 1: Gastos Recurrentes**

**Diseño:**
- Título: "Gastos Recurrentes", 15px, peso 500, color `#000000`
- Lista de gastos recurrentes:
  - Concepto: 13px, peso 400, color `#000000`
  - Frecuencia: 13px, peso 400, color `#666666` (ej: "Mensual", "Trimestral")
  - Monto promedio: 13px, peso 400, color `#666666`, monospace
- Layout: Lista vertical
- Espaciado: 12px entre elementos
- Margen superior: 16px (después del título)

**Por Qué Este Diseño:**
- Identifica gastos que se repiten
- Ayuda a planificar y presupuestar
- Información clara sin ruido

**Indicador 2: Ingresos Estables vs Variables**

**Diseño:**
- Título: "Patrón de Ingresos", 15px, peso 500, color `#000000`
- Grid de 2 columnas:
  - Estables: Concepto + monto promedio
  - Variables: Concepto + rango (mínimo - máximo)
- Texto: 13px, peso 400, color `#000000`
- Espaciado: 24px entre columnas
- Margen superior: 16px

**Por Qué Este Diseño:**
- Diferencia ingresos predecibles de variables
- Ayuda a planificar flujo de caja
- Información útil sin gráficos

**Indicador 3: Alertas Suaves**

**Diseño:**
- Título: "Atención", 15px, peso 500, color `#000000`
- Lista de alertas:
  - Mensaje: 13px, peso 400, color `#000000`
  - Sin iconos llamativos
  - Sin colores de fondo
  - Solo texto discreto
- Layout: Lista vertical
- Espaciado: 12px entre elementos
- Margen superior: 16px

**Ejemplos de Alertas:**
- "Gasto inusual detectado este mes"
- "Ingreso esperado no registrado"
- "Aporte pendiente a inversión X"

**Por Qué Este Diseño:**
- Alertas suaves, no intrusivas
- Sin popups ni modales
- El contenido comunica la importancia
- Minimalismo extremo

**Espaciado Entre Indicadores**

- Vertical: 32px
- Los indicadores se apilan verticalmente
- Sin separadores visuales (solo espacio)

**Por Qué Este Diseño General:**

- Los indicadores son información complementaria
- No compiten con las cards de flujos
- Solo aparecen cuando hay información relevante
- Diseño discreto y legible

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Encabezado** (título y subtítulo)
   - El usuario entiende qué es esta pantalla
   - Responde: "¿Qué estoy viendo?"

2. **Filtros Temporales** (herramientas)
   - El usuario ajusta el período
   - Responde: "¿Qué período quiero ver?"

3. **Vista General de Flujos** (resumen ejecutivo)
   - El usuario ve el balance general
   - Responde: "¿Cuál es el resultado neto?"

4. **Secciones de Flujos** (detalle por tipo)
   - El usuario analiza cada tipo de flujo
   - Responde: "¿Qué ingresos/gastos/aportes/retiros tengo?"

5. **Indicadores de Tendencia** (patrones)
   - El usuario identifica patrones
   - Responde: "¿Hay algo que deba notar?"

### Tiempo de Lectura

- **Lectura rápida (10 segundos):** Encabezado + Vista General
- **Lectura media (1 minuto):** Todo lo anterior + Secciones principales
- **Lectura completa (3-5 minutos):** Todo lo anterior + Indicadores + Detalle de flujos

---

## Estados Vacíos y Carga

### Estado Vacío (Sin Flujos)

- Mensaje: "No hay flujos registrados en este período"
- Subtítulo: "Los movimientos de dinero aparecerán aquí"
- Botón: "Agregar flujo" (botón primario, opcional)
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Flujos en Sección

- Mensaje discreto: "No hay [tipo] en este período"
- Tipografía: 13px, peso 400, color `#999999`
- Centrado en el área de la sección

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 2 columnas en vista general
- Todo el contenido visible con scroll vertical

### Large Desktop (1920px+)

- Mismo diseño, más espacio lateral
- El contenido se centra (máximo 1200px)
- Más espacio respirable

### Tablet (1024px - 1439px)

- Cards se apilan verticalmente
- Grids se convierten en 1 columna
- El espaciado se mantiene
- Filtros pueden apilarse en 2 filas

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] El encabezado es claro y conceptual (no técnico)
- [ ] La vista general muestra el resultado neto destacado
- [ ] Las secciones de flujos están bien organizadas
- [ ] La relación con inversiones es clara y navegable
- [ ] Los filtros temporales son discretos pero accesibles
- [ ] Los indicadores de tendencia son suaves, no intrusivos
- [ ] No hay gráficos ruidosos
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable
- [ ] La barra de proyecciones está presente (contexto del sistema)

---

**Última actualización**: Diseño completo de Flujos
**Versión**: 1.0
**Estado**: Completo y listo para referencia de implementación

