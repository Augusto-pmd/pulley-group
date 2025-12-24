# Ajustes
## Pulley Group — Centro de Control de Supuestos Patrimoniales

---

## Visión General

La pantalla de Ajustes permite configurar los supuestos globales que utiliza el sistema para calcular proyecciones y ajustes por inflación. Es el centro de control que define cómo Pulley Group interpreta y proyecta el patrimonio.

**Filosofía de Uso**
- Configuración de supuestos patrimoniales (no técnicos)
- Comprensión del impacto de cada ajuste
- Control sobre cómo se calculan las proyecciones
- Sensación de transparencia y control

**Estructura Visual**
- Header fijo (64px)
- Contenido principal con scroll vertical
- Cards limpias con controles claros
- Explicaciones conceptuales, no técnicas
- Advertencias discretas, sin alarmismo

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
│  │ IPC                              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ SUPUESTOS DE PROYECCIÓN          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ HORIZONTES TEMPORALES            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ MONEDA BASE                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ADVERTENCIAS                     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Espaciado Entre Bloques

- Entre encabezado y primera sección: **48px**
- Entre secciones: **64px**
- Bottom padding del contenido: **64px**

---

## 1. Encabezado

### Propósito

Establece el contexto de Ajustes como centro de control de supuestos. Título claro y subtítulo que explica el propósito.

### Por Qué Está Ahí

El usuario necesita entender que esta pantalla controla los supuestos del sistema. El encabezado responde: "¿Qué es esta pantalla? ¿Para qué sirve?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El título "Ajustes" — identificación inmediata
2. El subtítulo "Supuestos del sistema" — explicación del propósito

### Diseño Detallado

**Header de Sección**

- Espaciado superior: 48px (después del header)
- Espaciado inferior: 32px
- Sin borde (el espacio crea la separación)

**Título**

- Texto: "Ajustes", 28px, peso 600, color `#000000`
- Alineación: Izquierda
- Margen inferior: 8px
- **Es el elemento más importante del encabezado**

**Subtítulo**

- Texto: "Supuestos del sistema", 15px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen inferior: 0px
- **Explica el propósito sin tecnicismos**

**Por Qué Este Diseño:**

- Título claro y prominente (28px)
- Subtítulo directo y claro
- Enfatiza "supuestos" para entender el alcance
- Mucho espacio respirable

---

## 2. IPC

### Propósito

Permite configurar el Índice de Precios al Consumidor (IPC) por año y mes. Este dato se usa exclusivamente para calcular ajustes reales (poder adquisitivo).

### Por Qué Está Ahí

El usuario necesita definir el IPC para que el sistema pueda calcular valores reales. Esta configuración responde: "¿Qué IPC usar para ajustar por inflación?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. La tabla de IPC — datos editables
2. La explicación del impacto — para qué se usa
3. Los controles de edición — cómo modificar

### Qué Decisión Habilita

- **Decisión:** ¿Qué IPC usar para calcular valores reales? ¿Cómo afecta esto a mis proyecciones?
- **Información clave:** El IPC define cómo se ajustan los valores por inflación
- **Contexto:** La explicación ayuda a entender el impacto

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "IPC", 18px, peso 600, color `#000000`
- Subtítulo: "Índice de Precios al Consumidor para ajustes reales", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Explicación del Uso**

- Texto: "El IPC se usa exclusivamente para calcular valores reales (poder adquisitivo). No afecta los valores nominales ni las proyecciones base.", 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen superior: 24px
- Margen inferior: 24px
- **Explicación clara del impacto**

**Tabla de IPC Editable**

**Header de Tabla:**
- Altura: 48px
- Fondo: `#FAFAFA`
- Texto: 13px, peso 500, color `#666666`, uppercase, letter-spacing 0.5px
- Borde inferior: `1px solid #E5E5E5`
- Padding: 16px horizontal / 12px vertical

**Columnas:**

1. **Año** (ancho: 100px)
   - Texto: 15px, peso 400, color `#000000`
   - Formato: "YYYY"
   - Alineación: Izquierda
   - No editable (identificador)

2. **Enero** (ancho: 120px)
   - Input editable: 15px, peso 400, color `#000000`, monospace
   - Formato: "XX.X%" o valor numérico
   - Alineación: Derecha
   - Borde: `1px solid #E5E5E5`
   - Focus: Borde `#007AFF`

3. **Febrero** a **Diciembre** (mismo diseño)
   - Inputs editables por mes
   - Mismo estilo que Enero

**Filas:**
- Altura: 48px
- Fondo: `#FFFFFF`
- Padding: 16px horizontal / 12px vertical
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas

**Inputs Editables:**

- Fondo: `#FFFFFF`
- Borde: `1px solid #E5E5E5`
- Bordes redondeados: `6px`
- Padding: 8px vertical / 12px horizontal
- Altura: 32px
- Texto: 15px, peso 400, monospace
- Focus: Borde `#007AFF`, outline sutil
- Placeholder: "0.0"

