# Inversiones
## Pulley Group — Listado y Detalle de Inversiones

---

## Visión General

La pantalla de Inversiones es donde el usuario gestiona y analiza cada inversión individual. Permite ver el listado completo, filtrar, ordenar, y profundizar en el detalle de cada una.

**Filosofía de Uso**
- Lectura comparativa en el listado (identificar qué inversiones van bien/mal)
- Análisis profundo en el detalle (entender por qué y qué hacer)
- Toma de decisiones informada (rebalanceo, ajustes, nuevas inversiones)
- Sensación de control sobre cada activo

**Paradigma de Eventos Patrimoniales**
- Cada inversión comienza con un EVENTO (capital inicial)
- Aportes posteriores son EVENTOS que ajustan la proyección
- Retiros son EVENTOS que reducen el capital
- Cambios de rendimiento son EVENTOS que ajustan la curva
- La proyección continúa desde el último evento, no desde cero
- El historial de eventos explica cada cambio en la curva

**Estructura Visual**
- Header fijo (64px)
- Barra de Proyecciones fija (56px) — solo en vista detalle, recalculada para esa inversión
- Contenido principal con scroll vertical
- Cards flotantes con información clara
- Filtros y orden discretos, no dominantes

---

## Layout General — Vista Listado

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
│  │ FILTROS Y ORDEN (discreto)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ CARD INVERSIÓN 1                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ CARD INVERSIÓN 2                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ CARD INVERSIÓN 3                │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Elementos

- Entre filtros y primera card: **32px**
- Entre cards: **24px**
- Bottom padding del contenido: **64px**

---

## 1. Vista Listado de Inversiones

### Propósito

Muestra todas las inversiones en cards limpias y comparables. Permite identificar rápidamente qué inversiones están funcionando bien y cuáles requieren atención.

### Por Qué Está Ahí

El usuario necesita una vista comparativa de todas sus inversiones. Esta vista responde: "¿Qué inversiones tengo? ¿Cuáles van bien? ¿Cuáles van mal?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El nombre de la inversión — identificación
2. El indicador visual (↑ ↓ =) — rendimiento inmediato
3. El resultado acumulado — métrica principal
4. El capital invertido — contexto
5. El tipo y estado — clasificación secundaria

### Diseño Detallado

**Card de Inversión**

**Características:**
- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)
- Altura: Flexible (mínimo 120px)
- Hover: Elevación ligeramente mayor (sombra más pronunciada)
- Cursor: pointer (indica que es clickeable)

**Layout Interno**

Grid de 2 columnas (conceptual):

```
┌──────────────────────────┬──────────────────────────┐
│ NOMBRE (izquierda)       │ RESULTADO (derecha)       │
│ TIPO + ESTADO            │ INDICADOR VISUAL          │
│                          │ CAPITAL INVERTIDO         │
└──────────────────────────┴──────────────────────────┘
```

**Columna Izquierda: Nombre y Clasificación**

**Elemento 1: Nombre de Inversión**
- Texto: 20px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante para identificación**

**Elemento 2: Tipo y Estado (en línea)**
- Tipo: 13px, peso 400, color `#666666`
- Separador: "·" (punto medio), 13px, color `#E5E5E5`, padding horizontal 8px
- Estado: 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px

**Estados Posibles:**
- "Activa" — inversión en curso
- "Cerrada" — inversión finalizada
- "Pendiente" — inversión en proceso de apertura
- "Suspendida" — inversión temporalmente pausada

**Columna Derecha: Métricas y Rendimiento**

**Elemento 3: Resultado Acumulado**
- Label: "RESULTADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Signo: "+" o "-" antes del número, mismo tamaño
- Alineación: Derecha
- Margen inferior: 8px
- **Es la métrica principal de rendimiento**

**Elemento 4: Indicador Visual Simple**
- Símbolo: "↑" (sube), "↓" (baja), "=" (neutral)
- Tamaño: 20px
- Color: `#000000` (negro) — no se usa color verde/rojo
- Alineación: Derecha
- Margen inferior: 8px
- **Comunica dirección del rendimiento sin color**

**Elemento 5: Capital Invertido**
- Label: "CAPITAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 15px, peso 400, color `#000000`, monospace
- Alineación: Derecha
- Margen inferior: 0px
- **Contexto del resultado**

**Layout Responsive**

