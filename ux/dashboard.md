# Dashboard Principal
## Pulley Group — Pantalla de Inicio

---

## Visión General

El Dashboard es la pantalla que el usuario abre todos los días. Es el punto de entrada a toda la información patrimonial. Debe comunicar el estado actual y las proyecciones futuras de forma inmediata, sin ruido, sin distracciones.

**Filosofía de Uso Diario**
- Lectura rápida de estado general (5 segundos)
- Lectura detallada cuando se necesita (sin límite de tiempo)
- Toma de decisiones informada
- Sensación de control y claridad

**Paradigma de Eventos Patrimoniales**
- El estado actual es el resultado de todos los EVENTOS históricos
- Las proyecciones se calculan desde el estado actual
- Cada nuevo evento ajusta el estado y las proyecciones
- El dashboard muestra el resultado dinámico de eventos reales

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px)
- Contenido principal con scroll vertical
- Bloques organizados por jerarquía de importancia
- Mucho espacio entre bloques

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
│  │ ESTADO PATRIMONIAL               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ DISTRIBUCIÓN │  │ FONDO EMMA   │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ RANKING INVERSIONES             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ALERTAS (solo si aplica)        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Bloques

- Entre Estado Patrimonial y Distribución/Emma: **64px**
- Entre Distribución y Emma (horizontal): **24px**
- Entre Distribución/Emma y Ranking: **64px**
- Entre Ranking y Alertas: **48px**
- Bottom padding del contenido: **64px**

---

## 1. Barra Superior Fija — PROYECCIONES

### Propósito

Esta barra es el elemento más importante del dashboard. Muestra las proyecciones financieras en tiempo real y permite cambiar escenarios y horizontes temporales. Está siempre visible, incluso al hacer scroll.

### Por Qué Está Ahí

Las proyecciones son el corazón de Pulley Group. El usuario necesita ver constantemente hacia dónde va su patrimonio según diferentes escenarios. Esta barra responde a la pregunta fundamental: "¿Voy bien?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El valor proyectado nominal (escenario activo) — más grande, más pesado
2. El selector de escenario (Conservador | Base | Optimista) — indica qué se está viendo
3. El selector de horizonte (5 / 10 / 20 años) — contexto temporal
4. El valor proyectado real (IPC) — información secundaria pero importante

### Diseño Detallado

**Posición y Comportamiento**
- Posición: Fixed top, debajo del header principal
- Altura: 56px
- Ancho: 100%
- Z-index: 99
- Fondo: `#FFFFFF` (blanco)
- Borde inferior: `1px solid #E5E5E5`
- Padding lateral: 64px (alineado con el contenido)

**Layout Horizontal**

La barra se divide en 5 secciones de izquierda a derecha:

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ ESCENARIO│ HORIZONTE│ NOMINAL  │   REAL   │  (vacío) │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Sección 1: Selector de Escenario**

**Contenido:**
- Tres opciones horizontales: "Conservador" | "Base" | "Optimista"
- La opción activa está destacada
- Separación entre opciones: 16px

**Diseño:**
- Altura: 56px (toda la barra)
- Padding: 12px vertical / 16px horizontal
- Tipografía opciones: 13px, peso 400, color `#666666`
- Tipografía activa: 13px, peso 600, color `#000000`
- Separador visual entre opciones: `|` (pipe), 13px, color `#E5E5E5`, padding horizontal 8px

**Interacción:**
- Hover: Color `#000000` (negro)
- Click: Cambia el escenario activo
- Transición: 150ms ease
- Sin fondo en hover (solo cambio de color de texto)

**Por Qué Este Diseño:**
- Minimalista: solo texto, sin botones ni fondos
- Claridad: el peso tipográfico indica el estado activo
- Discreto: no compite con los valores proyectados

**Sección 2: Selector de Horizonte**

**Contenido:**
- Tres opciones: "5 años" | "10 años" | "20 años"
- La opción activa está destacada
- Separación entre opciones: 12px

**Diseño:**
- Altura: 56px
- Padding: 12px vertical / 16px horizontal
- Tipografía opciones: 13px, peso 400, color `#666666`
- Tipografía activa: 13px, peso 600, color `#000000`
- Separador visual: `|` (pipe), 13px, color `#E5E5E5`, padding horizontal 8px

**Interacción:**
- Mismo comportamiento que selector de escenario
- Cambia el horizonte temporal de todas las proyecciones

**Por Qué Este Diseño:**
- Consistencia con el selector de escenario
- Permite explorar diferentes horizontes sin cambiar de pantalla
- El usuario entiende inmediatamente el contexto temporal

**Sección 3: Valor Proyectado Nominal**

**Contenido:**
- Label: "PROYECCIÓN NOMINAL" (arriba)
- Valor: Número grande (abajo)
- Moneda: "$" antes del número

**Diseño:**
- Altura: 56px
- Padding: 8px vertical / 24px horizontal
- Label: 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace (SF Mono)
- Espaciado entre label y valor: 4px
- Alineación: Izquierda

**Por Qué Este Diseño:**
- El valor es lo más importante, por eso es el más grande (24px)
- Monospace para números grandes asegura alineación y legibilidad
- El label es casi imperceptible pero informa
- Izquierda porque es el valor principal

