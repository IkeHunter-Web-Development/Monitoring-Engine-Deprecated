import { Incident } from 'src/models'
import { incidentExample } from './incidentExample'

export const generateIncidents = async (count: number = 1): Promise<Incident[]> => {
  const incidents = []
  for (let i = 0; i < count; i++) {
    const incident: Incident = await Incident.create(incidentExample)
    incidents.push(incident)
  }
  return incidents
}
