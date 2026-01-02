import { Connection, Client } from '@temporalio/client';

// Tipos de contrato con IAS (solo interfaz, sin lógica)
export interface IASEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
  source: string;
}

export interface IASDecision {
  id: string;
  eventId: string;
  ruleId?: string;
  action: string;
  reason: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// Configuración de conexión Temporal
const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default';

// Cliente Temporal singleton
let temporalClient: Client | null = null;

async function getTemporalClient(): Promise<Client> {
  if (!temporalClient) {
    const connection = await Connection.connect({
      address: TEMPORAL_ADDRESS,
    });
    temporalClient = new Client({
      connection,
      namespace: TEMPORAL_NAMESPACE,
    });
  }
  return temporalClient;
}

/**
 * Envía un evento a IAS mediante Temporal workflow
 * @param event - Evento a enviar
 * @returns Decisión resultante del workflow
 */
export async function sendEventToIAS(event: IASEvent): Promise<IASDecision> {
  const client = await getTemporalClient();
  
  const workflowId = `rule-evaluation-${event.id}-${Date.now()}`;
  
  const handle = await client.workflow.start('RuleEvaluationWorkflow', {
    args: [event],
    taskQueue: 'ias-rule-evaluation',
    workflowId,
  });
  
  const decision = await handle.result();
  
  return decision as IASDecision;
}

