import type { Metadata } from 'next';
import { ModeProvider } from '@/contexts/ModeContext';
import { RingDataProvider } from '@/contexts/RingDataContext';
import ProjectionsBar from '@/components/ProjectionsBar';
import CommandPalette from '@/components/CommandPalette';
import FloatingNav from '@/components/FloatingNav';
import CommandPaletteHint from '@/components/CommandPaletteHint';
import Ring from '@/components/Ring';
import ModeSelector from '@/components/ModeSelector';
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
            {/* Fondo vivo con blobs flotantes */}
            <BackgroundBlobs />
          
          {/* Contenedor principal flotante */}
          <div className="relative z-10 min-h-screen">
            <ProjectionsBar />
            <CommandPalette />
            <FloatingNav />
            <CommandPaletteHint />
            <Ring />
            <ModeSelector />
            <main className="relative z-10 min-h-screen">
              {children}
            </main>
          </div>
          </RingDataProvider>
        </ModeProvider>
      </body>
    </html>
  );
}

