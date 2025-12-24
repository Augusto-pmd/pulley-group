# Visual Language
## Pulley Group — Sistema de Diseño 2025

---

## Filosofía Visual

### Principios Fundamentales

**1. Minimalismo Extremo**
- Cada elemento debe justificar su existencia
- Eliminación de decoración innecesaria
- La información es la decoración
- Nada distrae del contenido

**2. Aire y Respiración**
- El espacio negativo es un elemento de diseño activo
- Los elementos no se tocan entre sí innecesariamente
- El ojo necesita descanso entre secciones
- La densidad de información es baja por defecto

**3. Jerarquía por Tipografía**
- El tamaño y peso de la fuente establecen la jerarquía
- No se usa color para crear jerarquía (excepto casos específicos)
- La posición en el espacio también establece jerarquía
- Los elementos más importantes son más grandes y más pesados

**4. Claridad sobre Estilo**
- La legibilidad es absoluta
- No hay ambigüedad en la comunicación
- Cada elemento tiene un propósito claro
- La funcionalidad dicta la forma

**5. Discreción y Elegancia**
- Nada llama la atención innecesariamente
- Los elementos interactivos son sutiles hasta la interacción
- El diseño no compite con el contenido
- La sofisticación está en la ausencia, no en la presencia

---

## Principios Visuales 2025

### 1. Profundidad

**Filosofía**
- La interfaz existe en un espacio tridimensional sutil
- Los elementos flotan en capas, no se aplanan
- La profundidad comunica jerarquía y relación
- No es 3D exagerado, es profundidad perceptual

**Aplicación**
- Cards flotan sobre el fondo con sombras suaves y blur
- La barra superior flota sobre el contenido
- Los elementos interactivos se elevan sutilmente
- La profundidad se logra con blur, sombras y translucidez, no con efectos 3D

**Niveles de Profundidad**
- **Nivel 0 (Fondo)**: Gradiente orgánico, blobs flotantes
- **Nivel 1 (Contenido)**: Cards con blur sutil y sombra suave
- **Nivel 2 (Interactivos)**: Elementos hover con elevación aumentada
- **Nivel 3 (Fijos)**: Barra superior y proyecciones con blur translúcido

### 2. Materialidad (Glass, Blur, Light)

**Glassmorphism Avanzado**
- Fondo translúcido con blur: `backdrop-filter: blur(40px)`
- Opacidad de fondo: `rgba(255, 255, 255, 0.7)` (cards claras)
- Opacidad de fondo oscuro: `rgba(0, 0, 0, 0.3)` (solo si es necesario)
- Borde sutil: `1px solid rgba(255, 255, 255, 0.2)` (solo en elementos flotantes)

**Blur**
- **Blur de fondo (cards)**: 40px (sutil, no exagerado)
- **Blur de barra superior**: 60px (más pronunciado para flotación)
- **Blur de overlay**: 80px (solo en modales, si aplican)
- **Sin blur en texto**: El texto siempre es nítido y legible

**Light**
- Iluminación sutil desde arriba (no direccional exagerada)
- Resaltes sutiles en bordes superiores de cards
- Sin sombras duras, solo sombras suaves y difusas
- La luz sugiere profundidad, no la crea artificialmente

### 3. Movimiento

**Filosofía**
- El movimiento es orgánico y natural
- Nada se mueve sin propósito
- El movimiento guía la atención, no la distrae
- La velocidad es lenta y deliberada

**Aplicación**
- Transiciones suaves en todos los cambios de estado
- Movimiento parallax sutil en scroll (muy sutil, casi imperceptible)
- Animaciones de entrada con fade y ligera elevación
- El movimiento nunca es brusco o mecánico

### 4. Ritmo Visual

**Filosofía**
- El ritmo visual crea una experiencia fluida
- Los elementos respiran al unísono
- La repetición crea coherencia
- El ritmo es lento y contemplativo

**Aplicación**
- Espaciado consistente crea ritmo vertical
- Las cards aparecen con un ligero stagger (50ms entre cada una)
- El scroll tiene un ritmo suave y predecible
- Los elementos se mueven en sincronía, no de forma caótica