**Botón Agregar Año (Opcional)**

- Botón texto: "Agregar año", 13px, peso 400, color `#007AFF`
- Hover: Color `#0051D5`
- Posición: Debajo de la tabla, alineado a la derecha
- Margen superior: 16px

**Por Qué Este Diseño:**

- Tabla clara y editable
- Explicación del uso exclusivo para ajustes reales
- Inputs discretos pero accesibles
- Sin tecnicismos, solo información práctica

---

## 3. Supuestos de Proyección

### Propósito

Permite configurar los supuestos de rendimiento para los tres escenarios de proyección: Conservador, Base y Optimista.

### Por Qué Está Ahí

El usuario necesita definir cómo se calculan las proyecciones en cada escenario. Esta configuración responde: "¿Qué supuestos usar para cada escenario?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Los tres escenarios — Conservador, Base, Optimista
2. Los supuestos de cada escenario — valores configurables
3. La explicación conceptual — qué representa cada escenario

### Qué Decisión Habilita

- **Decisión:** ¿Qué supuestos usar para cada escenario? ¿Cómo afectan a mis proyecciones?
- **Información clave:** Los supuestos definen el rango de proyecciones
- **Contexto:** La explicación conceptual ayuda a entender cada escenario

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "SUPUESTOS DE PROYECCIÓN", 18px, peso 600, color `#000000`
- Subtítulo: "Rendimientos esperados por escenario", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Layout Grid 3 Columnas**

```
┌──────────────┬──────────────┬──────────────┐
│ CONSERVADOR  │     BASE     │  OPTIMISTA   │
│              │              │              │
│ Explicación  │ Explicación  │ Explicación  │
│              │              │              │
│ Supuesto     │ Supuesto     │ Supuesto     │
└──────────────┴──────────────┴──────────────┘
```

**Cada Columna (Escenario)**

**Header de Escenario:**
- Título: "CONSERVADOR" / "BASE" / "OPTIMISTA", 15px, peso 600, color `#000000`
- Alineación: Centro
- Margen inferior: 16px

**Explicación Conceptual:**
- Texto: Descripción breve y conceptual del escenario
  - Conservador: "Rendimientos más bajos, menor riesgo"
  - Base: "Rendimientos esperados, riesgo moderado"
  - Optimista: "Rendimientos más altos, mayor riesgo"
- Texto: 13px, peso 400, color `#666666`
- Alineación: Centro
- Margen inferior: 24px

**Input de Supuesto:**
- Label: "Rendimiento esperado", 11px, peso 400, color `#999999`, uppercase, letter-spacing 0.5px
- Input: 15px, peso 400, color `#000000`, monospace
- Formato: "XX.X%" (porcentaje anual)
- Borde: `1px solid #E5E5E5`
- Bordes redondeados: `6px`
- Padding: 8px vertical / 12px horizontal
- Altura: 36px
- Focus: Borde `#007AFF`
- Alineación: Centro
- Ancho: 100% (dentro de la columna)
- Margen inferior: 0px

**Espaciado Entre Columnas**

- Horizontal: 48px
- Los escenarios no se tocan, hay mucho aire

**Nota Conceptual (Debajo del Grid)**

- Texto: "Estos supuestos se aplican a todas las proyecciones del sistema. Ajustarlos cambiará todas las proyecciones futuras.", 11px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 32px

**Por Qué Este Diseño:**

- Grid de 3 columnas permite comparación inmediata
- Explicación conceptual de cada escenario
- Inputs claros y accesibles
- Nota sobre el impacto global
- Sin tecnicismos, solo conceptos claros

---

## 4. Horizontes Temporales

### Propósito

Permite configurar los horizontes temporales disponibles en el sistema (5, 10, 20 años). Estos se usan globalmente en todas las proyecciones.

### Por Qué Está Ahí

El usuario necesita definir qué horizontes temporales quiere usar. Esta configuración responde: "¿Qué horizontes temporales usar para las proyecciones?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. Los horizontes disponibles — 5, 10, 20 años
2. Los controles de activación — habilitar/deshabilitar
3. La explicación del uso global — dónde se aplican

### Qué Decisión Habilita

- **Decisión:** ¿Qué horizontes temporales quiero ver? ¿Cuáles son relevantes para mi planificación?
- **Información clave:** Los horizontes definen el alcance temporal de las proyecciones
- **Contexto:** La explicación ayuda a entender el uso global

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "HORIZONTES TEMPORALES", 18px, peso 600, color `#000000`
- Subtítulo: "Períodos de proyección disponibles globalmente", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Lista de Horizontes**

**Cada Horizonte:**

- Layout horizontal:
  - Label (izquierda)
  - Toggle/Checkbox (derecha)