- En pantallas menores, el grid se convierte en 1 columna
- Nombre arriba, métricas abajo
- Mismo espaciado vertical (24px entre elementos)

**Interacción**

- Hover: Elevación aumentada (sombra más pronunciada)
- Click: Navegación a vista detalle de la inversión
- Transición: 150ms ease

**Por Qué Este Diseño:**

- Cards limpias y comparables
- Información esencial sin ruido
- El indicador visual (↑ ↓ =) comunica rendimiento sin color
- El resultado acumulado es la métrica más importante
- El nombre es prominente para identificación rápida

---

## 2. Filtros y Orden

### Propósito

Permite filtrar y ordenar las inversiones sin dominar la interfaz. Son herramientas de utilidad, no el foco principal.

### Por Qué Está Ahí

El usuario necesita encontrar inversiones específicas o verlas ordenadas de diferentes formas. Los filtros y el orden responden: "¿Cómo quiero ver mis inversiones?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Las cards de inversiones (el contenido principal)
2. Los filtros y orden (herramientas discretas)

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
│ TIPO     │ ESTADO   │ RENTAB.  │ HORIZONTE│ ORDEN    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Filtro 1: Por Tipo de Inversión**

- Label: "Tipo", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto o botones texto
- Opciones: "Todas" | "Acciones" | "Bonos" | "Fondos" | "Otros"
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 120px

**Filtro 2: Por Estado**

- Label: "Estado", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto o botones texto
- Opciones: "Todas" | "Activas" | "Cerradas" | "Pendientes"
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 120px

**Filtro 3: Por Rentabilidad**

- Label: "Rentabilidad", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: "Todas" | "Positivas" | "Negativas" | "Neutras"
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 120px

**Filtro 4: Por Horizonte**

- Label: "Horizonte", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: "Todos" | "Corto" | "Mediano" | "Largo"
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 120px

**Filtro 5: Orden**

- Label: "Ordenar por", 13px, peso 400, color `#666666`
- Selector: Dropdown discreto
- Opciones: "Nombre" | "Resultado" | "Capital" | "ROI" | "Fecha"
- Diseño: 13px, peso 400, color `#000000`
- Hover: Color `#007AFF` (azul sistema)
- Ancho: Flexible, mínimo 120px
- Indicador de dirección: "↑" o "↓" después del texto (muy sutil)

**Espaciado Entre Filtros**

- Horizontal: 24px
- Los filtros se alinean horizontalmente
- Si no caben, se apilan en 2 filas

**Estados Activos**

- Filtro activo: Peso 600, color `#000000`
- Filtro inactivo: Peso 400, color `#666666`
- Sin fondos de color, solo tipografía

**Por Qué Este Diseño:**

- Discreto pero accesible
- No compite con las cards de inversiones
- Los filtros son herramientas, no el contenido
- Layout horizontal compacto
- Sin colores llamativos, solo tipografía

---

## 3. Card de Inversión (Detalle Visual)

### Propósito

La card en el listado debe comunicar suficiente información para que el usuario pueda comparar inversiones sin entrar al detalle.

### Qué Se Ve Sin Entrar

**Información Visible:**
1. Nombre de la inversión (20px, peso 600) — identificación
2. Tipo y estado (13px, peso 400, gris) — clasificación
3. Resultado acumulado (24px, peso 600) — métrica principal
4. Indicador visual (↑ ↓ =) — dirección del rendimiento
5. Capital invertido (15px, peso 400) — contexto

**Información NO Visible (solo en detalle):**
- Flujos individuales
- Rendimiento histórico detallado
- Proyecciones específicas
- Notas y decisiones

### Qué Jerarquía Tienen los Datos

**Jerarquía 1 (Más Importante):**
- Nombre de inversión (20px, peso 600)
- Resultado acumulado (24px, peso 600)

**Jerarquía 2 (Importante):**
- Indicador visual (20px)
- Capital invertido (15px, peso 400)

**Jerarquía 3 (Secundaria):**
- Tipo y estado (13px, peso 400, gris)

### Cómo Se Compara una Inversión con Otra

**Comparación Visual:**
- Todas las cards tienen el mismo layout
- Los valores están alineados (derecha para números)
- El tamaño tipográfico indica importancia
- El indicador visual (↑ ↓ =) permite comparación rápida

