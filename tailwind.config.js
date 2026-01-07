/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial - Sistema de gobierno patrimonial
        'sand-primary': '#D6C3A3', // Arena cálido mate - fondo cards protagonistas
        'graphite-bg': '#2E2E2C', // Grafito cálido profundo - fondo general
        'petrol-header': '#1F2A33', // Azul petróleo muy oscuro - fondo técnico/headers
        'gold-accent': '#B59A6A', // Dorado/latón apagado - acento único
        'text-primary': '#F5F2EC', // Blanco cálido - texto principal claro
        'text-secondary': '#8E8E8A', // Gris suave - texto secundario
        // Compatibilidad con código existente
        'gray-bg': '#2E2E2C',
        'gray-text-primary': '#F5F2EC',
        'gray-text-secondary': '#8E8E8A',
        'gray-text-tertiary': '#8E8E8A',
        'gray-text-disabled': '#8E8E8A',
        'gray-border': 'rgba(142, 142, 138, 0.2)',
        'gray-border-visible': 'rgba(142, 142, 138, 0.3)',
        'gray-divider': 'rgba(142, 142, 138, 0.15)',
        // Acento único - dorado
        'blue-system': '#B59A6A',
        'blue-hover': '#A0885A',
        'blue-bg-hover': 'rgba(181, 154, 106, 0.1)',
        // Estados de sistema - sutiles
        'red-error': 'rgba(181, 154, 106, 0.6)',
        'green-success': 'rgba(181, 154, 106, 0.6)',
        'orange-warning': 'rgba(181, 154, 106, 0.6)',
      },
      fontFamily: {
        // Familia principal: Humanista-futura, Apple-compatible
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
        // Display: Para títulos y números clave (más presencia, más aire)
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Inter Display',
          'system-ui',
          'sans-serif'
        ],
        // Text: Para lectura (más legible, más suave)
        text: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        // Mono: Para números (escultórico, tabular)
        mono: [
          'SF Mono',
          'Monaco',
          'Menlo',
          'JetBrains Mono',
          'monospace'
        ],
      },
      fontSize: {
        // Display - Tracking más abierto, pesos reducidos
        'display-1': ['48px', { 
          lineHeight: '1.1', 
          fontWeight: '520', // Reducido de 550
          letterSpacing: '0.01em', // Aumentado de -0.02em
          fontFamily: 'var(--font-display)'
        }],
        'display-2': ['36px', { 
          lineHeight: '1.1', 
          fontWeight: '520', // Reducido de 550
          letterSpacing: '0.015em', // Aumentado de -0.015em
          fontFamily: 'var(--font-display)'
        }],
        'display-3': ['28px', { 
          lineHeight: '1.15', 
          fontWeight: '520', // Reducido de 550
          letterSpacing: '0.02em', // Aumentado de -0.01em
          fontFamily: 'var(--font-display)'
        }],
        // Headings - Tracking más abierto, pesos reducidos
        'heading-1': ['24px', { 
          lineHeight: '1.2', 
          fontWeight: '520', // Reducido de 550
          letterSpacing: '0.01em', // Aumentado de -0.01em
          fontFamily: 'var(--font-display)'
        }],
        'heading-2': ['20px', { 
          lineHeight: '1.25', 
          fontWeight: '500', // Reducido de 520
          letterSpacing: '0.015em', // Aumentado de -0.005em
          fontFamily: 'var(--font-display)'
        }],
        'heading-3': ['18px', { 
          lineHeight: '1.3', 
          fontWeight: '480', // Reducido de 500
          letterSpacing: '0.02em', // Aumentado de 0em
          fontFamily: 'var(--font-display)'
        }],
        'heading-4': ['16px', { 
          lineHeight: '1.3', 
          fontWeight: '480', // Reducido de 500
          letterSpacing: '0.02em', // Aumentado de 0em
          fontFamily: 'var(--font-text)'
        }],
        // Body - Tracking más abierto, pesos más livianos
        'body-large': ['15px', { 
          lineHeight: '1.6', 
          fontWeight: '420', // Reducido de 450
          letterSpacing: '0.02em', // Aumentado de 0.01em
          fontFamily: 'var(--font-text)'
        }],
        'body': ['13px', { 
          lineHeight: '1.6', 
          fontWeight: '420', // Reducido de 450
          letterSpacing: '0.025em', // Aumentado de 0.01em
          fontFamily: 'var(--font-text)'
        }],
        'body-small': ['12px', { 
          lineHeight: '1.6', 
          fontWeight: '420', // Reducido de 450
          letterSpacing: '0.03em', // Aumentado de 0.015em
          fontFamily: 'var(--font-text)'
        }],
        'caption': ['11px', { 
          lineHeight: '1.5', 
          fontWeight: '420', // Reducido de 450
          letterSpacing: '0.04em', // Aumentado de 0.02em
          fontFamily: 'var(--font-text)'
        }],
        // Números - Sistema separado, como objetos de diseño futurista
        // Display: Números grandes, sólidos pero suaves, tracking positivo
        'number-display': ['48px', {
          lineHeight: '1.05', // Más compacto verticalmente
          fontWeight: '550', // Peso intermedio sólido pero suave
          letterSpacing: '0.04em', // Tracking positivo, más aire lateral
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1, "ss01" 1',
        }],
        // Large: Números grandes secundarios
        'number-large': ['32px', {
          lineHeight: '1.08',
          fontWeight: '540', // Peso intermedio
          letterSpacing: '0.035em', // Tracking positivo
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1',
        }],
        // Medium: Números medianos
        'number-medium': ['24px', {
          lineHeight: '1.1',
          fontWeight: '520', // Peso intermedio más liviano
          letterSpacing: '0.03em', // Tracking positivo
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1',
        }],
        // Regular: Números pequeños
        'number-regular': ['18px', {
          lineHeight: '1.15',
          fontWeight: '500', // Peso intermedio
          letterSpacing: '0.025em', // Tracking positivo
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1',
        }],
        // Small: Números muy pequeños
        'number-small': ['15px', {
          lineHeight: '1.2',
          fontWeight: '480', // Peso intermedio más liviano
          letterSpacing: '0.02em', // Tracking positivo
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1, "zero" 1',
        }],
      },
      spacing: {
        // Sistema de espaciado basado en 4px
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '3': '24px',
        '4': '32px',
        '6': '48px',
        '8': '64px',
      },
      boxShadow: {
        // Sombras sutiles - sin efectos fuertes
        'card': '0px 2px 8px rgba(0, 0, 0, 0.15)',
        'card-hover': '0px 4px 12px rgba(0, 0, 0, 0.2)',
        'floating': '0px 2px 6px rgba(0, 0, 0, 0.12)',
        'ambient': '0px 0px 20px rgba(0, 0, 0, 0.1)',
        'ambient-light': '0px 0px 20px rgba(0, 0, 0, 0.1)',
        'blob-soft': '0px 0px 20px rgba(0, 0, 0, 0.1)',
        'blob-soft-color': '0px 0px 20px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'card': '40px',
        'bar': '60px',
        'subtle': '20px',
        'blob': '120px',
      },
      borderColor: {
        'black/5': 'rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'card': '24px',
        'card-large': '32px',
        'container': '32px',
        'container-large': '40px',
        'capsule': '9999px',
        'button': '12px',
        'input': '12px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
      },
    },
  },
  plugins: [],
}