**Diseño de Cada Fila:**

- Altura: 48px
- Padding: 16px horizontal / 12px vertical
- Fondo: `#FFFFFF`
- Hover: Fondo `#FAFAFA` (muy sutil)
- Sin bordes entre filas

**Elementos:**

1. **Label** (ancho: flexible)
   - Texto: "5 años" / "10 años" / "20 años", 15px, peso 400, color `#000000`
   - Alineación: Izquierda

2. **Toggle/Checkbox** (ancho: 60px)
   - Toggle estilo macOS (opcional)
   - O checkbox simple
   - Alineación: Derecha
   - Estado activo: `#007AFF` (azul sistema)
   - Estado inactivo: `#E5E5E5` (gris claro)

**Explicación del Uso Global:**

- Texto: "Los horizontes habilitados estarán disponibles en todas las proyecciones del sistema: Dashboard, Inversiones, Proyecciones y Fondo Emma.", 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen superior: 24px

**Por Qué Este Diseño:**

- Lista clara y accesible
- Toggles/checkboxes discretos pero funcionales
- Explicación del uso global
- Sin tecnicismos, solo información práctica

---

## 5. Moneda Base

### Propósito

Permite definir la moneda base del sistema. Esta configuración afecta cómo se muestran todos los valores.

### Por Qué Está Ahí

El usuario necesita definir en qué moneda trabajar. Esta configuración responde: "¿En qué moneda mostrar los valores?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El selector de moneda — control principal
2. La explicación del impacto — qué cambia
3. El ejemplo visual — cómo se ve

### Qué Decisión Habilita

- **Decisión:** ¿En qué moneda trabajar? ¿Cómo afecta esto a la visualización?
- **Información clave:** La moneda base define el formato de todos los valores
- **Contexto:** La explicación ayuda a entender el impacto visual

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 32px (vertical) / 32px (horizontal)
- Fondo: `#FFFFFF`
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Header de Card**

- Título: "MONEDA BASE", 18px, peso 600, color `#000000`
- Subtítulo: "Moneda para mostrar todos los valores", 13px, peso 400, color `#666666`
- Padding: 24px (vertical) / 24px (horizontal)
- Borde inferior: `1px solid #F5F5F5`
- Margen inferior: 0px

**Selector de Moneda**

- Label: "Moneda", 15px, peso 500, color `#000000`
- Selector: Dropdown o botones
- Opciones: "Pesos (ARS)", "Dólares (USD)", "Euros (EUR)", etc.
- Diseño: 15px, peso 400, color `#000000`
- Borde: `1px solid #E5E5E5`
- Bordes redondeados: `6px`
- Padding: 12px vertical / 16px horizontal
- Altura: 36px
- Focus: Borde `#007AFF`
- Ancho: 200px
- Margen superior: 16px
- Margen inferior: 24px

**Explicación del Impacto:**

- Texto: "La moneda base afecta cómo se muestran todos los valores en el sistema: Dashboard, Inversiones, Flujos, Proyecciones y Fondo Emma.", 13px, peso 400, color `#666666`
- Alineación: Izquierda
- Margen superior: 0px
- Margen inferior: 16px

**Ejemplo Visual (Opcional):**

- Label: "Ejemplo", 13px, peso 500, color `#000000`
- Valor: 24px, peso 600, color `#000000`, monospace
- Formato: "[Símbolo moneda] X.XXX.XXX"
- Alineación: Izquierda
- Margen superior: 16px
- **Muestra cómo se verá un valor con la moneda seleccionada**

**Por Qué Este Diseño:**

- Selector claro y accesible
- Explicación del impacto visual
- Ejemplo opcional para claridad
- Sin tecnicismos, solo información práctica

---

## 6. Advertencias

### Propósito

Informa al usuario qué cambia al modificar los supuestos. Sin alarmismo, solo información clara.

### Por Qué Está Ahí

El usuario necesita entender el impacto de cambiar los supuestos. Esta sección responde: "¿Qué pasa si cambio estos ajustes?"

### Jerarquía Visual

**Qué Mira el Ojo Primero:**
1. El mensaje de advertencia — información principal
2. La lista de impactos — qué cambia
3. La nota de confirmación — cómo proceder

### Qué Decisión Habilita

- **Decisión:** ¿Debo cambiar estos supuestos? ¿Entiendo el impacto?
- **Información clave:** Las advertencias ayudan a tomar decisiones informadas
- **Contexto:** Sin alarmismo, solo claridad sobre el impacto

### Diseño Detallado

**Card Contenedora**

- Tipo: Card Simple
- Padding: 24px (vertical) / 24px (horizontal)
- Fondo: `#FAFAFA` (muy sutil, para diferenciación)
- Sombra: `0px 1px 3px rgba(0, 0, 0, 0.08)`
- Bordes redondeados: `8px`
- Ancho: 100%

