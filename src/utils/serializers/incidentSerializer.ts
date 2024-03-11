import type { Incident } from 'src/models'
import { NotImplementedError } from '../exceptions'

export const serializeIncident = (incident: Incident): Promise<IIncidentMeta> => {
  throw new NotImplementedError('Serialize incident')
}

export const serializeIncidents = (incidents: Incident[]): Promise<IIncidentMeta[]> => {
  throw new NotImplementedError('Serialize incidents')
}
