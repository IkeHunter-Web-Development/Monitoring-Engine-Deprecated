import type { Incident } from 'src/models'

export const serializeIncident = (incident: Incident): IIncidentMeta => {
  const incidentMeta: IIncidentMeta = {
    id: incident._id.toString(),
    createdAt: incident.createdAt.getTime(),
    updatedAt: incident.updatedAt?.getTime(),
    resolvedAt: incident.resolvedAt?.getTime(),
    monitorId: incident.monitorId?.toString(),
    impact: incident.impact,
    status: incident.status,
    cause: incident.cause,
    displayName: incident.displayName,
    notes: incident.notes
  }

  return incidentMeta
}

export const serializeIncidents = (incidents: Incident[]): IIncidentMeta[] => {
  return incidents.map((incident) => serializeIncident(incident))
}
