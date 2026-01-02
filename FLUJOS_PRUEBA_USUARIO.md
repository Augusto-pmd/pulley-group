# FLUJOS COMPLETOS DE PRUEBA — PULLEY GROUP v1

## Servidor de Desarrollo
- **URL**: http://localhost:3000
- **Estado**: Iniciado en background

---

## FLUJO 1: VIDA MENSUAL — CICLO COMPLETO

### Objetivo
Probar el flujo completo de gestión mensual: crear mes, agregar movimientos, editar, eliminar y cerrar mes.

### Pasos a Seguir

#### 1.1. Navegación Inicial
- [ ] Abrir http://localhost:3000
- [ ] Verificar que el Dashboard carga sin errores
- [ ] Hacer clic en "Vida Mensual" en el header
- [ ] Verificar que la página carga correctamente

#### 1.2. Selección de Mes
- [ ] Verificar que el selector de mes muestra el mes actual
- [ ] Cambiar a un mes anterior (ej: mes pasado)
- [ ] Verificar que los movimientos se cargan (o muestra lista vacía si no hay datos)
- [ ] Cambiar a un mes futuro
- [ ] Verificar que se puede crear un mes nuevo automáticamente

#### 1.3. Crear Ingreso
- [ ] Hacer clic en "Agregar Ingreso" o botón equivalente
- [ ] Completar formulario:
  - [ ] Concepto: "Salario"
  - [ ] Monto: 5000 USD
  - [ ] Fecha: Fecha del mes seleccionado
  - [ ] Estado: Pagado
- [ ] Guardar
- [ ] Verificar que el ingreso aparece en la lista
- [ ] Verificar que el resultado neto se actualiza

#### 1.4. Crear Egreso
- [ ] Hacer clic en "Agregar Egreso" o botón equivalente
- [ ] Completar formulario:
  - [ ] Concepto: "Alquiler"
  - [ ] Monto: 1500 USD
  - [ ] Fecha: Fecha del mes seleccionado
  - [ ] Estado: Pagado
- [ ] Guardar
- [ ] Verificar que el egreso aparece en la lista
- [ ] Verificar que el resultado neto se actualiza (debe mostrar diferencia)

#### 1.5. Editar Movimiento
- [ ] Hacer clic en un movimiento existente (ingreso o egreso)
- [ ] Verificar que se abre el panel de edición
- [ ] Cambiar el monto (ej: de 5000 a 5500)
- [ ] Guardar cambios
- [ ] Verificar que el movimiento se actualiza en la lista
- [ ] Verificar que el resultado neto se recalcula

#### 1.6. Cambiar Estado de Movimiento
- [ ] Abrir un movimiento en el panel de edición
- [ ] Cambiar estado de "Pagado" a "Pendiente" (o viceversa)
- [ ] Guardar
- [ ] Verificar que el estado se actualiza visualmente
- [ ] Verificar que el resultado neto se ajusta según estado

#### 1.7. Eliminar Movimiento
- [ ] Abrir un movimiento en el panel de edición
- [ ] Hacer clic en botón "Eliminar"
- [ ] Confirmar eliminación (si hay confirmación)
- [ ] Verificar que el movimiento desaparece de la lista
- [ ] Verificar que el resultado neto se actualiza

#### 1.8. Cerrar Mes
- [ ] Verificar que hay movimientos en el mes
- [ ] Hacer clic en botón "Cerrar Mes" o equivalente
- [ ] Confirmar cierre (si hay confirmación)
- [ ] Verificar que el estado del mes cambia a "Cerrado"
- [ ] Verificar que no se pueden agregar movimientos nuevos (o se muestra mensaje apropiado)

#### 1.9. Ver Mes Cerrado
- [ ] Seleccionar un mes cerrado
- [ ] Verificar que se muestran todos los movimientos
- [ ] Verificar que el estado muestra "Cerrado"
- [ ] Verificar que no se pueden editar movimientos (o se muestra mensaje apropiado)