### 5. Uso del Vacío

**Filosofía**
- El vacío es tan importante como el contenido
- El espacio negativo permite que los elementos respiren
- El vacío crea jerarquía y claridad
- No hay prisa por llenar el espacio

**Aplicación**
- Márgenes generosos alrededor de todos los elementos
- El contenido nunca se siente apretado
- Los elementos flotan en el espacio, no se apilan
- El vacío permite que la profundidad y el blur se aprecien

---

## Tipografía

### Familia Principal
**SF Pro Display / SF Pro Text** (conceptual)
- Fuente del sistema macOS
- Legibilidad óptima en pantalla
- Neutralidad absoluta
- No transmite emoción, solo información

### Escala Tipográfica

**Display (Títulos Principales)**
- `48px / 3rem` — Título de pantalla principal
- `36px / 2.25rem` — Título de sección grande
- `28px / 1.75rem` — Título de sección

**Headings (Encabezados)**
- `24px / 1.5rem` — Heading 1 (peso: 600)
- `20px / 1.25rem` — Heading 2 (peso: 600)
- `18px / 1.125rem` — Heading 3 (peso: 500)
- `16px / 1rem` — Heading 4 (peso: 500)

**Body (Cuerpo)**
- `15px / 0.9375rem` — Body Large (peso: 400)
- `13px / 0.8125rem` — Body Regular (peso: 400)
- `12px / 0.75rem` — Body Small (peso: 400)
- `11px / 0.6875rem` — Caption (peso: 400)

**Monospace (Números)**
- `15px / 0.9375rem` — Números en tablas y métricas
- `13px / 0.8125rem` — Números pequeños
- Fuente: SF Mono (conceptual)

### Pesos Tipográficos

- **600 (Semibold)** — Títulos y elementos de jerarquía alta
- **500 (Medium)** — Subtítulos y elementos de jerarquía media
- **400 (Regular)** — Texto de cuerpo y contenido general
- **300 (Light)** — No se usa (demasiado sutil)

### Interlineado

- **Display**: 1.1 (títulos grandes, compactos)
- **Headings**: 1.2 (encabezados)
- **Body**: 1.5 (texto de lectura)
- **Caption**: 1.4 (texto pequeño)

---

## Espaciados

### Sistema de Espaciado

**Base: 4px**

Todos los espaciados son múltiplos de 4px para mantener consistencia y alineación perfecta.

### Escala de Espaciado

- `4px / 0.25rem` — Espaciado mínimo (entre elementos relacionados)
- `8px / 0.5rem` — Espaciado pequeño (dentro de componentes)
- `12px / 0.75rem` — Espaciado medio-pequeño
- `16px / 1rem` — Espaciado base (entre elementos de un grupo)
- `24px / 1.5rem` — Espaciado medio (entre grupos relacionados)
- `32px / 2rem` — Espaciado grande (entre secciones)
- `48px / 3rem` — Espaciado muy grande (entre áreas principales)
- `64px / 4rem` — Espaciado máximo (márgenes de página)

### Aplicación de Espaciados

**Padding de Cards**
- Interno: 24px (vertical) / 24px (horizontal)
- Entre cards: 24px

**Padding de Secciones**
- Interno: 48px (vertical) / 64px (horizontal)
- Entre secciones: 64px

**Padding de Elementos Interactivos**
- Botones: 12px (vertical) / 24px (horizontal)
- Inputs: 12px (vertical) / 16px (horizontal)
- Links: 8px (vertical) / 12px (horizontal)

---

## Tamaños

### Breakpoints (Conceptuales)

- **Desktop**: 1440px+ (diseño principal)
- **Large Desktop**: 1920px+ (más espacio, mismo diseño)
- **Tablet**: 1024px - 1439px (adaptación mínima)
- **Mobile**: No considerado (aplicación desktop-first)

### Anchos de Contenido

- **Ancho máximo de contenido**: 1200px
- **Ancho de sidebar**: 280px (si aplica)
- **Ancho de cards**: Flexible, mínimo 320px, máximo según grid

### Alturas

- **Barra superior fija**: 64px
- **Altura mínima de card**: 200px
- **Altura de fila de tabla**: 48px
- **Altura de input**: 36px
- **Altura de botón**: 36px