**Sección 4: Valor Proyectado Real (IPC)**

**Contenido:**
- Label: "PROYECCIÓN REAL" (arriba)
- Valor: Número (abajo)
- Moneda: "$" antes del número
- Indicador sutil: "IPC ajustado"

**Diseño:**
- Altura: 56px
- Padding: 8px vertical / 24px horizontal
- Label: 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 4px
- Alineación: Izquierda
- Tamaño menor que nominal (20px vs 24px) porque es información secundaria

**Por Qué Este Diseño:**
- Muestra el poder adquisitivo real, no solo el nominal
- Más pequeño que el nominal porque es información complementaria
- Mismo estilo para mantener coherencia
- El usuario entiende la diferencia sin explicación

**Sección 5: Espacio Vacío / Futuras Acciones**

**Contenido:**
- Vacío por defecto
- Puede contener acciones futuras (exportar, compartir, etc.)
- Flex: auto (toma el espacio restante)

**Diseño:**
- Altura: 56px
- Padding derecho: 24px (alineado con el contenido)

**Separadores Visuales**

Entre secciones 2-3 y 3-4:
- Borde vertical: `1px solid #F5F5F5`
- Altura: 32px (centrado verticalmente)
- Margen: 12px arriba y abajo

**Estados Interactivos**

- Hover sobre selectores: Color de texto cambia a `#000000`
- Hover sobre valores: Fondo `#FAFAFA` (muy sutil)
- Click en valores: Navegación a pantalla de proyecciones detalladas (opcional)

**Responsive**

- En pantallas menores a 1440px, la barra permite scroll horizontal
- Los valores se mantienen visibles siempre
- Los selectores pueden colapsar en un menú si es necesario

---

## 2. Bloque Estado Patrimonial

### Propósito

Muestra el estado actual del patrimonio de forma clara y completa. Es el primer bloque que el usuario ve después de la barra de proyecciones.

### Por Qué Está Ahí

El usuario necesita saber dónde está ahora antes de pensar en el futuro. Este bloque responde: "¿Cuánto tengo? ¿Cómo va este mes? ¿Cómo va este año?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Patrimonio Total — el número más grande, el más importante
2. Resultado Mensual — información de corto plazo, relevante
3. Resultado Anual — contexto de mediano plazo
4. Capital Invertido — desglose del patrimonio total
5. Liquidez — información complementaria
6. Variación Real — información secundaria pero importante

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso que el estándar
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: 8px
- Ancho: 100% (hasta el máximo de 1200px)

**Layout Interno**

Grid de 3 columnas (conceptual):

```
┌──────────────────┬──────────────────┬──────────────────┐
│ PATRIMONIO TOTAL │ RESULTADO MENSUAL│ RESULTADO ANUAL  │
│   (destacado)    │                  │                  │
├──────────────────┼──────────────────┼──────────────────┤
│ CAPITAL INVERTIDO│     LIQUIDEZ     │  VARIACIÓN REAL  │
└──────────────────┴──────────────────┴──────────────────┘
```

**Elemento 1: Patrimonio Total**

**Posición:** Arriba izquierda, ocupa más espacio visual

**Diseño:**
- Label: "PATRIMONIO TOTAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 48px, peso 600, color `#000000`, monospace
- Moneda: "$" antes del número, mismo tamaño y peso
- Espaciado entre label y valor: 8px
- Padding: 0px (dentro del padding de la card)

**Por Qué Este Diseño:**
- Es el número más importante, por eso 48px (Display)
- Ocupa la posición de mayor jerarquía (arriba izquierda)
- Monospace para números grandes asegura legibilidad perfecta
- El label es casi invisible pero informa

**Elemento 2: Resultado Mensual**

**Posición:** Arriba centro

**Diseño:**
- Label: "RESULTADO MENSUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Indicador de signo: "+" o "-" antes del número, mismo tamaño
- Color del valor: 
  - Positivo: `#000000` (negro)
  - Negativo: `#000000` (negro) — no se usa rojo, solo el signo indica
- Espaciado entre label y valor: 8px
- Padding: 0px

**Por Qué Este Diseño:**
- Información de corto plazo, relevante para decisiones diarias
- Tamaño 28px (Heading grande) porque es importante pero secundario al patrimonio total
- No se usa color rojo/verde para mantener minimalismo
- El signo matemático es suficiente para comunicar dirección

**Elemento 3: Resultado Anual**

**Posición:** Arriba derecha

**Diseño:**
- Label: "RESULTADO ANUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Indicador de signo: "+" o "-" antes del número
- Espaciado entre label y valor: 8px
- Padding: 0px

**Por Qué Este Diseño:**
- Contexto de mediano plazo
- Mismo tamaño que mensual porque tienen igual importancia relativa
- Consistencia visual con resultado mensual

**Elemento 4: Capital Invertido**

**Posición:** Abajo izquierda

**Diseño:**
- Label: "CAPITAL INVERTIDO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px (separación de la fila superior)

**Por Qué Este Diseño:**
- Desglose del patrimonio total
- Tamaño 20px (Heading 2) porque es información de contexto
- Ayuda a entender la composición del patrimonio

**Elemento 5: Liquidez**

**Posición:** Abajo centro

