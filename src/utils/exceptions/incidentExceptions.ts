export class IncidentNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Incident not found.')
    this.name = 'IncidentNotFoundError'
  }
}
