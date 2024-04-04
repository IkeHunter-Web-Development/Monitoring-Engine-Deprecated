export class MonitorNotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Monitor not found.')
    this.name = 'MonitorNotFoundError'
  }
}

export class InvalidMonitorFieldError extends Error {
  constructor(field: string) {
    super(`Received an invalid monitor field: ${field}`)
    this.name = 'InvalidMonitorFieldError'
  }
}