**Diseño:**
- Label: "LIQUIDEZ", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Información complementaria importante
- Mismo tamaño que capital invertido (misma jerarquía)
- Indica disponibilidad inmediata de fondos

**Elemento 6: Variación Real**

**Posición:** Abajo derecha

**Diseño:**
- Label: "VARIACIÓN REAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Indicador de porcentaje: "%" después del número, mismo tamaño
- Indicador de signo: "+" o "-" antes del número
- Espaciado entre label y valor: 8px
- Padding: 0px
- Margen superior: 32px

**Por Qué Este Diseño:**
- Muestra el rendimiento ajustado por inflación
- Información secundaria pero valiosa
- Mismo tamaño que otras métricas de la fila inferior
- El porcentaje comunica eficientemente la variación

**Espaciado Entre Elementos**

- Horizontal (entre columnas): 48px
- Vertical (entre filas): 32px
- Los elementos no se tocan, hay mucho aire

**Responsive**

- En pantallas menores, el grid se convierte en 2 columnas
- En pantallas muy pequeñas, se apila verticalmente
- El patrimonio total siempre ocupa el ancho completo cuando se apila

---

## 3. Bloque Distribución del Patrimonio

### Propósito

Muestra cómo está distribuido el patrimonio en categorías conceptuales. No es un gráfico, es información textual organizada.

### Por Qué Está Ahí

El usuario necesita entender la composición de su patrimonio. Esta información ayuda a tomar decisiones de rebalanceo y entender el riesgo.

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título del bloque — contexto
2. Los valores de cada categoría — información principal
3. Los porcentajes — información secundaria pero útil
4. Las etiquetas — casi invisibles pero informan

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: 8px
- Ancho: Flexible (grid de 2 columnas con Fondo Emma)

**Header de Card**

- Título: "DISTRIBUCIÓN DEL PATRIMONIO", 18px, peso 600, color `#000000`
- Sin subtítulo
- Sin acciones
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px (el contenido continúa con padding)

**Contenido**

Lista vertical de 5 categorías:

**Layout de Cada Categoría:**

```
┌─────────────────────────────────────────┐
│ PRODUCTIVO                              │
│ $X.XXX.XXX        XX%                  │
└─────────────────────────────────────────┘
```

**Diseño de Cada Categoría:**

- Label (categoría): 15px, peso 500, color `#000000`
- Valor: 20px, peso 600, color `#000000`, monospace, alineado a la derecha
- Porcentaje: 15px, peso 400, color `#666666`, alineado a la derecha
- Padding vertical: 16px
- Padding horizontal: 0px (usa el padding de la card)
- Espaciado entre categorías: 0px (las categorías se tocan, separadas solo por el padding)

**Layout Interno:**

- Flexbox horizontal
- Label a la izquierda
- Valor y porcentaje a la derecha (alineados)
- Espaciado entre valor y porcentaje: 16px

**Categorías:**

1. **Productivo**
   - Capital que genera rendimiento activo
   - Inversiones, activos productivos

2. **Pasivo**
   - Deudas, obligaciones
   - Valor negativo (si aplica)

3. **Liquidez**
   - Disponible inmediatamente
   - Efectivo, cuentas corrientes

4. **Largo Plazo**
   - Inversiones de horizonte extendido
   - Activos no líquidos a corto plazo

5. **Riesgo**
   - Exposición a riesgo (conceptual)
   - Puede ser un porcentaje o indicador

**Por Qué Este Diseño:**

- Sin gráficos porque distraen y no agregan información que el texto no comunique mejor
- Lista vertical porque es más legible que un grid
- Valores destacados (20px) porque son lo más importante
- Porcentajes en gris porque son información complementaria
- Mucho espacio vertical (16px entre elementos) para respiración

**Interacción:**

- Hover sobre categoría: Fondo `#FAFAFA` (muy sutil)
- Click (opcional): Navegación a detalle de esa categoría
- Sin bordes entre categorías, solo el hover indica interactividad

---

## 4. Bloque Ranking de Inversiones

### Propósito

Muestra todas las inversiones ordenadas por rendimiento. Permite identificar qué inversiones están funcionando mejor y peor.

### Por Qué Está Ahí

El usuario necesita ver el desempeño individual de cada inversión para tomar decisiones de rebalanceo o ajuste.

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El ROI (nominal o real, según ordenamiento) — la métrica principal
2. El nombre de la inversión — identificación
3. El capital invertido — contexto
4. El resultado absoluto — información complementaria
5. El tipo — clasificación secundaria

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 0px (la tabla tiene su propio padding)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: 8px
- Ancho: 100% (hasta el máximo de 1200px)

**Header de Card**

- Título: "RANKING DE INVERSIONES", 18px, peso 600, color `#000000`
- Acciones (derecha): Selector de ordenamiento
  - Opciones: "ROI Nominal" | "ROI Real" | "Capital" | "Resultado"
  - Diseño: 13px, peso 400, color `#666666`
  - Opción activa: 13px, peso 600, color `#000000`
  - Separador: `|`, color `#E5E5E5`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Tabla**

**Estructura:**

| Inversión | Tipo | Capital Invertido | Resultado | ROI Nominal | ROI Real |
|-----------|------|-------------------|------------|-------------|----------|

**Header de Tabla:**