---

## Uso del Color

### Filosofía de Color

**Casi sin color** — El color se usa con extrema moderación y solo para:
1. Estados interactivos (hover, active, focus)
2. Estados de sistema (error, éxito, advertencia)
3. Diferenciación mínima de datos (si es absolutamente necesario)

### Fondos

**Filosofía**
- Los fondos son orgánicos y vivos, no planos
- Gradientes sutiles crean profundidad sin distraer
- Blobs flotantes añaden movimiento casi imperceptible
- El fondo respira, pero nunca compite con el contenido

**Fondo Principal**
- Gradiente orgánico: `linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 50%, #FAFAFA 100%)`
- Variación sutil: `radial-gradient(circle at 20% 30%, rgba(250, 250, 250, 0.8) 0%, transparent 50%)`
- Movimiento lento: Animación de 60s (casi imperceptible, solo para vida)
- Sin colores saturados: Solo variaciones de gris muy sutiles

**Blobs Flotantes (Opcional, Muy Sutil)**
- Formas orgánicas con blur extremo: `blur(120px)`
- Opacidad muy baja: `rgba(0, 0, 0, 0.02)` o `rgba(255, 255, 255, 0.03)`
- Movimiento lento: Animación de 20-30s (flotación casi imperceptible)
- Tamaño: 300-500px (muy grandes, muy difusos)
- Posición: Esquinas y bordes, nunca en el centro
- **Cuándo usar**: Solo en fondos de pantalla principales (Dashboard, Proyecciones)
- **Cuándo NO usar**: En fondos de cards, tablas, o elementos densos

**Fondo de Cards**
- Translúcido con blur: `backdrop-filter: blur(40px)`
- Fondo: `rgba(255, 255, 255, 0.7)` (glassmorphism)
- Sin gradientes en cards: Las cards son translúcidas, no decoradas
- Borde sutil: `1px solid rgba(255, 255, 255, 0.2)` (solo en hover o estados elevados)

**Fondo de Barra Superior**
- Translúcido con blur: `backdrop-filter: blur(60px)`
- Fondo: `rgba(255, 255, 255, 0.8)` (más opaco para legibilidad)
- Sin gradientes: Translucidez pura

### Paleta de Grises (Principal)

**Fondo (Actualizado)**
- Gradiente orgánico: `#FAFAFA` → `#F5F5F5` → `#FAFAFA` (muy sutil)
- Cards translúcidas: `rgba(255, 255, 255, 0.7)` con blur
- Barra superior: `rgba(255, 255, 255, 0.8)` con blur

**Texto**
- `#000000` — Texto principal (negro puro)
- `#1A1A1A` — Texto secundario (casi negro)
- `#666666` — Texto terciario (gris medio)
- `#999999` — Texto deshabilitado (gris claro)

**Bordes y Divisores**
- `#E5E5E5` — Bordes sutiles (gris muy claro)
- `#D0D0D0` — Bordes más visibles (gris claro)
- `#F5F5F5` — Divisores internos (muy sutiles)

### Paleta de Color (Mínima)

**Azul (Interacción)**
- `#007AFF` — Azul sistema macOS (links, botones primarios)
- `#0051D5` — Azul hover (más oscuro)
- `#E6F2FF` — Azul fondo hover (muy sutil)

**Estados de Sistema**
- `#FF3B30` — Error (rojo sistema macOS)
- `#34C759` — Éxito (verde sistema macOS)
- `#FF9500` — Advertencia (naranja sistema macOS)

**Uso de Color en Datos**
- Solo si es absolutamente necesario para diferenciación
- Preferir variaciones de gris
- Si se usa color, debe ser extremadamente sutil

### Contraste

- **Texto sobre fondo claro**: Mínimo 4.5:1 (WCAG AA)
- **Texto principal**: 16:1 (negro sobre blanco)
- **Texto secundario**: 8:1 (gris oscuro sobre blanco)

---

## Cards

### Filosofía de Cards

Las cards son el elemento contenedor principal. Flotan sobre el fondo con glassmorphism avanzado, creando profundidad y organización a través de translucidez y blur.

