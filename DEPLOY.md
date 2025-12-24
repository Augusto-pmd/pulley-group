# Guía de Deploy Preview - Pulley Group

Esta guía explica cómo hacer deploy de Pulley Group a Vercel para pruebas online.

## Estado del Proyecto

✅ **Listo para Deploy**
- Next.js 14 configurado
- TypeScript compilando correctamente
- Sin variables de entorno sensibles
- Sin backend ni base de datos (100% mock)
- Sin secrets ni API keys

## Pre-requisitos

1. **Cuenta de GitHub** con el repositorio subido
2. **Cuenta de Vercel** (gratis, se crea en https://vercel.com)
3. **Proyecto compilando localmente** sin errores

## Paso 1: Verificar Build Local

```bash
# Instalar dependencias (si no están instaladas)
npm install

# Ejecutar build
npm run build

# Si el build es exitoso, continuar
```

## Paso 2: Preparar Repositorio GitHub

### 2.1 Verificar estado de Git

```bash
# Ver estado actual
git status

# Si hay cambios sin commitear, hacer commit
git add .
git commit -m "Pre-deploy: preparar para preview en Vercel"
```

### 2.2 Push a GitHub

```bash
# Asegurarse de estar en la rama principal (main o master)
git checkout main  # o master según tu repo

# Push al repositorio remoto
git push origin main
```

## Paso 3: Crear Proyecto en Vercel

### 3.1 Acceder a Vercel

1. Ir a https://vercel.com
2. Iniciar sesión con tu cuenta de GitHub (o crear cuenta nueva)
3. Click en **"Add New..."** → **"Project"**

### 3.2 Importar Repositorio

1. Seleccionar el repositorio `pulley-group` desde la lista
2. Si no aparece, click en **"Adjust GitHub App Permissions"** y autorizar acceso

### 3.3 Configurar Proyecto

**Framework Preset**: Vercel detecta automáticamente "Next.js" ✅

**Root Directory**: Dejar vacío (default: `./`)

**Build Command**: Dejar default (`npm run build`) ✅

**Output Directory**: Dejar default (auto-detectado) ✅

**Install Command**: Dejar default (`npm install`) ✅

### 3.4 Variables de Entorno

**NO configurar ninguna variable de entorno** por ahora. El proyecto funciona 100% con mocks y no necesita variables.

### 3.5 Deploy

1. Click en **"Deploy"**
2. Esperar a que termine el build (2-3 minutos)
3. Cuando termine, se mostrará la URL pública

## Paso 4: Verificar Deploy

### 4.1 URL Pública

Vercel proporcionará una URL como:
```
https://pulley-group-abc123.vercel.app
```

### 4.2 Navegación de Verificación

Abrir la URL y verificar:

1. **Dashboard** (`/`)
   - Debe cargar sin errores
   - Estado patrimonial visible
   - Distribución visible

2. **Vida Mensual** (`/vida-mensual`)
   - Formulario de carga funcional
   - Tabla de eventos visible

3. **Inversiones** (`/investments`)
   - Lista de inversiones visible
   - Formulario de creación funcional

4. **Proyecciones** (`/projections`)
   - Barra de escenarios visible
   - Gráficos de proyección cargando

5. **Emma** (`/emma`)
   - Estado actual del fondo visible
   - Variables de proyección editables

6. **Activos** (`/activos`)
   - Lista de activos visible
   - Panel de edición funcional

7. **Vista Contador** (`/vista-contador`)
   - Estado fiscal visible

### 4.3 Verificar Consola del Navegador

1. Abrir DevTools (F12)
2. Ir a la pestaña **Console**
3. **NO debe haber errores** (warnings están OK)

## Paso 5: Configuración Adicional (Opcional)

### 5.1 Custom Domain

Si quieres usar un dominio personalizado:
1. Ir a **Settings** → **Domains**
2. Agregar dominio personalizado
3. Configurar DNS según las instrucciones

### 5.2 Environment Variables (Futuro)

Si en el futuro necesitas variables de entorno:
1. Ir a **Settings** → **Environment Variables**
2. Agregar variables necesarias
3. Re-deploy para aplicar cambios

### 5.3 Preview Deployments

Cada push a GitHub creará automáticamente un preview deployment:
- Branch `main`: Deploy a producción
- Otros branches: Deploy a preview (URL única por branch)

## Troubleshooting

### Build Falla en Vercel

**Error**: Build fails con error de TypeScript
**Solución**: Verificar que el build local funciona primero

**Error**: Module not found
**Solución**: Verificar que todas las dependencias están en `package.json`

### Página en Blanco

**Causa**: Error de runtime no capturado
**Solución**: Revisar logs en Vercel Dashboard → Deployments → Logs

### Estilos No Cargan

**Causa**: Problema con Tailwind CSS
**Solución**: Verificar que `tailwind.config.js` está en la raíz

## Notas Importantes

⚠️ **Este es un PREVIEW, no producción**
- URL pública accesible
- Sin datos sensibles
- Sin backend real
- Perfecto para pruebas de UX

🔒 **Seguridad**
- No hay secrets en el código
- No hay API keys
- No hay datos personales reales
- Todo es mock data

📊 **Performance**
- Vercel CDN automático
- Builds optimizados
- Fast refresh en previews

## Siguiente Paso

Una vez el deploy esté funcionando:
1. Compartir URL con usuarios de prueba
2. Recopilar feedback
3. Iterar sobre el código
4. Cada push nuevo generará un nuevo deploy automático