- Altura: 48px
- Fondo: `#FAFAFA` (mismo que el fondo de página)
- Texto: 13px, peso 500, color `#666666`
- Text transform: uppercase
- Letter spacing: 0.5px
- Padding: 16px horizontal / 12px vertical
- Borde inferior: `1px solid #E5E5E5`
- Alineación: Izquierda (texto), Derecha (números)

**Columnas:**

1. **Inversión** (ancho: flexible, mínimo 200px)
   - Nombre de la inversión
   - Texto: 15px, peso 400, color `#000000`
   - Alineación: Izquierda

2. **Tipo** (ancho: 120px)
   - Clasificación (Acciones, Bonos, Fondo, etc.)
   - Texto: 13px, peso 400, color `#666666`
   - Alineación: Izquierda

3. **Capital Invertido** (ancho: 160px)
   - Monto invertido
   - Texto: 15px, peso 400, color `#000000`, monospace
   - Alineación: Derecha

4. **Resultado** (ancho: 140px)
   - Ganancia o pérdida absoluta
   - Texto: 15px, peso 400, color `#000000`, monospace
   - Signo: "+" o "-" antes del número
   - Alineación: Derecha

5. **ROI Nominal** (ancho: 120px)
   - Rendimiento porcentual nominal
   - Texto: 15px, peso 600, color `#000000`, monospace
   - Formato: "XX.X%"
   - Alineación: Derecha
   - **Esta columna se destaca cuando es el criterio de ordenamiento**

6. **ROI Real** (ancho: 120px)
   - Rendimiento porcentual ajustado por IPC
   - Texto: 15px, peso 400, color `#666666`, monospace
   - Formato: "XX.X%"
   - Alineación: Derecha
   - **Esta columna se destaca cuando es el criterio de ordenamiento**

**Filas:**

- Altura: 48px
- Fondo: `#FFFFFF` (blanco)
- Padding: 16px horizontal / 12px vertical
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas
- Espaciado entre filas: 0px

**Estados:**

- **Fila hover:** Fondo `#FAFAFA`
- **Columna ordenada:** El header y los valores de esa columna tienen peso 600
- **Sin selección:** No hay filas seleccionadas por defecto

**Interacción:**

- Click en header de columna: Ordena por esa columna
- Hover en fila: Indica que es clickeable (opcional)
- Click en fila (opcional): Navegación a detalle de inversión

**Por Qué Este Diseño:**

- Tabla minimalista sin grid visible, solo hover para feedback
- ROI destacado porque es la métrica más importante para comparar
- Monospace para números asegura alineación perfecta
- El ordenamiento es claro y accesible
- Mucho espacio horizontal (padding 16px) para respiración

**Limitaciones:**

- Máximo de filas visibles sin scroll: 8-10
- Scroll vertical suave si hay más inversiones
- Sin paginación (todo visible o con scroll)

---

## 5. Bloque Fondo Emma (Resumen Permanente)

### Propósito

Muestra el estado del fondo Emma, que es un objetivo de largo plazo. Está siempre visible en el dashboard como recordatorio constante.

### Por Qué Está Ahí

Emma es un objetivo específico y permanente. El usuario necesita ver el progreso constantemente para mantener la disciplina de aporte mensual.

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El porcentaje del objetivo — progreso visual inmediato
2. El capital actual — estado presente
3. La proyección a 18/25 años — visión futura
4. El aporte mensual — acción requerida

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: 8px
- Ancho: Flexible (grid de 2 columnas con Distribución)

**Header de Card**

- Título: "FONDO EMMA", 18px, peso 600, color `#000000`
- Subtítulo (opcional): "Objetivo a 18/25 años", 13px, peso 400, color `#666666`
- Sin acciones
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Contenido**

**Elemento 1: Progreso del Objetivo**

**Diseño:**
- Label: "PROGRESO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 36px, peso 600, color `#000000`, monospace
- Formato: "XX.X%"
- Espaciado entre label y valor: 8px
- Margen superior: 0px (primer elemento después del header)
- Margen inferior: 32px

**Indicador Visual (Opcional, Muy Sutil):**

- Barra de progreso mínima
- Altura: 4px
- Ancho: 100%
- Fondo: `#F5F5F5` (gris muy claro)
- Progreso: `#E5E5E5` (gris ligeramente más oscuro)
- Sin bordes redondeados (línea recta, minimalista)
- Margen superior: 8px

**Por Qué Este Diseño:**
- El porcentaje es lo más importante (36px, Display)
- La barra de progreso es opcional y muy sutil (solo si agrega claridad)
- El usuario entiende inmediatamente el progreso

**Elemento 2: Capital Actual**

**Diseño:**
- Label: "CAPITAL ACTUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Margen superior: 0px
- Margen inferior: 32px

**Por Qué Este Diseño:**
- Muestra el estado presente
- Tamaño 24px (Heading 1) porque es importante pero secundario al progreso

**Elemento 3: Proyección a 18/25 Años**

**Diseño:**
- Label: "PROYECCIÓN 18/25 AÑOS", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Margen superior: 0px
- Margen inferior: 32px

**Por Qué Este Diseño:**
- Muestra la visión futura
- Tamaño 20px (Heading 2) porque es información de contexto
- El horizonte dual (18/25) se explica en el label

**Elemento 4: Aporte Mensual**

