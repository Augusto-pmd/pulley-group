import type { Metadata } from 'next';
import { ModeProvider } from '@/contexts/ModeContext';
import { RingDataProvider } from '@/contexts/RingDataContext';
import { CircularNavigationProvider } from '@/contexts/CircularNavigationContext';
import CommandPalette from '@/components/CommandPalette';
import CommandPaletteHint from '@/components/CommandPaletteHint';
import Ring from '@/components/Ring';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Pulley Group',
  description: 'Sistema de gestión patrimonial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <ModeProvider>
          <RingDataProvider>
            <CircularNavigationProvider>
              {/* Fondo vivo con blobs flotantes */}
              <BackgroundBlobs />
            
            {/* Contenedor principal flotante - TODO es circular, nada rectangular */}
            <div className="relative min-h-screen">
              <CommandPalette />
              <CommandPaletteHint />
              <Ring />
              {/* El main solo existe para Next.js routing, pero no renderiza contenido visible */}
              <main className="relative z-10 min-h-screen" style={{ pointerEvents: 'none' }}>
                {children}
              </main>
            </div>
            </CircularNavigationProvider>
          </RingDataProvider>
        </ModeProvider>
      </body>
    </html>
  );
}

