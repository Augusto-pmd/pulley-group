import type { Metadata } from 'next';
import ProjectionsBar from '@/components/ProjectionsBar';
import CommandPalette from '@/components/CommandPalette';
import FloatingNav from '@/components/FloatingNav';
import CommandPaletteHint from '@/components/CommandPaletteHint';
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
        {/* Fondo vivo con blobs flotantes */}
        <BackgroundBlobs />
        
        {/* Contenedor principal flotante */}
        <div className="relative z-10 min-h-screen">
          <ProjectionsBar />
          <CommandPalette />
          <FloatingNav />
          <CommandPaletteHint />
          <main className="pt-20 relative z-10">
            {/* Marco Espacial Maestro - Contenedor único para todas las páginas */}
            <div className="w-full max-w-[1200px] mx-auto px-12 pb-24">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