#### 1.10. Recargar Página
- [ ] Recargar la página (F5)
- [ ] Verificar que todos los datos persisten
- [ ] Verificar que el mes seleccionado se mantiene
- [ ] Verificar que los movimientos se cargan correctamente

---

## FLUJO 2: ACTIVOS — GESTIÓN PATRIMONIAL

### Objetivo
Probar el flujo completo de gestión de activos: crear activo, agregar valuación, ver pasivo.

### Pasos a Seguir

#### 2.1. Navegación
- [ ] Desde el header, hacer clic en "Activos"
- [ ] Verificar que la página carga correctamente
- [ ] Verificar que muestra lista de activos (vacía o con datos existentes)

#### 2.2. Crear Activo
- [ ] Hacer clic en botón "Agregar Activo" o equivalente
- [ ] Completar formulario:
  - [ ] Nombre: "Departamento Centro"
  - [ ] Tipo: "Inmueble"
  - [ ] Estado Fiscal: "Declarado"
  - [ ] Valor Inicial: 150000 USD
  - [ ] Fecha Valuación: Fecha actual
- [ ] Guardar
- [ ] Verificar que el activo aparece en la lista
- [ ] Verificar que el total de activos se actualiza

#### 2.3. Ver Detalle de Activo
- [ ] Hacer clic en un activo de la lista
- [ ] Verificar que se abre el panel lateral de edición
- [ ] Verificar que muestra:
  - [ ] Nombre del activo
  - [ ] Tipo
  - [ ] Estado fiscal
  - [ ] Valor actual
  - [ ] Fecha de última valuación

#### 2.4. Agregar Valuación
- [ ] Con el panel de edición abierto
- [ ] Ir a sección "Valuaciones"
- [ ] Completar formulario:
  - [ ] Valor: 160000 USD
  - [ ] Fecha: Fecha actual
- [ ] Guardar
- [ ] Verificar que la valuación aparece en el historial
- [ ] Verificar que el valor actual del activo se actualiza

#### 2.5. Ver Historial de Valuaciones
- [ ] En el panel de edición, verificar que se muestra el historial
- [ ] Verificar que las valuaciones están ordenadas por fecha (más reciente primero)
- [ ] Verificar que se muestran todas las valuaciones creadas

#### 2.6. Editar Propiedades del Activo
- [ ] En el panel de edición, cambiar el nombre del activo
- [ ] Verificar que el cambio se guarda (puede ser solo en estado local)
- [ ] Cambiar el tipo del activo
- [ ] Verificar que el cambio se refleja
- [ ] Cambiar el estado fiscal
- [ ] Verificar que el cambio se refleja

#### 2.7. Ver Pasivo Asociado (si existe)
- [ ] Si el activo tiene un pasivo asociado, verificar que se muestra:
  - [ ] Monto financiado
  - [ ] Valor de cuota
  - [ ] Cuotas restantes / totales
  - [ ] Saldo pendiente
- [ ] Verificar que el patrimonio neto se calcula correctamente (valor - pasivo)

#### 2.8. Navegar Entre Activos
- [ ] Cerrar el panel de edición
- [ ] Hacer clic en otro activo
- [ ] Verificar que el panel se abre con los datos del nuevo activo
- [ ] Verificar que los datos se cargan correctamente

#### 2.9. Recargar Página
- [ ] Recargar la página (F5)
- [ ] Verificar que todos los activos persisten
- [ ] Verificar que las valuaciones persisten
- [ ] Verificar que los pasivos persisten

---

## FLUJO 3: INVERSIONES — GESTIÓN DE CAPITAL

### Objetivo
Probar el flujo completo de gestión de inversiones: crear inversión, agregar eventos, ver métricas.

### Pasos a Seguir

#### 3.1. Navegación
- [ ] Desde el header, hacer clic en "Inversiones"
- [ ] Verificar que la página carga correctamente
- [ ] Verificar que muestra lista de inversiones (vacía o con datos existentes)

