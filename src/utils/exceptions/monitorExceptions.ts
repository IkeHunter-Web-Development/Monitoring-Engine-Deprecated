export class MonitorNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Monitor not found.')
    this.name = 'MonitorNotFoundError'
  }
}