### Características

**Glassmorphism Avanzado**
- Fondo translúcido: `rgba(255, 255, 255, 0.7)`
- Blur de fondo: `backdrop-filter: blur(40px)`
- Borde sutil: `1px solid rgba(255, 255, 255, 0.2)` (solo en estados elevados)
- Sin fondo sólido: La translucidez es la característica principal

**Elevación**
- Sombra suave y difusa: `0px 8px 32px rgba(0, 0, 0, 0.06)`
- Sombra adicional sutil: `0px 2px 8px rgba(0, 0, 0, 0.04)` (profundidad)
- Sin borde visible (el blur y la sombra definen el límite)
- La elevación se siente, no se ve explícitamente

**Forma**
- Bordes redondeados: `16px` (más generosos, más orgánicos)
- Sin bordes visibles por defecto
- Esquinas perfectamente redondeadas
- La forma es suave y orgánica

**Espaciado Interno**
- Padding: 32px (todos los lados) — más generoso para respirar
- Contenido nunca toca los bordes
- El espacio interno permite que el blur se aprecie

**Comportamiento**
- Hover: Elevación aumentada con sombra más pronunciada y blur más intenso
- Transición suave: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Ligera elevación en hover: `transform: translateY(-2px)`
- Blur aumentado en hover: `backdrop-filter: blur(50px)`
- Sin animaciones llamativas, solo elevación y blur sutiles

### Tipos de Cards

**Card Simple**
- Contenedor básico de contenido
- Padding: 24px
- Sin header específico

**Card con Header**
- Header separado visualmente (borde inferior sutil)
- Padding del header: 24px (vertical) / 24px (horizontal)
- Padding del contenido: 24px

**Card Compacta**
- Padding reducido: 16px
- Para información densa pero organizada

**Card Interactiva**
- Cursor pointer en hover
- Elevación aumentada en hover
- Sin cambio de color de fondo

---

## Headers

### Header Principal (Barra Superior)

**Características**
- Altura fija: 64px
- Fondo translúcido: `rgba(255, 255, 255, 0.8)`
- Blur de fondo: `backdrop-filter: blur(60px)`
- Borde inferior sutil: `1px solid rgba(0, 0, 0, 0.05)`
- Posición: Fixed top, flotante
- Z-index: 100
- Sombra sutil: `0px 2px 16px rgba(0, 0, 0, 0.04)` (flotación)

**Contenido**
- Logo/título izquierda: 24px desde el borde
- Navegación central (si aplica)
- Acciones derecha: 24px desde el borde

**Tipografía**
- Título: 18px, peso 600
- Navegación: 15px, peso 400
- Acciones: 15px, peso 400

### Header de Sección

**Características**
- No fijo
- Espaciado superior: 48px
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Contenido**
- Título: 28px, peso 600
- Subtítulo (opcional): 15px, peso 400, color `#666666`
- Acciones (opcional): Derecha, alineadas

**Layout**
- Flexbox horizontal
- Título izquierda, acciones derecha
- Espaciado entre: auto

### Header de Card

**Características**
- Dentro de la card
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5` (muy sutil)
- Margen inferior: 0px (el contenido continúa con padding)

**Contenido**
- Título: 18px, peso 600
- Subtítulo (opcional): 13px, peso 400, color `#666666`
- Acciones (opcional): Derecha

---

## Tablas

### Filosofía de Tablas

Las tablas son minimalistas y legibles con profundidad sutil. No hay líneas de grid visibles, solo separación por espacio, hover y elevación ligera.

### Características

**Estructura**
- Sin bordes visibles
- Filas con altura: 56px (más generoso, más aire)
- Padding horizontal: 32px (más espacio para respirar)
- Padding vertical: 16px (dentro de la altura de 56px)
- Espaciado entre filas: 4px (las filas no se tocan, hay aire)

**Header de Tabla**
- Altura: 56px
- Fondo translúcido: `rgba(250, 250, 250, 0.6)` con blur sutil
- Blur: `backdrop-filter: blur(20px)` (muy sutil)
- Texto: 13px, peso 500, color `#666666`
- Text transform: uppercase (opcional, muy sutil)
- Letter spacing: 0.5px
- Borde inferior: `1px solid rgba(0, 0, 0, 0.05)`