#### 3.2. Crear Inversión
- [ ] Hacer clic en botón "Agregar Inversión" o equivalente
- [ ] Completar formulario:
  - [ ] Nombre: "Fondo Indexado S&P 500"
  - [ ] Tipo: "Financiera"
  - [ ] Fecha Inicio: Fecha actual
  - [ ] Monto Objetivo: 10000 USD
- [ ] Guardar
- [ ] Verificar que la inversión aparece en la lista
- [ ] Verificar que las métricas iniciales se muestran

#### 3.3. Ver Detalle de Inversión
- [ ] Hacer clic en una inversión de la lista
- [ ] Verificar que se navega a la página de detalle
- [ ] Verificar que muestra:
  - [ ] Nombre de la inversión
  - [ ] Tipo
  - [ ] Capital
  - [ ] Resultado
  - [ ] ROI nominal
  - [ ] ROI real

#### 3.4. Agregar Evento - Aporte
- [ ] En la página de detalle, ir a sección de eventos
- [ ] Hacer clic en "Agregar Evento" o equivalente
- [ ] Seleccionar tipo: "Aporte"
- [ ] Completar:
  - [ ] Monto: 5000 USD
  - [ ] Fecha: Fecha actual
  - [ ] Nota (opcional): "Aporte inicial"
- [ ] Guardar
- [ ] Verificar que el evento aparece en el historial
- [ ] Verificar que el capital se actualiza
- [ ] Verificar que el resultado se actualiza

#### 3.5. Agregar Evento - Retiro
- [ ] Agregar nuevo evento
- [ ] Seleccionar tipo: "Retiro"
- [ ] Completar:
  - [ ] Monto: 1000 USD
  - [ ] Fecha: Fecha actual
  - [ ] Nota (opcional): "Retiro parcial"
- [ ] Guardar
- [ ] Verificar que el evento aparece en el historial
- [ ] Verificar que el capital se reduce
- [ ] Verificar que el resultado se actualiza

#### 3.6. Agregar Evento - Ajuste
- [ ] Agregar nuevo evento
- [ ] Seleccionar tipo: "Ajuste"
- [ ] Completar:
  - [ ] Monto: 500 USD (positivo para ganancia, negativo para pérdida)
  - [ ] Fecha: Fecha actual
  - [ ] Nota (opcional): "Ajuste de valuación"
- [ ] Guardar
- [ ] Verificar que el evento aparece en el historial
- [ ] Verificar que el resultado se actualiza (pero no el capital)
- [ ] Verificar que el ROI se recalcula

#### 3.7. Ver Métricas Calculadas
- [ ] Verificar que se muestran:
  - [ ] Capital total (suma de aportes - retiros)
  - [ ] Resultado (capital + ajustes)
  - [ ] ROI nominal (resultado / capital * 100)
  - [ ] ROI real (ajustado por inflación)
- [ ] Verificar que los cálculos son correctos

#### 3.8. Ver Historial de Eventos
- [ ] Verificar que el historial muestra todos los eventos
- [ ] Verificar que están ordenados por fecha (más reciente primero)
- [ ] Verificar que se muestran tipo, monto, fecha y nota de cada evento

#### 3.9. Navegar Entre Inversiones
- [ ] Volver a la lista de inversiones
- [ ] Hacer clic en otra inversión
- [ ] Verificar que se carga el detalle correcto
- [ ] Verificar que los eventos se cargan correctamente

#### 3.10. Recargar Página
- [ ] Recargar la página (F5)
- [ ] Verificar que todas las inversiones persisten
- [ ] Verificar que todos los eventos persisten
- [ ] Verificar que las métricas se calculan correctamente

---

## FLUJO 4: NAVEGACIÓN ENTRE MÓDULOS

### Objetivo
Probar la navegación fluida entre todos los módulos del sistema.

### Pasos a Seguir