**Comparación de Métricas:**
- Resultado acumulado: más grande = más importante
- Capital invertido: contexto para entender el resultado
- Indicador visual: dirección inmediata del rendimiento

**Por Qué Este Diseño:**

- Información suficiente para comparar
- No sobrecarga con detalles
- El detalle está en la vista específica
- Comparación visual clara y rápida

---

## 4. Vista Detalle de Inversión

### Propósito

Muestra toda la información de una inversión específica. Permite análisis profundo y toma de decisiones informadas.

### Por Qué Está Ahí

El usuario necesita entender por qué una inversión está funcionando bien o mal, y qué hacer al respecto. Esta vista responde: "¿Por qué esta inversión va así? ¿Qué debo hacer?"

### Estructura Visual

```
┌─────────────────────────────────────────┐
│ HEADER (64px, fixed)                   │
├─────────────────────────────────────────┤
│ BARRA PROYECCIONES (56px, fixed)        │
│ (recalculada solo para esta inversión) │
├─────────────────────────────────────────┤
│                                         │
│  CONTENIDO PRINCIPAL (scroll)           │
│  Padding top: 48px                      │
│  Padding lateral: 64px                  │
│  Ancho máximo: 1200px                   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ENCABEZADO (nombre + tipo)       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ PESTAÑAS                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ CONTENIDO DE PESTAÑA ACTIVA     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Barra de Proyecciones (Recalculada)

**Características:**
- Mismo diseño que en el dashboard
- Mismo comportamiento (fixed, siempre visible)
- **Diferencia clave:** Las proyecciones se calculan solo para esta inversión
- Selectores de escenario y horizonte funcionan igual
- El valor proyectado muestra el futuro de esta inversión específica

**Por Qué Está Ahí:**
- Las proyecciones son el eje rector del sistema
- El usuario necesita ver el futuro de cada inversión
- Mantiene coherencia con el resto de la aplicación

### Encabezado Claro

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal) — más generoso
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)

**Contenido**

**Elemento 1: Nombre de Inversión**
- Texto: 36px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el título principal de la pantalla**

**Elemento 2: Tipo y Estado**
- Tipo: 15px, peso 400, color `#666666`
- Separador: "·" (punto medio), 15px, color `#E5E5E5`, padding horizontal 8px
- Estado: 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px

**Espaciado**

- Margen superior: 0px (primer elemento después de la barra de proyecciones)
- Margen inferior: 32px (antes de las pestañas)

**Por Qué Este Diseño:**

- Encabezado claro y prominente
- El nombre es lo más importante (36px)
- Tipo y estado son información de contexto
- Mucho espacio respirable

---

## 5. Pestañas Internas

### Propósito

Organizan la información detallada de la inversión en secciones lógicas. Cada pestaña responde a una pregunta específica.

### Por Qué Está Ahí

El usuario necesita diferentes tipos de información sobre una inversión. Las pestañas organizan esta información sin sobrecargar la pantalla.

### Diseño Detallado

**Contenedor de Pestañas**

- Fondo: `#FFFFFF` (blanco)
- Sin card (las pestañas están en el mismo nivel que el contenido)
- Borde inferior: `1px solid #E5E5E5` (solo en la pestaña activa)
- Padding: 0px (las pestañas tienen su propio padding)

**Pestañas Individuales**

- Texto: 15px, peso 400, color `#666666`
- Texto activa: 15px, peso 600, color `#000000`
- Padding: 12px vertical / 24px horizontal
- Borde inferior activa: `2px solid #000000` (muy sutil)
- Espaciado entre pestañas: 32px
- Hover: Color `#000000` (negro)

**Pestañas Obligatorias:**

1. **Resumen**
2. **Flujos**
3. **Rendimiento**
4. **Proyección**
5. **Notas / Decisiones**

**Layout Horizontal**

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ RESUMEN  │ FLUJOS   │RENDIMIENTO│PROYECCIÓN│NOTAS     │
│ (activa) │          │           │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Contenido de Pestaña**

- Card contenedora (si aplica)
- Padding: 24px (estándar)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100% (hasta el máximo de 1200px)
- Margen superior: 24px (después de las pestañas)

**Por Qué Este Diseño:**

- Pestañas discretas, no dominantes
- Solo tipografía, sin fondos de color
- El borde inferior indica la pestaña activa
- Layout horizontal compacto
- Consistente con el lenguaje visual macOS

---

## 6. Pestaña: Resumen

