export class IncidentNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Incident not found.')
    this.name = 'IncidentNotFoundError'
  }
}

export class InvalidIncidentFieldError extends Error {
  constructor(message: string) {
    super(`Received an invalid incident field: ${message}`)
  }
}
