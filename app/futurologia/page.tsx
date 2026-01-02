'use client';

import ModuleHeader from '@/components/ModuleHeader';
import Card from '@/components/Card';
import Link from 'next/link';

// Mock: señales predictivas
interface SenalPredictiva {
  id: string;
  mensaje: string;
  tipo: 'fiscal' | 'patrimonial' | 'neutral';
  moduloRelacionado?: {
    label: string;
    href: string;
  };
}

const senalesMock: SenalPredictiva[] = [
  {
    id: '1',
    mensaje: 'Si mantenés este ritmo de ingresos, en los próximos meses podrías acercarte al límite de tu categoría.',
    tipo: 'fiscal',
    moduloRelacionado: {
      label: 'Vista Contador',
      href: '/vista-contador',
    },
  },
  {
    id: '2',
    mensaje: 'Parte de tu patrimonio no declarado empieza a tener un peso relevante.',
    tipo: 'fiscal',
    moduloRelacionado: {
      label: 'Activos',
      href: '/activos',
    },
  },
  {
    id: '3',
    mensaje: 'El pago de cuotas está mejorando tu patrimonio neto, aunque reduce tu liquidez.',
    tipo: 'patrimonial',
    moduloRelacionado: {
      label: 'Vida Mensual',
      href: '/vida-mensual',
    },
  },
  {
    id: '4',
    mensaje: 'Esta inversión concentra más capital que el promedio de tu cartera.',
    tipo: 'patrimonial',
    moduloRelacionado: {
      label: 'Inversiones',
      href: '/investments',
    },
  },
  {
    id: '5',
    mensaje: 'Sin señales relevantes adicionales por ahora.',
    tipo: 'neutral',
  },
];

export default function FuturologiaPage() {
  // Filtrar señales neutrales si hay otras señales
  const senalesRelevantes = senalesMock.filter((s) => s.tipo !== 'neutral');
  const senalesAMostrar = senalesRelevantes.length > 0 
    ? senalesRelevantes.slice(0, 5) 
    : senalesMock.filter((s) => s.tipo === 'neutral').slice(0, 1);

  return (
    <>
      {/* CAPA 1: ACCIÓN - Header */}
      <div className="mb-8">
        <ModuleHeader
          title="Futurología"
          description="Lectura predictiva basada en tus últimos movimientos"
          status={{
            label: 'Estado',
            value: `${senalesAMostrar.length} señal${senalesAMostrar.length !== 1 ? 'es' : ''} detectada${senalesAMostrar.length !== 1 ? 's' : ''}`,
            color: 'info',
          }}
        />
      </div>

      {/* CAPA 2: CONTEXTO - Escáner Predictivo */}
      <div className="mb-10">
        <Card padding="large">
          <div className="pb-6 border-b border-gray-divider mb-0">
            <h2 className="text-heading-3 font-semibold text-gray-text-primary mb-1">
              Escáner Predictivo
            </h2>
            <p className="text-body text-gray-text-tertiary">
              Señales basadas en tus movimientos recientes
            </p>
          </div>

          <div className="pt-6">
            {senalesAMostrar.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-body-large text-gray-text-tertiary">
                  Sin señales relevantes por ahora.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {senalesAMostrar.map((senal) => (
                  <div
                    key={senal.id}
                    className="pb-4 border-b border-gray-divider last:border-0 last:pb-0"
                  >
                    <p className="text-body-large text-gray-text-primary mb-3">
                      {senal.mensaje}
                    </p>
                    {senal.moduloRelacionado && (
                      <Link
                        href={senal.moduloRelacionado.href}
                        className="inline-flex items-center gap-1.5 text-body text-blue-system hover:text-blue-hover transition-colors duration-fast"
                      >
                        Ver detalle →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