**Título**

- Texto: "Al modificar supuestos", 15px, peso 500, color `#000000`
- Alineación: Izquierda
- Margen inferior: 16px

**Lista de Impactos**

**Cada Impacto:**

- Layout horizontal:
  - Bullet (izquierda)
  - Texto (derecha)

**Diseño de Cada Fila:**

- Bullet: `·` (punto medio), 15px, color `#666666`
- Texto: 13px, peso 400, color `#666666`
- Espaciado: 8px entre bullet y texto
- Alineación: Izquierda
- Margen inferior: 8px

**Ejemplos de Impactos:**

- "Las proyecciones se recalcularán automáticamente"
- "Los valores reales (IPC) se actualizarán"
- "Los escenarios (Conservador, Base, Optimista) reflejarán los nuevos supuestos"
- "Los horizontes temporales estarán disponibles según la configuración"

**Nota de Confirmación (Opcional)**

- Texto: "Los cambios se guardan automáticamente. Puedes revertirlos en cualquier momento.", 11px, peso 400, color `#999999`
- Alineación: Izquierda
- Margen superior: 16px

**Por Qué Este Diseño:**

- Card con fondo sutil para diferenciación
- Lista clara de impactos
- Sin alarmismo, solo información
- Nota de confirmación opcional para tranquilidad
- Diseño discreto pero informativo

---

## Flujo de Lectura de la Pantalla

### Orden Natural de la Mirada

1. **Encabezado** (título y subtítulo)
   - El usuario entiende el propósito de Ajustes
   - Responde: "¿Qué es esta pantalla?"

2. **IPC** (primer bloque)
   - El usuario configura el IPC para ajustes reales
   - Responde: "¿Qué IPC usar?"

3. **Supuestos de Proyección** (segundo bloque)
   - El usuario configura los escenarios
   - Responde: "¿Qué supuestos usar?"

4. **Horizontes Temporales** (tercer bloque)
   - El usuario habilita horizontes
   - Responde: "¿Qué horizontes usar?"

5. **Moneda Base** (cuarto bloque)
   - El usuario define la moneda
   - Responde: "¿En qué moneda trabajar?"

6. **Advertencias** (último bloque)
   - El usuario entiende el impacto
   - Responde: "¿Qué cambia al modificar?"

### Tiempo de Lectura

- **Lectura rápida (30 segundos):** Encabezado + Revisión de bloques
- **Lectura media (2 minutos):** Todo lo anterior + Configuración básica
- **Lectura completa (5 minutos):** Todo lo anterior + Configuración detallada + Revisión de advertencias

---

## Estados y Validación

### Estado de Cambios No Guardados

- Indicador discreto: "Cambios sin guardar", 13px, peso 400, color `#666666`
- Posición: Arriba a la derecha del contenido
- **Los cambios se guardan automáticamente, este indicador es opcional**

### Validación de Inputs

- Input inválido: Borde `#FF3B30` (rojo sistema)
- Mensaje de error: 11px, peso 400, color `#FF3B30`
- Posición: Debajo del input
- **Solo para errores críticos, no para advertencias**

### Estado de Carga

- Skeleton loaders muy sutiles (gris muy claro `#F5F5F5`)
- Sin animaciones llamativas
- Los elementos aparecen con fade in (200ms)

---

## Responsive y Adaptaciones

### Desktop (1440px+)

- Layout completo como se describe
- Grid de 3 columnas en supuestos de proyección
- Todo el contenido visible con scroll vertical

### Large Desktop (1920px+)

- Mismo diseño, más espacio lateral
- El contenido se centra (máximo 1200px)
- Más espacio respirable

### Tablet (1024px - 1439px)

- Grids se convierten en 1 columna
- Las cards se apilan verticalmente
- El espaciado se mantiene
- La tabla de IPC puede requerir scroll horizontal

---

## Checklist de Implementación

Antes de implementar, verificar:

- [ ] El encabezado es claro (Ajustes - Supuestos del sistema)
- [ ] La tabla de IPC es editable por año/mes
- [ ] La explicación del IPC es clara (uso exclusivo para ajustes reales)
- [ ] Los supuestos de proyección son conceptuales, no técnicos
- [ ] Los horizontes temporales son configurables
- [ ] La moneda base tiene impacto visual claro
- [ ] Las advertencias son informativas, sin alarmismo
- [ ] No hay lógica financiera dura expuesta
- [ ] No hay tecnicismos innecesarios
- [ ] El espaciado sigue múltiplos de 4px
- [ ] La tipografía usa los tamaños y pesos correctos
- [ ] Los inputs son claros y accesibles
- [ ] Todo es legible y respirable

---

**Última actualización**: Diseño completo de Ajustes
**Versión**: 1.0
**Estado**: Completo y listo para referencia de implementación

