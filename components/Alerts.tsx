import Card from './Card';

interface Alert {
  id: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

interface AlertsProps {
  alerts: Alert[];
}

export default function Alerts({ alerts }: AlertsProps) {
  // Solo mostrar si hay alertas
  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card>
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between ${
            index < alerts.length - 1 ? 'mb-4' : ''
          }`}
        >
          {/* Mensaje */}
          <div className="flex-1 text-body-large text-text-primary">
            {alert.message}
          </div>

          {/* Acción (opcional) */}
          {alert.action && (
            <a
              href={alert.action.href}
              className="text-body-large transition-colors duration-fast ml-4"
              style={{ color: '#B59A6A' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#A0885A'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#B59A6A'}
            >
              {alert.action.label}
            </a>
          )}
        </div>
      ))}
    </Card>
  );
}

