'use client';

export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Blob 1 - Esquina superior izquierda - Sombra ambiental con azul muy desaturado */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(100, 120, 155, 0.08) 0%, rgba(100, 120, 155, 0.03) 40%, transparent 70%)',
          top: '-15%',
          left: '-10%',
          filter: 'blur(140px)',
          opacity: 0.4,
          animation: 'blobFloat1 25s ease-in-out infinite, bluePulse1 45s ease-in-out infinite, breathe1 8s ease-in-out infinite',
          boxShadow: '0px 0px 200px rgba(100, 120, 155, 0.1), 0px 0px 100px rgba(100, 120, 155, 0.05)',
        }}
      />
      
      {/* Blob 2 - Esquina inferior derecha - Sombra ambiental con azul muy desaturado */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(120, 140, 165, 0.06) 0%, rgba(120, 140, 165, 0.02) 40%, transparent 70%)',
          bottom: '-15%',
          right: '-10%',
          filter: 'blur(160px)',
          opacity: 0.35,
          animation: 'blobFloat2 30s ease-in-out infinite, bluePulse2 50s ease-in-out infinite, breathe2 10s ease-in-out infinite',
          boxShadow: '0px 0px 220px rgba(120, 140, 165, 0.08), 0px 0px 110px rgba(120, 140, 165, 0.04)',
        }}
      />
      
      {/* Blob 3 - Centro derecho - Azul ambiental intermitente */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110, 135, 160, 0.05) 0%, rgba(110, 135, 160, 0.02) 40%, transparent 70%)',
          top: '30%',
          right: '10%',
          filter: 'blur(130px)',
          opacity: 0.3,
          animation: 'blobFloat3 20s ease-in-out infinite, bluePulse3 40s ease-in-out infinite, breathe3 9s ease-in-out infinite',
          boxShadow: '0px 0px 180px rgba(110, 135, 160, 0.06), 0px 0px 90px rgba(110, 135, 160, 0.03)',
        }}
      />
      
      {/* Blob 4 - Centro izquierdo - Azul ambiental muy sutil */}
      <div 
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(105, 130, 155, 0.04) 0%, rgba(105, 130, 155, 0.015) 40%, transparent 70%)',
          top: '50%',
          left: '15%',
          filter: 'blur(120px)',
          opacity: 0.25,
          animation: 'blobFloat4 35s ease-in-out infinite, bluePulse4 55s ease-in-out infinite, breathe4 11s ease-in-out infinite',
          boxShadow: '0px 0px 160px rgba(105, 130, 155, 0.05), 0px 0px 80px rgba(105, 130, 155, 0.025)',
        }}
      />
      
      {/* Blob 5 - Azul ambiental intermitente adicional (muy sutil) */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(115, 140, 170, 0.03) 0%, rgba(115, 140, 170, 0.01) 40%, transparent 70%)',
          top: '20%',
          left: '50%',
          filter: 'blur(150px)',
          opacity: 0.2,
          animation: 'blobFloat5 28s ease-in-out infinite, bluePulse5 60s ease-in-out infinite, breathe5 7s ease-in-out infinite',
          boxShadow: '0px 0px 200px rgba(115, 140, 170, 0.04), 0px 0px 100px rgba(115, 140, 170, 0.02)',
        }}
      />
    </div>
  );
}

