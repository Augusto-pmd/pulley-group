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
          <div className="flex-1 text-body-large text-black">
            {alert.message}
          </div>

          {/* Acción (opcional) */}
          {alert.action && (
            <a
              href={alert.action.href}
              className="text-body-large text-blue-system hover:text-blue-hover transition-colors duration-fast ml-4"
            >
              {alert.action.label}
            </a>
          )}
        </div>
      ))}
    </Card>
  );
}

