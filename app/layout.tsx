import type { Metadata } from 'next';
import { ModeProvider } from '@/contexts/ModeContext';
import { RingDataProvider } from '@/contexts/RingDataContext';
import { CircularNavigationProvider } from '@/contexts/CircularNavigationContext';
import { NavigationStateProvider } from '@/contexts/NavigationStateContext';
import CommandPalette from '@/components/CommandPalette';
import CommandPaletteHint from '@/components/CommandPaletteHint';
import Ring from '@/components/Ring';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import MainContent from '@/components/MainContent';
import ViewportOverlay from '@/components/ViewportOverlay';
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
              <NavigationStateProvider>
                {/* Fondo vivo con blobs flotantes */}
                <BackgroundBlobs />
              
              {/* VIEWPORT FRAME - Marco cerrado que contiene todo el sistema */}
              <div 
                className="relative"
                style={{
                  width: '100vw',
                  height: '100vh',
                  overflow: 'hidden',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                }}
              >
                <CommandPalette />
                <CommandPaletteHint />
                <ViewportOverlay />
                <Ring />
                {/* Contenido principal - controla overflow según estado */}
                <MainContent>
                  {children}
                </MainContent>
              </div>
              </NavigationStateProvider>
            </CircularNavigationProvider>
          </RingDataProvider>
        </ModeProvider>
      </body>
    </html>
  );
}