**Diseño:**
- Label: "APORTE MENSUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Espaciado entre label y valor: 8px
- Margen superior: 0px
- Margen inferior: 0px (último elemento)

**Por Qué Este Diseño:**
- Indica la acción requerida (aporte mensual)
- Mismo tamaño que la proyección (misma jerarquía)
- Información práctica para el usuario

**Layout General:**

- Todos los elementos apilados verticalmente
- Espaciado consistente (32px entre elementos principales)
- Alineación: Izquierda
- Mucho espacio vertical para respiración

**Interacción:**

- Hover sobre card: Elevación ligeramente mayor (opcional)
- Click (opcional): Navegación a detalle del fondo Emma
- Sin cambios de color, solo elevación sutil

**Por Qué Este Diseño General:**

- Card compacta pero con mucho espacio interno
- Información esencial sin ruido
- El progreso es lo más visible (36px)
- El resto de la información es contextual pero importante

---

## 6. Bloque Alertas Silenciosas

### Propósito

Muestra alertas importantes pero de forma no intrusiva. Solo aparece cuando hay algo que el usuario debe saber.

### Por Qué Está Ahí

Las alertas son necesarias pero no deben interrumpir la experiencia. Este bloque solo aparece cuando aplica, y cuando aparece, es discreto.

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El contenido de la alerta — el mensaje
2. El tipo de alerta (si hay diferenciación visual) — contexto
3. La acción (si aplica) — qué hacer

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: 8px
- Ancho: 100% (hasta el máximo de 1200px)
- **Solo visible cuando hay alertas activas**

**Diseño de Alerta Individual**

**Layout:**

```
┌─────────────────────────────────────────┐
│ [Icono opcional]  Mensaje de alerta    │
│                    [Acción opcional]   │
└─────────────────────────────────────────┘
```

**Elementos:**

1. **Icono (Opcional)**
   - Tamaño: 16px
   - Color: `#666666` (gris medio)
   - Solo si agrega claridad
   - Margen derecho: 12px

2. **Mensaje**
   - Texto: 15px, peso 400, color `#000000`
   - Alineación: Izquierda
   - Ancho: Flexible

3. **Acción (Opcional)**
   - Link o botón texto
   - Texto: 15px, peso 400, color `#007AFF` (azul sistema)
   - Alineación: Derecha
   - Margen izquierdo: 16px

**Tipos de Alertas (Sin Diferenciación Visual Extrema):**

- **Informativa:** Sin color especial, solo el mensaje
- **Advertencia:** Sin color naranja, solo el mensaje (el contenido comunica la urgencia)
- **Error:** Sin color rojo, solo el mensaje (el contenido comunica la criticidad)

**Por Qué Este Diseño:**

- Minimalismo extremo: no se usa color para alertas
- El contenido del mensaje comunica la importancia
- No hay iconos llamativos ni colores de fondo
- Las alertas son silenciosas pero visibles

**Espaciado Entre Alertas:**

- Si hay múltiples alertas: 16px vertical entre cada una
- Las alertas se apilan verticalmente
- Sin separadores visuales (solo espacio)

**Estados:**

- **Visible:** Solo cuando hay alertas activas
- **Oculta:** No se muestra espacio reservado cuando no hay alertas
- **Dismissible (Opcional):** Botón "×" muy sutil, 16px, color `#999999`, hover `#000000`

**Ejemplos de Alertas:**

1. "Falta registrar un movimiento del mes pasado"
2. "Una inversión requiere atención"
3. "El aporte mensual a Emma no se ha realizado este mes"

**Por Qué Este Diseño General:**

- Las alertas no deben competir con el contenido principal
- Aparecen al final porque son importantes pero no urgentes (a menos que lo sean)
- El diseño es consistente con el resto del dashboard
- No hay ruido visual, solo información

---

## Flujo de Lectura del Dashboard

### Orden Natural de la Mirada

1. **Barra de Proyecciones** (fija, siempre visible)
   - El usuario ve primero las proyecciones porque están siempre visibles
   - Responde: "¿Voy bien hacia el futuro?"

2. **Estado Patrimonial** (primer bloque del contenido)
   - El usuario ve el estado actual
   - Responde: "¿Dónde estoy ahora?"

3. **Distribución del Patrimonio** (segundo bloque, izquierda)
   - El usuario entiende la composición
   - Responde: "¿Cómo está distribuido?"

4. **Fondo Emma** (segundo bloque, derecha)
   - El usuario ve el progreso del objetivo
   - Responde: "¿Cómo va Emma?"

5. **Ranking de Inversiones** (tercer bloque)
   - El usuario analiza el desempeño individual
   - Responde: "¿Qué inversiones van bien/mal?"

6. **Alertas** (último bloque, si aplica)
   - El usuario ve acciones pendientes
   - Responde: "¿Hay algo que debo hacer?"

### Tiempo de Lectura

- **Lectura rápida (5 segundos):** Barra de proyecciones + Patrimonio total
- **Lectura media (30 segundos):** Todo lo anterior + Distribución + Emma
- **Lectura completa (2-3 minutos):** Todo lo anterior + Ranking completo + Alertas

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 2 columnas para Distribución/Emma
- Todo el contenido visible con scroll vertical

### Large Desktop (1920px+)

