export const IncidentImpactOptions: IncidentImpact[] = [
  'none',
  'maintenance',
  'minor',
  'major',
  'critical'
]

export const isIncidentImpact = (data: any): data is IncidentImpact => {
  return IncidentImpactOptions.includes(data)
}

export const IncidentStatusOptions: IncidentStatus[] = [
  'active',
  'resolved',
  'pending',
  'investigating',
  'identified',
  'inProgress',
  'completed'
]

export const isIncidentStatus = (data: any): data is IncidentStatus => {
  return IncidentStatusOptions.includes(data)
}

export const WebsiteAvailabilityOptions: WebsiteAvailability[] = [
  'degraded',
  'maintenance',
  'offline',
  'online',
  'pending'
]

export const isWebsiteAvailability = (data: any): data is WebsiteAvailability => {
  return WebsiteAvailabilityOptions.includes(data)
}