**Filas**
- Fondo translúcido: `rgba(255, 255, 255, 0.5)` (muy sutil)
- Blur: `backdrop-filter: blur(10px)` (casi imperceptible)
- Hover: Fondo `rgba(250, 250, 250, 0.8)` con blur aumentado
- Elevación sutil en hover: `transform: translateY(-1px)`
- Sombra sutil en hover: `0px 4px 12px rgba(0, 0, 0, 0.04)`
- Sin bordes entre filas
- Espaciado entre filas: 4px (aire entre filas)

**Celdas**
- Texto: 15px, peso 400
- Números: 15px, monospace, peso 400
- Alineación: Izquierda (texto), Derecha (números)
- Padding: 16px horizontal

**Estados**
- Hover: Fondo `#FAFAFA`
- Selected: Fondo `#E6F2FF` (azul muy sutil)
- Sin bordes de selección visibles

### Tipos de Tablas

**Tabla Simple**
- Sin alternancia de colores
- Solo hover para feedback

**Tabla con Acciones**
- Columna de acciones a la derecha
- Botones/links sutiles
- Visible solo en hover de fila

**Tabla Compacta**
- Altura de fila: 40px
- Padding reducido: 12px horizontal
- Texto: 13px

---

## Barra Superior Fija de Proyecciones

### Elemento Central del Sistema

Esta barra es el elemento más importante de la interfaz. Muestra proyecciones financieras en tiempo real y está siempre visible. Flota sobre el contenido con translucidez avanzada.

### Características

**Posición y Comportamiento**
- Posición: Fixed top, debajo del header principal, flotante
- Altura: 56px
- Ancho: 100%
- Z-index: 99 (debajo del header, encima de todo)
- Fondo translúcido: `rgba(255, 255, 255, 0.75)`
- Blur de fondo: `backdrop-filter: blur(60px)`
- Borde inferior sutil: `1px solid rgba(0, 0, 0, 0.05)`
- Sombra sutil: `0px 2px 16px rgba(0, 0, 0, 0.04)` (flotación)

**Contenido**

**Layout Horizontal**
- Dividido en secciones iguales (mínimo 3, máximo 6)
- Cada sección muestra una métrica de proyección
- Separación entre secciones: Borde vertical sutil `1px solid #F5F5F5`

**Cada Sección Contiene:**
- Label (arriba): 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor (abajo): 20px, peso 600, color `#000000`, monospace
- Padding interno: 12px vertical / 24px horizontal
- Alineación: Centro (opcional) o Izquierda

**Tipografía de Valores (Escultórica)**
- Monospace (SF Mono conceptual)
- Peso 600 (semibold)
- Tamaño: 24px (más grande, más prominente)
- Color: Negro puro (`#000000`)
- Letter-spacing: `-0.5px` (más compacto, más escultórico)
- Sin separadores de miles (o muy sutiles)
- Los números se sienten tallados, no impresos

**Estados Interactivos**
- Hover sobre sección: Fondo `#FAFAFA` (muy sutil)
- Click (si aplica): Navegación a detalle
- Sin cambio de color de texto

**Responsive**
- En pantallas más pequeñas, se convierte en scroll horizontal
- Mantiene altura fija
- Scroll suave y discreto

**Integración**
- Siempre visible, incluso al hacer scroll
- No compite con el contenido principal
- Se siente parte del sistema, no un elemento flotante

---

## Elementos Interactivos

### Botones

**Botón Primario**
- Fondo: `#007AFF` (azul sistema)
- Texto: `#FFFFFF` (blanco)
- Padding: 12px vertical / 24px horizontal
- Altura: 36px
- Bordes redondeados: 6px
- Peso texto: 500
- Tamaño texto: 15px
- Hover: Fondo `#0051D5`
- Sin sombra

**Botón Secundario**
- Fondo: Transparente
- Texto: `#007AFF` (azul sistema)
- Borde: `1px solid #E5E5E5`
- Padding: 12px vertical / 24px horizontal
- Altura: 36px
- Bordes redondeados: 6px
- Peso texto: 400
- Tamaño texto: 15px
- Hover: Fondo `#FAFAFA`

