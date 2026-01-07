import type { Metadata } from 'next';
import { ModeProvider } from '@/contexts/ModeContext';
import { RingDataProvider } from '@/contexts/RingDataContext';
import { CircularNavigationProvider } from '@/contexts/CircularNavigationContext';
import { NavigationStateProvider } from '@/contexts/NavigationStateContext';
import CommandPalette from '@/components/CommandPalette';
import CommandPaletteHint from '@/components/CommandPaletteHint';
import Shell from '@/components/Shell';
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
              <NavigationStateProvider>
                {/* Fondo vivo con blobs flotantes */}
                <BackgroundBlobs />
              
                {/* Shell único del sistema */}
                <Shell>
                  <CommandPalette />
                  <CommandPaletteHint />
                  {children}
                </Shell>
              </NavigationStateProvider>
            </CircularNavigationProvider>
          </RingDataProvider>
        </ModeProvider>
      </body>
    </html>
  );
}