- Mismo diseño, más espacio lateral
- El contenido se centra (máximo 1200px)
- Más espacio respirable

### Tablet (1024px - 1439px)

- Grid de 2 columnas se convierte en 1 columna
- Las cards se apilan verticalmente
- El espaciado se mantiene
- La barra de proyecciones puede requerir scroll horizontal

---

## Estados Vacíos y Carga

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Vacío (Primera Vez)

- Mensaje discreto: "Comienza agregando tu primera inversión"
- Sin ilustraciones ni gráficos
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] La barra de proyecciones está siempre visible (fixed)
- [ ] El patrimonio total es el número más grande (48px)
- [ ] No hay colores innecesarios (solo grises y azul sistema)
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Las cards tienen sombra sutil y bordes redondeados
- [ ] Las tablas no tienen grid visible
- [ ] El hover es sutil (150ms ease)
- [ ] No hay animaciones llamativas
- [ ] Todo es legible y respirable

---

**Última actualización**: Diseño completo del Dashboard Principal
**Versión**: 1.0
**Estado**: Completo y listo para referencia de implementación

---

## UX REVIEW — DASHBOARD

### Auditoría Crítica Pre-Producción

Esta revisión analiza el dashboard con mentalidad Apple macOS: menos es más, claridad sobre información, decisión sobre dato.

---

### QUÉ FUNCIONA

**1. Barra de Proyecciones como Eje Rector**
- ✅ Correcto: Está fija, siempre visible, es el elemento más importante
- ✅ Correcto: Los selectores de escenario y horizonte son discretos pero accesibles
- ✅ Correcto: El valor proyectado nominal es el más grande (24px)
- ✅ Correcto: La jerarquía visual es clara: primero el valor, luego el contexto

**2. Jerarquía Tipográfica**
- ✅ Correcto: Patrimonio Total a 48px es el número más importante
- ✅ Correcto: La escala tipográfica establece claramente la importancia
- ✅ Correcto: Monospace para números asegura legibilidad perfecta

**3. Minimalismo Visual**
- ✅ Correcto: Sin colores innecesarios (solo grises y azul sistema)
- ✅ Correcto: Sin gráficos ruidosos
- ✅ Correcto: Cards flotantes con sombra sutil
- ✅ Correcto: Mucho espacio respirable entre elementos

**4. Flujo de Lectura**
- ✅ Correcto: El orden natural (proyecciones → patrimonio → distribución → ranking) es lógico
- ✅ Correcto: La lectura rápida (5 segundos) captura lo esencial

---

### QUÉ SOBRA

**1. Barra de Proyecciones — Redundancia de Valores**

**Problema:**
- Mostrar tanto "Proyección Nominal" como "Proyección Real" en la barra fija es redundante
- El usuario no necesita ambos valores constantemente visibles
- Ocupa espacio valioso en la barra más importante

**Recomendación:**
- **Eliminar "Proyección Real" de la barra fija**
- Mostrar solo "Proyección Nominal" (el valor principal)
- El valor real puede estar disponible en un tooltip al hover, o en la pantalla de proyecciones detalladas
- **Justificación:** La barra debe mostrar UNA cosa: hacia dónde va el patrimonio. El ajuste por IPC es información secundaria que se consulta ocasionalmente, no constantemente.

**2. Estado Patrimonial — Sobreinformación**

**Problema:**
- 6 métricas en un grid 3x2 es demasiada información para una lectura rápida
- "Variación Real" es redundante si ya hay "Resultado Anual"
- "Capital Invertido" se repite en "Distribución del Patrimonio"
- El usuario no necesita ver todo esto de una vez

**Recomendación:**
- **Reducir a 4 métricas esenciales:**
  1. Patrimonio Total (48px) — arriba izquierda, más espacio
  2. Resultado Mensual (28px) — arriba derecha
  3. Resultado Anual (28px) — abajo izquierda
  4. Liquidez (20px) — abajo derecha
- **Eliminar:**
  - Capital Invertido (está en Distribución)
  - Variación Real (es redundante con Resultado Anual, y el ajuste por IPC no es crítico en el dashboard diario)
- **Justificación:** El dashboard debe responder "¿Cuánto tengo? ¿Cómo va este mes? ¿Cómo va este año? ¿Cuánto tengo disponible?" Todo lo demás es detalle que se consulta cuando se necesita.

**3. Distribución del Patrimonio — Categoría Conceptual**

**Problema:**
- La categoría "Riesgo" es demasiado conceptual y vaga
- No comunica información accionable
- El usuario no sabe qué hacer con esa información

**Recomendación:**
- **Eliminar "Riesgo" de la lista**
- Mantener solo: Productivo, Pasivo, Liquidez, Largo Plazo
- **Justificación:** Si el riesgo no es medible y accionable, no debe estar en el dashboard. El usuario necesita información clara, no conceptos abstractos.

**4. Ranking de Inversiones — Demasiadas Columnas**

**Problema:**
- 6 columnas es demasiada información horizontal
- "Tipo" es información secundaria que no ayuda a tomar decisiones
- "Resultado" absoluto es redundante si ya hay ROI
- Mostrar tanto ROI Nominal como Real siempre es sobrecarga

