# Bitácora
## Pulley Group — Memoria Patrimonial de Decisiones

---

## Visión General

La pantalla de Bitácora registra todas las decisiones patrimoniales tomadas por el usuario. Es una memoria que permite revisar el contexto, motivos y resultados esperados de cada decisión, facilitando el aprendizaje y la coherencia estratégica.

**Filosofía de Uso**
- Registro de decisiones patrimoniales (memoria institucional)
- Revisión de contexto y motivos (aprendizaje)
- Toma de decisiones informadas (coherencia estratégica)
- Sensación de control sobre el historial

**Paradigma de Eventos Patrimoniales**
- Cada decisión genera EVENTOS patrimoniales
- La Bitácora conecta decisión + eventos + impacto
- Los eventos quedan registrados para siempre
- El historial explica la evolución del patrimonio

**Estructura Visual**
- Header fijo (64px)
- Contenido principal con scroll vertical
- Cards limpias con información clara
- Lista cronológica ordenada
- Sin texto emocional, solo información objetiva

---

## Layout General

### Estructura de la Página

```
┌─────────────────────────────────────────┐
│ HEADER (64px, fixed)                   │
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
│  │ FILTROS (opcional)               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ENTRADA BITÁCORA 1               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ENTRADA BITÁCORA 2               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ENTRADA BITÁCORA 3               │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Elementos

- Entre encabezado y filtros: **32px**
- Entre filtros y primera entrada: **32px**
- Entre entradas de bitácora: **24px**
- Bottom padding del contenido: **64px**

---

## 1. Encabezado de la Pantalla

### Propósito

Establece el contexto de la Bitácora como memoria patrimonial. Título claro y subtítulo conceptual que explica el propósito.

### Por Qué Está Ahí

El usuario necesita entender que esta es una memoria de decisiones, no solo un registro. El encabezado responde: "¿Qué es la Bitácora? ¿Para qué sirve?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Bitácora" — identificación inmediata
2. El subtítulo conceptual — explicación del propósito

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después del header)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título**

- Texto: "Bitácora", 28px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante del encabezado**

**Subtítulo Conceptual**

- Texto: "Memoria patrimonial de decisiones tomadas", 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Explica el concepto sin tecnicismos ni emocionalidad**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Subtítulo conceptual, no técnico
- Enfatiza "memoria" y "decisiones"
- Sin texto emocional, solo información clara
- Mucho espacio respirable

---

## 2. Vista Cronológica

### Propósito

Muestra todas las decisiones en orden cronológico. Permite revisar el historial completo de decisiones patrimoniales.

### Por Qué Está Ahí

El usuario necesita ver el historial de decisiones en orden temporal. Esta vista responde: "¿Qué decisiones he tomado? ¿Cuándo las tomé? ¿En qué orden?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La fecha — contexto temporal
2. El tipo de decisión — clasificación
3. La inversión asociada — contexto específico
4. El impacto esperado — resultado conceptual

### Qué Decisión Habilita

- **Decisión:** ¿Qué decisiones he tomado en el pasado? ¿Cuál fue el contexto?
- **Información clave:** El historial ayuda a entender patrones y coherencia estratégica
- **Contexto:** La cronología muestra la evolución de las decisiones

### Diseño Detallado

**Card de Entrada de Bitácora**

**Características:**
- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)
- Hover: Elevación ligeramente mayor (sombra más pronunciada)
- Cursor: pointer (indica que es clickeable)

**Layout Interno**

Grid de 2 columnas (conceptual):

```
┌──────────────────────────┬──────────────────────────┐
│ FECHA + TIPO (izquierda) │ INVERSIÓN + IMPACTO      │
│                          │ (derecha)                │
└──────────────────────────┴──────────────────────────┘
```

**Columna Izquierda: Fecha y Tipo**

**Elemento 1: Fecha**
- Texto: 13px, peso 400, color `#666666`
- Formato: "DD/MM/YYYY" o "DD de MM de YYYY"
- Alineación: Izquierda
- Margen inferior: 8px
- **Contexto temporal**

**Elemento 2: Tipo de Decisión**
- Texto: 18px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 0px
- **Es el elemento más importante para identificación**

**Columna Derecha: Inversión e Impacto**

**Elemento 3: Inversión Asociada (si aplica)**
- Label: "Inversión", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 15px, peso 400, color `#007AFF` (azul sistema), link clickeable
- Hover: Color `#0051D5`
- Alineación: Derecha
- Margen inferior: 8px
- **Link a vista detalle de inversión**

