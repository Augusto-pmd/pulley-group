'use client';

import Link from 'next/link';
import Card from './Card';
import { getCurrentMonthState } from '@/mock/month-status';
import { getUnclosedPreviousMonths } from '@/mock/month-status';

export default function DashboardActions() {
  const monthState = getCurrentMonthState();
  const mesesAtrasados = getUnclosedPreviousMonths();

  const actions = [];

  // Solo mostrar alertas urgentes: meses sin cerrar
  if (mesesAtrasados.length > 0) {
    actions.push({
      priority: 'high',
      title: `${mesesAtrasados.length} mes${mesesAtrasados.length > 1 ? 'es' : ''} sin cerrar`,
      href: '/vida-mensual',
      badge: mesesAtrasados.length > 1 ? mesesAtrasados.length : undefined,
    });
  }

  // Ordenar por prioridad
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Si no hay acciones urgentes, no mostrar el bloque
  if (actions.length === 0) {
    return null;
  }

  return (
    <Card padding="normal">
      <div className="flex items-center gap-3">
        <span className="text-body-small text-gray-text-tertiary uppercase tracking-wider">Avisos:</span>
        <div className="flex items-center gap-4 flex-1">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-2 text-body text-gray-text-primary hover:text-blue-600 transition-colors duration-fast"
            >
              {action.badge && (
                <span className="px-1.5 py-0.5 bg-orange-warning/20 text-orange-warning text-caption rounded-full">
                  {action.badge}
                </span>
              )}
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}