**Recomendación:**
- **Reducir a 4 columnas esenciales:**
  1. Inversión (nombre)
  2. Capital Invertido
  3. ROI (nominal o real, según el ordenamiento activo)
  4. Resultado (opcional, solo si agrega valor)
- **Eliminar:**
  - Tipo (información secundaria, no crítica para decisiones)
  - ROI Real cuando se ordena por Nominal (y viceversa) — solo mostrar el ROI activo
- **Justificación:** El ranking debe responder "¿Qué inversión rinde más?" No necesita mostrar toda la información disponible. El detalle está en la pantalla de inversión individual.

**5. Fondo Emma — Información Redundante**

**Problema:**
- "Proyección a 18/25 años" es información que ya está en la barra de proyecciones (si se configura el horizonte)
- "Aporte mensual" es información de configuración, no de estado
- Demasiados elementos para un resumen permanente

**Recomendación:**
- **Reducir a 2 elementos esenciales:**
  1. Progreso del Objetivo (36px) — lo más importante
  2. Capital Actual (24px) — estado presente
- **Eliminar:**
  - Proyección a 18/25 años (ya está en la barra de proyecciones)
  - Aporte mensual (es configuración, no estado del dashboard)
- **Justificación:** El resumen permanente debe mostrar solo el progreso y el estado actual. El resto es detalle que se consulta en la pantalla específica de Emma.

---

### QUÉ SE PUEDE SIMPLIFICAR

**1. Barra de Proyecciones — Selectores**

**Simplificación:**
- Los selectores de escenario y horizonte podrían estar más integrados
- Actualmente ocupan mucho espacio horizontal

**Recomendación:**
- **Combinar selectores en una sola línea compacta:**
  - Formato: "Base · 10 años" (con el separador como punto medio)
  - Click abre un menú discreto con todas las opciones
  - Reduce el espacio ocupado y mantiene la funcionalidad
- **Alternativa más radical:**
  - Eliminar los selectores de la barra fija
  - Moverlos a un menú discreto (icono de configuración)
  - La barra muestra solo el valor proyectado (más limpia)
  - El usuario cambia escenario/horizonte cuando lo necesita, no constantemente

**2. Estado Patrimonial — Layout**

**Simplificación:**
- El grid 3x2 (o 2x2 después de la reducción) podría ser más simple

**Recomendación:**
- **Layout vertical simple:**
  - Patrimonio Total (48px) — arriba, ancho completo
  - Resultado Mensual y Anual (28px cada uno) — lado a lado, debajo
  - Liquidez (20px) — debajo, ancho completo o alineado a la derecha
- **Justificación:** Layout más simple = menos decisiones visuales = más claridad

**3. Distribución del Patrimonio — Presentación**

**Simplificación:**
- La lista vertical con valores y porcentajes es clara, pero podría ser más compacta

**Recomendación:**
- **Mantener la lista vertical** (es la forma más legible)
- **Considerar eliminar los porcentajes** si no son críticos
- Si los porcentajes son necesarios, hacerlos más sutiles (11px, color `#999999`)
- **Justificación:** Los valores absolutos son más importantes que los porcentajes. Los porcentajes pueden ser información secundaria muy sutil o eliminarse.

---

### QUÉ ES CLAVE Y NO DEBE TOCARSE

**1. Barra de Proyecciones como Eje Rector**
- ✅ **NO TOCAR:** Debe estar fija, siempre visible
- ✅ **NO TOCAR:** El valor proyectado debe ser el elemento más prominente
- ✅ **NO TOCAR:** Debe estar debajo del header, antes de todo el contenido

**2. Patrimonio Total como Número Principal**
- ✅ **NO TOCAR:** Debe ser 48px, el número más grande del dashboard
- ✅ **NO TOCAR:** Debe estar en la posición de mayor jerarquía (arriba izquierda o arriba completo)
- ✅ **NO TOCAR:** Monospace para legibilidad perfecta

**3. Minimalismo Visual**
- ✅ **NO TOCAR:** Sin colores innecesarios
- ✅ **NO TOCAR:** Sin gráficos ruidosos
- ✅ **NO TOCAR:** Cards flotantes con sombra sutil
- ✅ **NO TOCAR:** Mucho espacio respirable

**4. Jerarquía por Tipografía**
- ✅ **NO TOCAR:** La escala tipográfica establece la jerarquía
- ✅ **NO TOCAR:** No usar color para crear jerarquía (excepto azul sistema para interacción)

**5. Flujo de Lectura Natural**
- ✅ **NO TOCAR:** Proyecciones → Patrimonio → Distribución → Ranking → Alertas
- ✅ **NO TOCAR:** La lectura rápida (5 segundos) debe capturar lo esencial

---

### RECOMENDACIONES CONCRETAS

**Prioridad Alta (Implementar Antes de Producción):**

1. **Simplificar Barra de Proyecciones**
   - Eliminar "Proyección Real" de la barra fija
   - Mostrar solo "Proyección Nominal" (valor principal)
   - El valor real disponible en tooltip o pantalla detallada

2. **Reducir Estado Patrimonial a 4 Métricas**
   - Patrimonio Total (48px)
   - Resultado Mensual (28px)
   - Resultado Anual (28px)
   - Liquidez (20px)
   - Eliminar Capital Invertido y Variación Real