### Propósito

Muestra un resumen ejecutivo de la inversión. Información esencial de un vistazo.

### Qué Se Muestra

**Métricas Principales:**
1. Capital Invertido
2. Valor Actual
3. Resultado Acumulado
4. ROI (Nominal y Real)
5. Estado Actual

**Información de Contexto:**
- Fecha de inicio
- Fecha de cierre (si aplica)
- Tipo de inversión
- Horizonte temporal

### Qué Decisión Habilita

- **Decisión:** ¿Mantengo, aumento o reduzco esta inversión?
- **Información clave:** El resultado acumulado y el ROI indican si la inversión está funcionando
- **Contexto:** El capital invertido y el valor actual muestran la magnitud

### Por Qué Existe

El usuario necesita ver el estado general de la inversión antes de profundizar en detalles. Esta pestaña responde: "¿Cómo está esta inversión en general?"

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Layout Grid 2x3**

```
┌──────────────────┬──────────────────┐
│ CAPITAL INVERTIDO│ VALOR ACTUAL      │
├──────────────────┼──────────────────┤
│ RESULTADO        │ ROI NOMINAL       │
├──────────────────┼──────────────────┤
│ ROI REAL         │ ESTADO            │
└──────────────────┴──────────────────┘
```

**Elemento: Capital Invertido**

- Label: "CAPITAL INVERTIDO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Padding: 0px

**Elemento: Valor Actual**

- Label: "VALOR ACTUAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Espaciado: 8px entre label y valor
- Padding: 0px

**Elemento: Resultado Acumulado**

- Label: "RESULTADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 28px, peso 600, color `#000000`, monospace
- Signo: "+" o "-" antes del número
- Espaciado: 8px entre label y valor
- Padding: 0px

**Elemento: ROI Nominal**

- Label: "ROI NOMINAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: "XX.X%"
- Espaciado: 8px entre label y valor
- Padding: 0px

**Elemento: ROI Real**

- Label: "ROI REAL", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 20px, peso 600, color `#000000`, monospace
- Formato: "XX.X%"
- Espaciado: 8px entre label y valor
- Padding: 0px

**Elemento: Estado**

- Label: "ESTADO", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 18px, peso 500, color `#000000`
- Texto: "Activa", "Cerrada", "Pendiente", "Suspendida"
- Espaciado: 8px entre label y valor
- Padding: 0px

**Espaciado Entre Elementos**

- Horizontal: 48px
- Vertical: 32px
- Los elementos no se tocan

**Información de Contexto (Debajo del Grid)**

- Fecha de inicio: 13px, peso 400, color `#666666`
- Fecha de cierre (si aplica): 13px, peso 400, color `#666666`
- Tipo: 13px, peso 400, color `#666666`
- Horizonte: 13px, peso 400, color `#666666`
- Margen superior: 32px
- Alineación: Izquierda

**Por Qué Este Diseño:**

- Grid organizado y legible
- Métricas principales destacadas
- Información de contexto secundaria
- Mucho espacio respirable
- Comparación visual clara

---

## 7. Pestaña: Flujos

### Propósito

Muestra todos los movimientos de dinero relacionados con la inversión (aportes, retiros, dividendos, intereses, etc.).

### Qué Se Muestra

**Lista de Flujos:**
- Fecha
- Tipo de flujo (Aporte, Retiro, Dividendo, Interés, etc.)
- Monto
- Saldo acumulado después del flujo
- Descripción (opcional)

**Resumen de Flujos:**
- Total de aportes
- Total de retiros
- Total de ingresos (dividendos, intereses)
- Saldo actual

### Qué Decisión Habilita

- **Decisión:** ¿Cuánto he invertido realmente? ¿Cuánto he retirado? ¿Cuánto he ganado en ingresos pasivos?
- **Información clave:** El historial de flujos muestra la evolución del capital
- **Contexto:** Los ingresos pasivos (dividendos, intereses) indican la calidad de la inversión

### Por Qué Existe

El usuario necesita entender el historial completo de movimientos de dinero. Esta pestaña responde: "¿Cómo ha evolucionado el capital de esta inversión?"

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Resumen de Flujos (Arriba)**

- Grid de 4 columnas:
  - Total Aportes
  - Total Retiros
  - Total Ingresos
  - Saldo Actual
