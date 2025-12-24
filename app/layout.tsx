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
      <body>
        {/* Fondo vivo con blobs flotantes */}
        <BackgroundBlobs />
        
        {/* Contenedor principal flotante */}
        <div className="relative z-10 min-h-screen">
          <Header />
          <ProjectionsBar />
          <main className="pt-[180px] relative z-10">
            {/* Marco Espacial Maestro - Contenedor único para todas las páginas */}
            <div className="w-full max-w-[1400px] mx-auto px-8 pb-16">
              <div className="rounded-container-large backdrop-blur-card border border-white/20 p-12" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                // Gradiente interno muy sutil para continuidad + tinte azul apenas perceptible
                backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(252, 253, 255, 0.15) 100%)',
                // Ambient shadow grande y difusa con color suave + borde luminoso azul muy sutil
                boxShadow: `
                  0px 0px 100px rgba(0, 0, 0, 0.03),
                  0px 0px 50px rgba(0, 0, 0, 0.015),
                  0px 0px 0px 1px rgba(255, 255, 255, 0.2),
                  0px 0px 0px 0.5px rgba(100, 150, 200, 0.06),
                  inset 0px 1px 0px rgba(255, 255, 255, 0.4)
                `,
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