**Botón Texto**
- Fondo: Transparente
- Texto: `#007AFF` (azul sistema)
- Sin borde
- Padding: 8px vertical / 12px horizontal
- Peso texto: 400
- Tamaño texto: 15px
- Hover: Fondo `#FAFAFA` (muy sutil)

### Links

- Color: `#007AFF` (azul sistema)
- Sin subrayado por defecto
- Subrayado en hover (opcional, muy sutil)
- Tamaño: 15px
- Peso: 400

### Inputs

**Input de Texto**
- Fondo: `#FFFFFF`
- Borde: `1px solid #E5E5E5`
- Bordes redondeados: 6px
- Padding: 12px vertical / 16px horizontal
- Altura: 36px
- Texto: 15px, peso 400
- Focus: Borde `#007AFF`, outline sutil
- Placeholder: `#999999`

**Input de Búsqueda**
- Icono de búsqueda izquierda (si aplica)
- Mismo estilo que input de texto
- Padding izquierdo aumentado si hay icono

---

## Estados y Feedback

### Estados de Interacción

**Hover**
- Transición: 150ms ease
- Cambio sutil de fondo o elevación
- Sin cambios bruscos

**Active**
- Ligera reducción de opacidad o cambio de fondo
- Feedback inmediato

**Focus**
- Outline sutil (2px, color `#007AFF`)
- Visible pero no intrusivo

**Disabled**
- Opacidad: 0.5
- Cursor: not-allowed
- Sin interacción

### Estados de Sistema

**Éxito**
- Color: `#34C759` (verde sistema)
- Uso mínimo, solo cuando es necesario

**Error**
- Color: `#FF3B30` (rojo sistema)
- Uso solo para errores críticos

**Advertencia**
- Color: `#FF9500` (naranja sistema)
- Uso extremadamente limitado

**Carga**
- Indicador sutil (spinner o skeleton)
- Sin colores llamativos
- Gris muy claro

---

## Motion System

### Filosofía

Las animaciones son orgánicas y naturales. Existen para suavizar la experiencia y crear fluidez, no para llamar la atención. El movimiento es lento y deliberado.

### Duraciones

**Micro-interacciones**
- Hover: 300ms
- Click/Active: 150ms
- Focus: 200ms

**Transiciones de Estado**
- Cambio de contenido: 400ms
- Aparición de elementos: 500ms
- Desaparición de elementos: 300ms

**Animaciones de Entrada**
- Cards: 600ms (con stagger de 50ms entre cada una)
- Contenido de página: 500ms
- Overlays/Modales: 400ms

**Animaciones Continuas**
- Blobs flotantes: 20-30s (muy lento, casi imperceptible)
- Gradientes de fondo: 60s (muy lento, solo para vida)

### Easing

**Easing Estándar (Cubic Bezier)**
- Suave y natural: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design)
- Entrada suave: `cubic-bezier(0.0, 0, 0.2, 1)` (ease-out)
- Salida suave: `cubic-bezier(0.4, 0, 1, 1)` (ease-in)
- Entrada y salida: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)

**Cuándo Usar Cada Easing**
- Hover: `cubic-bezier(0.4, 0, 0.2, 1)` (suave y natural)
- Entrada: `cubic-bezier(0.0, 0, 0.2, 1)` (acelera al final)
- Salida: `cubic-bezier(0.4, 0, 1, 1)` (desacelera al inicio)
- Scroll: `cubic-bezier(0.4, 0, 0.2, 1)` (fluido)

### Entrada / Salida

**Entrada de Cards**
- Fade in: `opacity: 0 → 1` (500ms)
- Elevación ligera: `transform: translateY(8px) → translateY(0)` (500ms)
- Blur inicial: `backdrop-filter: blur(0px) → blur(40px)` (500ms)
- Stagger: 50ms entre cada card (ritmo visual)

**Salida de Elementos**
- Fade out: `opacity: 1 → 0` (300ms)
- Sin movimiento (solo fade)
- Más rápido que la entrada (salida inmediata)