- Cada métrica: Label (11px, gris) + Valor (20px, peso 600, monospace)
- Espaciado: 24px entre columnas
- Margen inferior: 32px

**Tabla de Flujos**

**Header de Tabla:**
- Altura: 48px
- Fondo: `#FAFAFA`
- Texto: 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Borde inferior: `1px solid #E5E5E5`
- Padding: 16px horizontal / 12px vertical

**Columnas:**
1. **Fecha** (ancho: 120px)
   - Texto: 15px, peso 400, color `#000000`
   - Formato: "DD/MM/YYYY"
   - Alineación: Izquierda

2. **Tipo** (ancho: 140px)
   - Texto: 15px, peso 400, color `#000000`
   - Alineación: Izquierda

3. **Monto** (ancho: 160px)
   - Texto: 15px, peso 400, color `#000000`, monospace
   - Signo: "+" (ingreso) o "-" (egreso) antes del número
   - Alineación: Derecha

4. **Saldo** (ancho: 160px)
   - Texto: 15px, peso 400, color `#000000`, monospace
   - Alineación: Derecha

5. **Descripción** (ancho: flexible)
   - Texto: 13px, peso 400, color `#666666`
   - Alineación: Izquierda

**Filas:**
- Altura: 48px
- Fondo: `#FFFFFF`
- Padding: 16px horizontal / 12px vertical
- Hover: Fondo `#FAFAFA`
- Sin bordes entre filas

**Ordenamiento:**
- Por defecto: Fecha descendente (más reciente primero)
- Click en header de columna: Ordena por esa columna

**Por Qué Este Diseño:**

- Tabla minimalista sin grid visible
- Resumen arriba para contexto rápido
- Información completa pero organizada
- Fácil de escanear y leer

---

## 8. Pestaña: Rendimiento

### Propósito

Muestra el rendimiento histórico de la inversión. Permite analizar la evolución del valor y el ROI a lo largo del tiempo.

### Qué Se Muestra

**Métricas de Rendimiento:**
- ROI acumulado (nominal y real)
- ROI anualizado (nominal y real)
- Variación mensual
- Variación anual
- Mejor mes
- Peor mes

**Evolución Temporal:**
- Valor de la inversión a lo largo del tiempo
- ROI acumulado a lo largo del tiempo
- Comparación con benchmarks (si aplica)

### Qué Decisión Habilita

- **Decisión:** ¿Esta inversión está cumpliendo expectativas? ¿Debo ajustar mi estrategia?
- **Información clave:** El ROI anualizado muestra el rendimiento esperado a futuro
- **Contexto:** La evolución temporal muestra la consistencia del rendimiento

### Por Qué Existe

El usuario necesita entender cómo ha rendido la inversión históricamente. Esta pestaña responde: "¿Cómo ha rendido esta inversión a lo largo del tiempo?"

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Métricas Principales (Grid 2x3)**

```
┌──────────────────┬──────────────────┐
│ ROI ACUMULADO NOM│ ROI ACUMULADO REAL│
├──────────────────┼──────────────────┤
│ ROI ANUALIZADO NOM│ ROI ANUALIZADO REAL│
├──────────────────┼──────────────────┤
│ VARIACIÓN MENSUAL│ VARIACIÓN ANUAL  │
└──────────────────┴──────────────────┘
```

**Cada Métrica:**
- Label: 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: Porcentajes con "XX.X%"
- Espaciado: 8px entre label y valor
- Padding: 0px

**Espaciado:**
- Horizontal: 48px
- Vertical: 32px

**Evolución Temporal (Debajo del Grid)**

**Card Secundaria (Opcional):**
- Si hay datos históricos suficientes, mostrar evolución
- **NO usar gráficos ruidosos**
- **Alternativa:** Tabla de valores mensuales o trimestrales
- Texto: 13px, peso 400, color `#666666`
- Formato: Lista o tabla minimalista

**Mejor y Peor Mes (Debajo)**

- Grid de 2 columnas:
  - Mejor mes: Fecha + ROI
  - Peor mes: Fecha + ROI
- Texto: 13px, peso 400, color `#666666`
- Espaciado: 24px entre columnas
- Margen superior: 32px

**Por Qué Este Diseño:**

- Métricas principales destacadas
- Sin gráficos ruidosos (preferir tablas o listas)
- Información clara y legible
- Comparación visual fácil

---

## 9. Pestaña: Proyección

