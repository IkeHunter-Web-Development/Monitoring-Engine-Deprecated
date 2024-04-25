import { Types } from 'mongoose'
import { Incident } from 'src/models'
import { getRandomIncidentImpact, getRandomIncidentStatus } from 'src/utils/random'

export const incidentExample: IIncident = {
  monitorId: new Types.ObjectId().toString(),
  impact: getRandomIncidentImpact(),
  status: getRandomIncidentStatus(),
  cause: 'Example cause',
  displayName: 'Example Incident',
  notes: 'Lorem ipsum...'
}

export const createTestIncidents = async (
  count: number = 1,
  defaults: Partial<IIncident> = {}
): Promise<Incident[]> => {
  const incidents = []

  const payload = { ...incidentExample, ...defaults }
  for (let i = 0; i < count; i++) {
    const incident: Incident = await Incident.create(payload)
    incidents.push(incident)
  }
  return incidents
}