#### 4.1. Navegación desde Header
- [ ] Desde cualquier página, hacer clic en "Dashboard"
- [ ] Verificar que carga correctamente
- [ ] Hacer clic en "Vida Mensual"
- [ ] Verificar que carga correctamente
- [ ] Hacer clic en "Activos"
- [ ] Verificar que carga correctamente
- [ ] Hacer clic en "Inversiones"
- [ ] Verificar que carga correctamente

#### 4.2. Navegación con Datos
- [ ] Crear datos en Vida Mensual (movimientos)
- [ ] Navegar a Activos
- [ ] Verificar que los datos de Vida Mensual persisten
- [ ] Crear datos en Activos (activo + valuación)
- [ ] Navegar a Inversiones
- [ ] Verificar que los datos de Activos persisten
- [ ] Crear datos en Inversiones (inversión + eventos)
- [ ] Navegar al Dashboard
- [ ] Verificar que todos los datos persisten

#### 4.3. Recarga de Página
- [ ] En cualquier módulo, recargar la página (F5)
- [ ] Verificar que los datos persisten
- [ ] Verificar que la navegación sigue funcionando
- [ ] Verificar que no hay errores en consola

#### 4.4. Navegación Rápida
- [ ] Hacer clic rápido entre módulos (Dashboard → Vida Mensual → Activos → Inversiones)
- [ ] Verificar que no hay errores
- [ ] Verificar que cada página carga correctamente
- [ ] Verificar que los datos se mantienen

---

## FLUJO 5: VALIDACIÓN DE PERSISTENCIA

### Objetivo
Verificar que todos los datos persisten correctamente en la base de datos.

### Pasos a Seguir

#### 5.1. Crear Datos en Todos los Módulos
- [ ] Vida Mensual: Crear 2 ingresos y 2 egresos
- [ ] Activos: Crear 2 activos con valuaciones
- [ ] Inversiones: Crear 2 inversiones con eventos

#### 5.2. Cerrar y Reiniciar Servidor
- [ ] Detener el servidor (Ctrl+C)
- [ ] Reiniciar el servidor (`npm run dev`)
- [ ] Abrir http://localhost:3000

#### 5.3. Verificar Persistencia
- [ ] Navegar a Vida Mensual
- [ ] Verificar que los movimientos persisten
- [ ] Navegar a Activos
- [ ] Verificar que los activos y valuaciones persisten
- [ ] Navegar a Inversiones
- [ ] Verificar que las inversiones y eventos persisten

#### 5.4. Verificar en Prisma Studio
- [ ] Abrir Prisma Studio (`npx prisma studio`)
- [ ] Verificar tablas:
  - [ ] `Month` - meses creados
  - [ ] `Movement` - movimientos creados
  - [ ] `Asset` - activos creados
  - [ ] `AssetValuation` - valuaciones creadas
  - [ ] `Investment` - inversiones creadas
  - [ ] `InvestmentEvent` - eventos creados
- [ ] Verificar que los datos coinciden con lo creado en la UI

---

## CHECKLIST FINAL

### Funcionalidad
- [ ] Todos los flujos funcionan sin errores
- [ ] Los datos persisten correctamente
- [ ] La navegación es fluida
- [ ] No hay acciones que "no hacen nada"
- [ ] No hay inconsistencias entre módulos

### Errores
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en consola del servidor
- [ ] No hay errores de TypeScript
- [ ] No hay errores de linting

### UX
- [ ] Las acciones tienen feedback visual
- [ ] Los estados de loading se muestran correctamente
- [ ] Los mensajes de error son claros
- [ ] La navegación es intuitiva

---

## NOTAS DE PRUEBA

### Errores Encontrados
(Registrar aquí cualquier error encontrado durante las pruebas)

### Observaciones
(Registrar aquí cualquier observación sobre el comportamiento del sistema)

### Mejoras Sugeridas
(Registrar aquí sugerencias de mejora, si las hay)

---

**Fecha de Prueba**: _______________  
**Probado por**: _______________  
**Estado Final**: _______________