**Elemento 4: Impacto Esperado (Conceptual)**
- Label: "IMPACTO ESPERADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 13px, peso 400, color `#666666`
- Descripción breve y conceptual (ej: "Aumento de exposición a renta variable")
- Alineación: Derecha
- Margen inferior: 0px
- **Información conceptual, no numérica exacta**

**Layout Responsive**

- En pantallas menores, el grid se convierte en 1 columna
- Fecha y tipo arriba, inversión e impacto abajo
- Mismo espaciado vertical (24px entre elementos)

**Interacción**

- Hover: Elevación aumentada (sombra más pronunciada)
- Click: Navegación a vista detalle de la decisión
- Transición: 150ms ease

**Por Qué Este Diseño:**

- Cards limpias y comparables
- Información esencial sin ruido
- Fecha y tipo destacados para identificación
- Link a inversión para contexto
- Impacto esperado conceptual, no numérico

---

## 3. Tipos de Decisión

### Propósito

Clasifica las decisiones en categorías claras. Permite filtrar y entender el tipo de acción tomada.

### Por Qué Está Ahí

El usuario necesita entender qué tipo de decisión tomó. Esta clasificación responde: "¿Qué tipo de acción fue? ¿Cómo se clasifica?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El tipo de decisión en la card — identificación inmediata
2. Los filtros (si aplican) — herramientas de organización

### Qué Decisión Habilita

- **Decisión:** ¿Qué tipos de decisiones he tomado más? ¿Hay patrones en mis decisiones?
- **Información clave:** La clasificación ayuda a entender la estrategia general
- **Contexto:** Los tipos muestran la diversidad de acciones tomadas

### Diseño Detallado

**Tipos de Decisión Documentados:**

1. **Inversión**
   - Nueva inversión realizada
   - Apertura de posición en un activo
   - Texto en card: "INVERSIÓN"

2. **Desinversión**
   - Cierre de inversión
   - Venta de activo
   - Texto en card: "DESINVERSIÓN"

3. **Aumento de Aporte**
   - Incremento de capital en inversión existente
   - Texto en card: "AUMENTO DE APORTE"

4. **Pausa**
   - Suspensión temporal de aportes o actividad
   - Texto en card: "PAUSA"

5. **Rebalanceo**
   - Ajuste de distribución de cartera
   - Reasignación de capital
   - Texto en card: "REBALANCEO"

6. **Otros (Conceptual)**
   - Decisiones que no encajan en categorías anteriores
   - Texto en card: "OTRA DECISIÓN"

**Diseño Visual de Tipo en Card**

- Texto: 18px, peso 600, color `#000000`
- Sin iconos ni colores diferenciadores
- Solo tipografía para mantener minimalismo
- El contexto (título de la card) comunica el tipo

**Filtros por Tipo (Opcional)**

Si se incluyen filtros:

**Card Contenedora de Filtros**

- Tipo: Card Simple
- Padding: 16px (vertical) / 24px (horizontal) — más compacta
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Layout Horizontal**

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ TODAS    │ INVERSIÓN│ DESINV.  │ APORTE   │ REBAL.   │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Cada Filtro:**

- Texto: 13px, peso 400, color `#666666`
- Texto activo: 13px, peso 600, color `#000000`
- Hover: Color `#000000`
- Padding: 8px vertical / 16px horizontal
- Separador: `|` (pipe), 13px, color `#E5E5E5`, padding horizontal 8px

**Por Qué Este Diseño:**

- Tipos claros y objetivos
- Sin diferenciación visual extrema (solo tipografía)
- Filtros discretos pero accesibles
- Consistencia con el lenguaje visual

---

## 4. Vista Detalle de Decisión

### Propósito

Muestra toda la información de una decisión específica: motivo, contexto, alternativas consideradas y resultado esperado.

### Por Qué Está Ahí

El usuario necesita entender por qué tomó una decisión y qué esperaba lograr. Esta vista responde: "¿Por qué tomé esta decisión? ¿Qué contexto había? ¿Qué alternativas consideré?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El tipo de decisión y fecha — identificación
2. El motivo — razón principal
3. El contexto — situación que llevó a la decisión
4. Las alternativas — opciones consideradas
5. El resultado esperado — objetivo

### Qué Decisión Habilita

- **Decisión:** ¿Fue una buena decisión? ¿Qué aprendí? ¿Debo tomar decisiones similares?
- **Información clave:** El motivo y contexto ayudan a evaluar la decisión
- **Contexto:** Las alternativas muestran el proceso de decisión

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Decisión**

