import Card from '../Card';

export default function SettingsWarnings() {
  const impacts = [
    'Las proyecciones se recalcularán automáticamente',
    'Los valores reales (IPC) se actualizarán',
    'Los escenarios (Conservador, Base, Optimista) reflejarán los nuevos supuestos',
    'Los horizontes temporales estarán disponibles según la configuración',
  ];

  return (
    <Card className="bg-gray-bg">
      {/* Título */}
      <div className="text-body-large font-medium text-black mb-4">
        Al modificar supuestos
      </div>

      {/* Lista de Impactos */}
      <ul className="space-y-2">
        {impacts.map((impact, index) => (
          <li key={index} className="text-body text-gray-text-tertiary flex items-start">
            <span className="text-body text-gray-text-tertiary mr-2">·</span>
            <span>{impact}</span>
          </li>
        ))}
      </ul>

      {/* Nota de Confirmación */}
      <div className="mt-4 text-caption text-gray-text-disabled">
        Los cambios se guardan automáticamente. Puedes revertirlos en cualquier momento.
      </div>
    </Card>
  );
}

