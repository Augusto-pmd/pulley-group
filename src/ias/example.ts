import { sendEventToIAS, IASEvent } from './ias.client';

/**
 * Ejemplo: Simular movimiento Pulley y enviarlo a IAS
 */
async function ejemploMovimientoPulley() {
  // Simular movimiento Pulley
  const movimiento: IASEvent = {
    id: `mov-${Date.now()}`,
    type: 'movement',
    payload: {
      amount: 50000,
      category: 'variable',
      date: '2025-12-28',
      concept: 'Compra supermercado',
      type: 'egreso',
    },
    timestamp: new Date().toISOString(),
    source: 'pulley-group',
  };

  console.log('Enviando evento a IAS:', JSON.stringify(movimiento, null, 2));

  try {
    const decision = await sendEventToIAS(movimiento);
    
    console.log('Decisión recibida de IAS:', JSON.stringify(decision, null, 2));
    console.log('Acción:', decision.action);
    console.log('Razón:', decision.reason);
  } catch (error) {
    console.error('Error al comunicarse con IAS:', error);
  }
}

// Ejecutar ejemplo
if (require.main === module) {
  ejemploMovimientoPulley()
    .then(() => {
      console.log('Ejemplo completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en ejemplo:', error);
      process.exit(1);
    });
}