**Entrada de Contenido de Página**
- Fade in: `opacity: 0 → 1` (500ms)
- Sin movimiento (solo fade)
- El contenido aparece, no se desliza

### Hover

**Cards**
- Elevación: `transform: translateY(-2px)` (300ms)
- Sombra aumentada: `box-shadow` más pronunciada (300ms)
- Blur aumentado: `backdrop-filter: blur(40px) → blur(50px)` (300ms)
- Sin cambio de escala (no se agrandan)

**Elementos Interactivos**
- Fondo: `background-color` cambio sutil (300ms)
- Elevación ligera: `transform: translateY(-1px)` (300ms)
- Sin cambios bruscos

**Links**
- Color: `color` cambio sutil (200ms)
- Subrayado opcional: `text-decoration` (200ms)
- Sin cambios de tamaño

### Scroll

**Scroll Suave**
- Comportamiento: `scroll-behavior: smooth`
- Velocidad: Natural del navegador
- Sin parallax exagerado (solo muy sutil si es necesario)

**Parallax Sutil (Opcional)**
- Solo en elementos de fondo (blobs, gradientes)
- Movimiento: 0.5x la velocidad de scroll (muy sutil)
- Nunca en contenido principal (solo decoración de fondo)

**Scroll Indicators**
- Sin scrollbars visibles (o muy sutiles)
- El contenido indica scrollabilidad por posición
- Sin animaciones de scroll

### Animaciones Específicas

**Aparición de Cards**
- Fade in: 500ms
- Elevación ligera: 500ms
- Blur inicial: 500ms
- Stagger: 50ms entre cada card

**Hover de Elementos**
- Cambio de fondo: 300ms
- Cambio de elevación: 300ms
- Cambio de blur: 300ms

**Carga de Contenido**
- Fade in: 500ms
- Sin skeleton loaders llamativos
- Solo fade, sin movimiento

**Navegación**
- Sin transiciones de página
- Cambio instantáneo
- Solo transiciones internas de componentes

**Blobs Flotantes (Fondo)**
- Movimiento orgánico: `transform: translate()` con animación continua
- Duración: 20-30s (muy lento)
- Easing: `cubic-bezier(0.4, 0, 0.6, 1)` (suave y orgánico)
- Infinite loop (sin inicio ni fin)

---

## Grid y Layout

### Sistema de Grid

**Grid Principal**
- 12 columnas (conceptual)
- Gutter: 24px
- Margen lateral: 64px (en pantallas grandes)

**Aplicación**
- Cards se alinean al grid
- Contenido nunca se sale del grid
- Consistencia en todos los breakpoints

### Layout General

**Estructura**
- Header fijo: 64px
- Barra de proyecciones fija: 56px
- Contenido: Resto del viewport
- Padding lateral: 64px
- Padding superior del contenido: 48px (debajo de las barras fijas)

**Scroll**
- Scroll suave (smooth scroll)
- Sin scrollbars visibles (o muy sutiles)
- El contenido indica scrollabilidad por posición

---

## Iconografía

### Filosofía

Los iconos son extremadamente simples y minimalistas. Preferencia por iconos de línea, no rellenos.

### Características

- **Estilo**: Línea delgada (1.5px stroke)
- **Tamaño estándar**: 16px, 20px, 24px
- **Color**: `#666666` (gris medio) por defecto
- **Color hover**: `#000000` (negro)
- **Sin decoración**: Solo la forma esencial

### Uso

- Iconos solo cuando agregan claridad
- No usar iconos decorativos
- Consistencia en el estilo de todos los iconos
- Preferir texto sobre iconos cuando sea posible

---

## Consistencia y Reutilización

### Principios

1. **Todo es un componente reutilizable**
2. **Las variaciones son mínimas y documentadas**
3. **No se crean excepciones sin justificación**
4. **El sistema se extiende, no se rompe**

### Documentación de Variaciones

Cada variación de un componente debe estar documentada con:
- Cuándo usarla
- Por qué existe
- Cómo se diferencia de la versión estándar

---

## Reglas de Sobriedad

### Efectos Prohibidos