- Título: Tipo de decisión (ej: "INVERSIÓN"), 24px, peso 600, color `#000000`
- Fecha: 13px, peso 400, color `#666666`
- Layout: Flexbox horizontal (título izquierda, fecha derecha)
- Margen inferior: 32px

**Sección 1: Motivo**

- Título: "MOTIVO", 15px, peso 500, color `#000000`
- Contenido: 15px, peso 400, color `#000000`
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 32px
- **Razón principal de la decisión**

**Sección 2: Contexto**

- Título: "CONTEXTO", 15px, peso 500, color `#000000`
- Contenido: 15px, peso 400, color `#000000`
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 32px
- **Situación que llevó a la decisión**

**Sección 3: Alternativas Consideradas**

- Título: "ALTERNATIVAS CONSIDERADAS", 15px, peso 500, color `#000000`
- Lista de alternativas:
  - Cada alternativa: 15px, peso 400, color `#000000`
  - Bullet: `·` (punto medio), 15px, color `#666666`
  - Espaciado: 8px entre alternativas
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 32px
- **Opciones que se evaluaron**

**Sección 4: Resultado Esperado**

- Título: "RESULTADO ESPERADO", 15px, peso 500, color `#000000`
- Contenido: 15px, peso 400, color `#000000`
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 0px
- **Objetivo de la decisión**

**Link a Inversión (Si Aplica)**

- Texto: "Ver inversión →", 13px, peso 400, color `#007AFF` (azul sistema)
- Alineación: Derecha
- Hover: Color `#0051D5`
- Click: Navegación a vista detalle de inversión
- Margen superior: 32px

**Por Qué Este Diseño:**

- Información completa pero organizada
- Secciones claras y legibles
- Sin texto emocional, solo información objetiva
- Link a inversión para contexto adicional

---

## 5. Relación con el Sistema

### Propósito

Establece la navegación bidireccional entre la Bitácora y las inversiones. Permite ir desde una inversión a sus decisiones y viceversa.

### Por Qué Está Ahí

El usuario necesita ver las decisiones relacionadas con una inversión específica, y también ver la inversión desde una decisión. Esta relación responde: "¿Qué decisiones he tomado sobre esta inversión? ¿A qué inversión se refiere esta decisión?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El link a inversión en la card de bitácora — navegación directa
2. El link a bitácora en la vista de inversión — acceso al historial

### Qué Decisión Habilita

- **Decisión:** ¿Qué decisiones he tomado sobre esta inversión? ¿Cuál fue el contexto de cada una?
- **Información clave:** El historial de decisiones ayuda a entender la evolución de una inversión
- **Contexto:** La relación bidireccional facilita el análisis completo

### Diseño Detallado

**Desde Bitácora hacia Inversión**

**En Card de Entrada:**
- Link: Nombre de inversión, 15px, peso 400, color `#007AFF` (azul sistema)
- Hover: Color `#0051D5`
- Click: Navegación a vista detalle de inversión
- Posición: Columna derecha, arriba

**En Vista Detalle de Decisión:**
- Link: "Ver inversión →", 13px, peso 400, color `#007AFF`
- Hover: Color `#0051D5`
- Click: Navegación a vista detalle de inversión
- Posición: Abajo, alineado a la derecha

**Desde Inversión hacia Bitácora**

**En Vista Detalle de Inversión (Pestaña "Notas / Decisiones"):**
- Link: "Ver en Bitácora →", 13px, peso 400, color `#007AFF`
- Hover: Color `#0051D5`
- Click: Navegación a Bitácora filtrada por esa inversión
- Posición: En la pestaña de Notas/Decisiones

**Filtro Automático**

- Al llegar desde una inversión, la Bitácora se filtra automáticamente por esa inversión
- El filtro se muestra activo en la card de filtros
- El usuario puede quitar el filtro para ver todas las decisiones

**Breadcrumb (Opcional)**

- Si se implementa breadcrumb:
  - Formato: "Bitácora > [Tipo de Decisión] > [Inversión]"
  - Texto: 13px, peso 400, color `#666666`
  - Links: Color `#007AFF`, hover `#0051D5`
  - Posición: Debajo del encabezado

**Por Qué Este Diseño:**

- Navegación bidireccional clara y accesible
- Links discretos pero visibles
- Filtro automático facilita el contexto
- Consistencia visual con el resto del sistema

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Encabezado** (título y subtítulo)
   - El usuario entiende el propósito de la Bitácora
   - Responde: "¿Qué es la Bitácora?"