### Propósito

Muestra las proyecciones futuras de la inversión según diferentes escenarios. Complementa la barra de proyecciones fija con más detalle.

### Qué Se Muestra

**Proyecciones por Escenario:**
- Conservador
- Base
- Optimista

**Proyecciones por Horizonte:**
- 5 años
- 10 años
- 20 años

**Información de Proyección:**
- Valor proyectado (nominal y real)
- ROI proyectado
- Supuestos utilizados

### Qué Decisión Habilita

- **Decisión:** ¿Esta inversión me llevará a mis objetivos? ¿Debo aumentar o reducir el capital?
- **Información clave:** Las proyecciones muestran el futuro esperado
- **Contexto:** Los diferentes escenarios muestran el rango de posibilidades

### Por Qué Existe

El usuario necesita ver el futuro de la inversión para planificar. Esta pestaña responde: "¿Hacia dónde va esta inversión?"

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Nota Importante:**
- La barra de proyecciones fija ya muestra las proyecciones principales
- Esta pestaña muestra **más detalle** y **múltiples escenarios/horizontes**

**Tabla de Proyecciones**

**Estructura:**
- Filas: Escenarios (Conservador, Base, Optimista)
- Columnas: Horizontes (5 años, 10 años, 20 años)
- Valores: Valor proyectado (nominal y real)

**Header de Tabla:**
- Altura: 48px
- Fondo: `#FAFAFA`
- Texto: 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Borde inferior: `1px solid #E5E5E5`
- Padding: 16px horizontal / 12px vertical

**Filas:**
- Altura: 64px (más alta para acomodar dos valores)
- Fondo: `#FFFFFF`
- Padding: 16px horizontal / 12px vertical
- Hover: Fondo `#FAFAFA`

**Celdas:**
- Valor Nominal: 18px, peso 600, color `#000000`, monospace
- Valor Real: 15px, peso 400, color `#666666`, monospace
- Espaciado entre valores: 8px
- Alineación: Centro

**Supuestos (Debajo de la Tabla)**

- Título: "Supuestos", 15px, peso 500, color `#000000`
- Lista: 13px, peso 400, color `#666666`
- Margen superior: 32px
- Alineación: Izquierda

**Por Qué Este Diseño:**

- Tabla clara y organizada
- Múltiples escenarios y horizontes visibles
- Valores nominal y real en cada celda
- Supuestos documentados para transparencia

---

## 10. Pestaña: Notas / Decisiones

### Propósito

Permite al usuario documentar pensamientos, decisiones y contexto sobre la inversión. Es un espacio de reflexión y registro.

### Qué Se Muestra

**Notas:**
- Texto libre
- Fecha de creación/edición
- Historial de ediciones (opcional)

**Decisiones:**
- Decisiones tomadas sobre la inversión
- Fecha de la decisión
- Razón de la decisión
- Resultado esperado

### Qué Decisión Habilita

- **Decisión:** ¿Por qué tomé esta inversión? ¿Qué debo recordar sobre ella?
- **Información clave:** El contexto y las razones ayudan a tomar decisiones futuras
- **Registro:** Las decisiones documentadas crean un historial de pensamiento

### Por Qué Existe

El usuario necesita un espacio para documentar su pensamiento sobre la inversión. Esta pestaña responde: "¿Qué pensé sobre esta inversión? ¿Qué decisiones tomé?"

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Sección: Notas**

- Título: "Notas", 18px, peso 600, color `#000000`
- Área de texto: 
  - Fondo: `#FAFAFA` (muy sutil)
  - Borde: `1px solid #E5E5E5`
  - Bordes redondeados: `6px`
  - Padding: 16px
  - Texto: 15px, peso 400, color `#000000`
  - Altura mínima: 200px
  - Altura flexible según contenido
- Fecha: 11px, peso 400, color `#999999`
- Margen superior: 0px
- Margen inferior: 32px

**Sección: Decisiones**

- Título: "Decisiones", 18px, peso 600, color `#000000`
- Lista de decisiones (si hay):

**Card de Decisión Individual:**
- Fondo: `#FAFAFA` (muy sutil)
- Borde: `1px solid #E5E5E5`
- Bordes redondeados: `6px`
- Padding: 16px
- Margen inferior: 16px (entre decisiones)