3. **Simplificar Ranking de Inversiones**
   - Reducir a 4 columnas: Inversión, Capital, ROI (activo), Resultado
   - Eliminar Tipo y ROI redundante
   - Solo mostrar el ROI del ordenamiento activo

4. **Simplificar Fondo Emma**
   - Solo Progreso (36px) y Capital Actual (24px)
   - Eliminar Proyección y Aporte Mensual

**Prioridad Media (Considerar para Mejora Continua):**

5. **Eliminar "Riesgo" de Distribución**
   - Mantener solo categorías accionables: Productivo, Pasivo, Liquidez, Largo Plazo

6. **Simplificar Selectores de Barra de Proyecciones**
   - Combinar en formato compacto o mover a menú discreto
   - Reducir espacio ocupado en la barra

7. **Considerar Eliminar Porcentajes de Distribución**
   - Si no son críticos, eliminarlos o hacerlos extremadamente sutiles
   - Los valores absolutos son más importantes

**Prioridad Baja (Opcional, Mejoras Futuras):**

8. **Layout Vertical para Estado Patrimonial**
   - Simplificar el grid a layout vertical más simple
   - Menos decisiones visuales = más claridad

---

### PRINCIPIOS APLICADOS

**Menos es Más**
- Eliminar información redundante
- Mostrar solo lo esencial para decisiones diarias
- El detalle está en las pantallas específicas

**Claridad > Información**
- Reducir métricas para aumentar claridad
- Una métrica clara es mejor que dos confusas
- El usuario debe entender inmediatamente, no analizar

**Decisión > Dato**
- Cada elemento debe ayudar a tomar una decisión
- Si no ayuda a decidir, no debe estar en el dashboard
- Información de contexto va en pantallas detalladas

**Barra de Proyecciones como Eje Rector**
- Confirmado: Es el elemento más importante
- Debe estar siempre visible
- Debe mostrar solo lo esencial (valor proyectado principal)

---

### RESULTADO ESPERADO POST-OPTIMIZACIÓN

**Antes:**
- 6 métricas en Estado Patrimonial
- 2 valores en Barra de Proyecciones
- 6 columnas en Ranking
- 4 elementos en Fondo Emma
- 5 categorías en Distribución

**Después:**
- 4 métricas en Estado Patrimonial (33% menos)
- 1 valor en Barra de Proyecciones (50% menos)
- 4 columnas en Ranking (33% menos)
- 2 elementos en Fondo Emma (50% menos)
- 4 categorías en Distribución (20% menos)

**Impacto:**
- Dashboard más limpio y legible
- Menos decisiones visuales = más claridad
- Lectura rápida más efectiva (menos de 5 segundos)
- El usuario se enfoca en lo esencial
- Información detallada disponible cuando se necesita (pantallas específicas)

---

---

## Integración con Vida Mensual

### Bloque "Costo de Vida" (Nuevo)

**Propósito**

Muestra el costo de vida real basado en Vida Mensual. Permite entender cuántos meses de vida cubre el patrimonio actual.

**Por Qué Está Ahí**

El usuario necesita entender su patrimonio en términos de vida mensual. Esta integración responde: "¿Cuántos meses de vida tengo? ¿Cuál es mi gasto mensual promedio?"

**Jerarquía Visual**

**Qué Mira el Ojo Primero:**
1. El gasto mensual promedio — referencia de costo de vida
2. El % de vida cubierta — cuántos meses tengo
3. La tendencia — ¿aumenta o disminuye el costo de vida?

**Diseño Detallado**

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Layout Grid 3 Columnas**

```
┌──────────────┬──────────────┬──────────────┐
│ GASTO MENSUAL│ % VIDA       │ TENDENCIA    │
│ PROMEDIO     │ CUBIERTA     │              │
└──────────────┴──────────────┴──────────────┘
```

**Elemento 1: Gasto Mensual Promedio**

- Label: "GASTO MENSUAL PROMEDIO", 11px, peso 450, color `#999999`, uppercase
- Valor: 24px, peso 600, monospace, color `#000000`, letter-spacing -0.025em
- Período: "Últimos 12 meses", 11px, peso 450, color `#666666`
- Alineación: Centro

**Elemento 2: % de Vida Cubierta**

- Label: "MESES DE VIDA", 11px, peso 450, color `#999999`, uppercase
- Valor: 24px, peso 600, monospace, color `#000000`, letter-spacing -0.025em
- Cálculo: Patrimonio total / Gasto mensual promedio
- Alineación: Centro

**Elemento 3: Tendencia**

- Label: "TENDENCIA", 11px, peso 450, color `#999999`, uppercase
- Indicador: Flecha sutil ↑ ↓ =, 20px, peso 600
- Descripción: "vs mes anterior", 11px, peso 450, color `#666666`
- Alineación: Centro

**Posición en Dashboard**

- Se agrega después de "Estado Patrimonial"
- Antes de "Distribución del Patrimonio"
- Espaciado: 64px entre bloques

**Por Qué Este Diseño:**

- Grid 3 columnas permite comparación inmediata
- Información esencial sin ruido
- Integración conceptual, no duplicación
- Visual consistente con el sistema

---

**Última actualización**: UX Review — Dashboard Principal + Integración Vida Mensual
**Versión**: 1.2
**Estado**: Auditoría completa + Integración conceptual lista