**Efectos 3D Exagerados**
- ❌ Transformaciones 3D rotativas o perspectivas exageradas
- ❌ Efectos de profundidad artificial (no es un juego)
- ❌ Sombras duras o direccionales exageradas
- ✅ Solo profundidad perceptual sutil (blur, sombras suaves)

**Efectos de Partículas o Efectos Especiales**
- ❌ Partículas animadas
- ❌ Efectos de fuego, agua, o elementos orgánicos exagerados
- ❌ Efectos de glitch o distorsión
- ✅ Solo blobs flotantes muy sutiles en fondo (opcional)

**Efectos de Color Saturados**
- ❌ Gradientes de colores saturados
- ❌ Efectos de neón o brillo
- ❌ Colores vibrantes en fondos
- ✅ Solo variaciones de gris muy sutiles

**Efectos de Texto Exagerados**
- ❌ Animaciones de texto llamativas
- ❌ Efectos de typing o escritura
- ❌ Texto que se mueve o rota
- ✅ Solo fade in suave en entrada

### Animaciones Prohibidas

**Animaciones Rápidas o Bruscas**
- ❌ Animaciones menores a 200ms (demasiado rápidas)
- ❌ Animaciones con bounce o elastic (demasiado juguetonas)
- ❌ Animaciones que se repiten constantemente
- ✅ Solo animaciones suaves y lentas (300ms+)

**Animaciones de Scroll Exageradas**
- ❌ Parallax fuerte o visible
- ❌ Elementos que se mueven mucho durante scroll
- ❌ Efectos de reveal exagerados
- ✅ Solo parallax muy sutil en elementos de fondo (opcional)

**Animaciones de Hover Exageradas**
- ❌ Cambios de escala grandes (zoom in/out)
- ❌ Rotaciones o transformaciones complejas
- ❌ Cambios de color bruscos
- ✅ Solo elevación sutil y cambios de blur

**Animaciones Continuas Llamativas**
- ❌ Animaciones que se repiten constantemente y distraen
- ❌ Efectos de pulso o parpadeo
- ❌ Movimientos rápidos o erráticos
- ✅ Solo movimientos muy lentos y sutiles (20-30s)

### Cómo Evitar Ruido Visual

**Principio de Reducción**
- Si un efecto no agrega claridad, no se usa
- Si un efecto compite con el contenido, se elimina
- Si un efecto distrae, se simplifica o se quita

**Principio de Consistencia**
- Todos los efectos siguen el mismo sistema de motion
- No hay excepciones sin justificación
- La consistencia crea calma, la inconsistencia crea ruido

**Principio de Legibilidad**
- El texto siempre es nítido y legible
- El blur nunca afecta la legibilidad del texto
- Los efectos nunca oscurecen o distraen del contenido

**Principio de Profundidad Sutil**
- La profundidad se sugiere, no se impone
- Los efectos de profundidad son casi imperceptibles
- Si se nota el efecto, es demasiado

**Principio de Movimiento Orgánico**
- El movimiento es natural y fluido
- Nada se mueve de forma mecánica o robótica
- La velocidad es lenta y deliberada

---

## Checklist de Aplicación

Antes de usar cualquier elemento visual, verificar:

- [ ] ¿Es absolutamente necesario?
- [ ] ¿Sigue el sistema de espaciado (múltiplos de 4px)?
- [ ] ¿Usa la tipografía correcta y el peso adecuado?
- [ ] ¿Tiene suficiente espacio respirable?
- [ ] ¿El color está justificado?
- [ ] ¿La jerarquía es clara sin color?
- [ ] ¿Es reutilizable o es una excepción?
- [ ] ¿Sigue la filosofía de minimalismo extremo?
- [ ] ¿El blur y la translucidez mejoran la claridad?
- [ ] ¿La profundidad es sutil y perceptual?
- [ ] ¿Las animaciones son suaves y lentas?
- [ ] ¿No hay efectos prohibidos?
- [ ] ¿El movimiento es orgánico y natural?

---

**Última actualización**: Sistema de diseño 2025 — Apple visionOS-inspired
**Versión**: 2.0
**Estado**: Completo y listo para aplicación

