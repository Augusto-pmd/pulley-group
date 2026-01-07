import type { Metadata } from 'next';
import Header from '@/components/Header';
import ProjectionsBar from '@/components/ProjectionsBar';
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
          <Header />
          <ProjectionsBar />
          <main className="pt-[180px] relative z-10">
            {/* Marco Espacial Maestro - Contenedor único para todas las páginas */}
            <div className="w-full max-w-[1400px] mx-auto px-8 pb-16">
              <div className="rounded-container-large p-12" style={{
                backgroundColor: 'transparent',
              }}>
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