**Contenido de Cada Decisión:**
- Fecha: 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Decisión: 15px, peso 500, color `#000000`
- Razón: 13px, peso 400, color `#666666`
- Resultado esperado: 13px, peso 400, color `#666666`

**Botón Agregar Decisión (Opcional):**
- Botón texto: "Agregar decisión", 15px, peso 400, color `#007AFF`
- Hover: Color `#0051D5`
- Margen superior: 16px

**Por Qué Este Diseño:**

- Área de texto simple y limpia
- Decisiones organizadas en cards individuales
- Información clara y legible
- Sin decoración innecesaria

---

## Flujo de Navegación

### Listado → Detalle

1. Usuario ve listado de inversiones
2. Hover sobre card: Elevación aumentada
3. Click en card: Navegación a vista detalle
4. Vista detalle carga con pestaña "Resumen" activa
5. Barra de proyecciones se recalcula para esa inversión

### Detalle → Listado

1. Botón "Volver" o navegación breadcrumb
2. Regreso a listado manteniendo filtros y orden
3. Scroll a la posición de la inversión seleccionada (opcional)

### Cambio de Pestañas

1. Click en pestaña: Cambio instantáneo
2. Sin animaciones llamativas
3. Contenido se actualiza inmediatamente
4. Scroll se mantiene o se resetea (según preferencia)

---

## Estados Vacíos y Carga

### Estado Vacío (Sin Inversiones)

- Mensaje: "No hay inversiones registradas"
- Subtítulo: "Comienza agregando tu primera inversión"
- Botón: "Agregar inversión" (botón primario)
- Tipografía: 15px, peso 400, color `#666666`
- Centrado en el área de contenido

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

### Estado Sin Datos en Pestaña

- Mensaje discreto: "No hay información disponible"
- Tipografía: 13px, peso 400, color `#999999`
- Centrado en el área de la pestaña

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 2 columnas en cards de resumen
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

- [ ] Las cards de inversión son comparables visualmente
- [ ] El indicador visual (↑ ↓ =) comunica rendimiento sin color
- [ ] Los filtros son discretos pero accesibles
- [ ] La barra de proyecciones se recalcula en vista detalle
- [ ] El encabezado es claro y prominente
- [ ] Las pestañas son discretas y funcionales
- [ ] Cada pestaña muestra información clara y accionable
- [ ] No hay gráficos ruidosos
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Todo es legible y respirable

---

---

## Integración con Vida Mensual

### Métrica "Meses de Vida Cubiertos" (Nueva)

**Propósito**

Muestra cuántos meses de vida cubre cada inversión. Permite entender el valor de las inversiones en términos de tiempo de vida.

**Por Qué Está Ahí**

El usuario necesita entender sus inversiones en términos de vida mensual. Esta integración responde: "¿Cuántos meses de vida cubre esta inversión? ¿Qué inversión me da más meses de vida?"

**Jerarquía Visual**

**Qué Mira el Ojo Primero:**
1. La métrica "Meses de vida cubiertos" — tiempo cubierto
2. El valor de la inversión — capital invertido
3. La relación con el gasto mensual — referencia

**Diseño Detallado**

**En Vista Detalle de Inversión - Pestaña "Resumen":**

**Nueva Métrica:**

- Label: "MESES DE VIDA CUBIERTOS", 11px, peso 450, color `#999999`, uppercase
- Valor: 20px, peso 600, monospace, color `#000000`, letter-spacing -0.02em
- Cálculo: Valor actual de inversión / Gasto mensual promedio (de Vida Mensual)
- Descripción: "Basado en gasto mensual promedio", 11px, peso 450, color `#666666`
- Posición: Después de "ROI Real"
- Antes de "Estado"
- Espaciado: 24px entre métricas

**En Vista Listado de Inversiones (Opcional):**

**Nueva Columna (Opcional):**

- Header: "MESES", 13px, peso 500, color `#666666`, uppercase
- Valor: 15px, peso 600, monospace, color `#000000`, letter-spacing -0.01em
- Alineación: Derecha
- Ancho: 100px

**Por Qué Este Diseño:**

- Métrica clara y accesible
- Cálculo simple y comprensible
- Integración conceptual, no duplicación
- Visual consistente con el sistema
- Opcional en listado para no sobrecargar

---

**Última actualización**: Diseño completo de Inversiones + Integración Vida Mensual
**Versión**: 1.1
**Estado**: Completo y listo para referencia de implementación