2. **Filtros** (si aplican)
   - El usuario ajusta la vista
   - Responde: "¿Qué decisiones quiero ver?"

3. **Entradas de Bitácora** (lista cronológica)
   - El usuario revisa el historial
   - Responde: "¿Qué decisiones he tomado?"

4. **Vista Detalle** (al hacer click)
   - El usuario profundiza en una decisión
   - Responde: "¿Por qué tomé esta decisión?"

### Tiempo de Lectura

- **Lectura rápida (10 segundos):** Encabezado + Primera entrada
- **Lectura media (2 minutos):** Todo lo anterior + Revisión de varias entradas
- **Lectura completa (5-10 minutos):** Todo lo anterior + Detalle de decisiones relevantes

---

## Estados Vacíos y Carga

### Estado Vacío (Sin Decisiones)

- Mensaje: "No hay decisiones registradas"
- Subtítulo: "Las decisiones que tomes sobre tus inversiones aparecerán aquí"
- Botón: "Agregar decisión" (botón primario, opcional)
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Decisiones en Filtro

- Mensaje discreto: "No hay decisiones de este tipo"
- Tipografía: 13px, peso 400, color `#999999`
- Centrado en el área de contenido

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 2 columnas en cards de entrada
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

- [ ] El encabezado es conceptual (memoria de decisiones)
- [ ] La vista cronológica muestra fecha, tipo, inversión e impacto
- [ ] Los tipos de decisión están claramente definidos
- [ ] La vista detalle muestra motivo, contexto, alternativas y resultado
- [ ] La relación bidireccional con inversiones funciona
- [ ] No hay texto emocional, solo información objetiva
- [ ] No hay redundancia con otras pantallas
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable
- [ ] Las cards tienen sombra sutil y bordes redondeados
- [ ] Los links son discretos pero accesibles

---

---

## 6. Conexión con Eventos Patrimoniales

### Propósito

Cada decisión en la Bitácora puede generar EVENTOS patrimoniales. La Bitácora conecta la decisión con los eventos resultantes y su impacto.

### Por Qué Está Ahí

El usuario necesita entender cómo sus decisiones se traducen en eventos reales. Esta funcionalidad responde: "¿Qué eventos generó esta decisión? ¿Cuál fue el impacto?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La decisión — qué se decidió
2. Los eventos generados — qué ocurrió
3. El impacto — cómo afectó

### Qué Decisión Habilita

- **Decisión:** ¿Qué eventos generó esta decisión? ¿Cuál fue el impacto real?
- **Información clave:** La conexión decisión-evento-impacto permite entender la evolución
- **Contexto:** Los eventos explican cómo las decisiones se materializan

### Diseño Detallado

**En Vista Detalle de Decisión:**

**Nueva Sección: "Eventos Generados" (Opcional):**

**Card Contenedora:**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: Translúcido con blur
- Bordes redondeados: 24px

**Header de Card:**

- Título: "EVENTOS GENERADOS", 18px, peso 550, color `#000000`
- Subtítulo: "Eventos patrimoniales resultantes de esta decisión", 13px, peso 450, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`
- Margen inferior: 0px

**Lista de Eventos:**

**Cada Evento:**

- Layout horizontal:
  - Fecha (izquierda)
  - Tipo y monto (centro)
  - Link a detalle (derecha)

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
   - Tipo: 15px, peso 500, color `#000000`
   - Monto: 18px, peso 600, monospace, color `#000000`, letter-spacing -0.02em

3. **Link a Detalle** (ancho: 100px)
   - Texto: "Ver evento →", 13px, peso 500, color `#007AFF`
   - Click: Navegación a detalle del evento (si aplica)
   - Alineación: Derecha

**Estado Vacío:**

- Mensaje: "Esta decisión no generó eventos patrimoniales"
- Subtítulo: "O los eventos aún no han sido registrados"
- Tipografía: 15px, peso 450, color `#666666`
- Centrado en el área de contenido

**Registro Automático (Opcional):**

- Al crear un evento desde otra pantalla (ej: Inversiones, Fondo Emma)
- Si el usuario indica que es resultado de una decisión
- El evento se vincula automáticamente a la decisión en la Bitácora
- Aparece en la sección "Eventos Generados"

**Por Qué Este Diseño:**

- Conexión clara entre decisión y eventos
- Navegación a eventos relacionados
- Registro automático opcional
- Sin duplicación, solo conexión

---

**Última actualización**: Diseño completo de Bitácora + Conexión con Eventos
**Versión**: 1.1
**Estado**: Completo y listo para referencia de implementación

