import { NotFoundError } from './generalExceptions'

export class MonitorNotFoundError extends NotFoundError {
  constructor(message?: string) {
    super(message || 'Monitor not found.')
    this.name = 'MonitorNotFoundError'
  }
}

export class InvalidMonitorFieldError extends Error {
  constructor(message: string) {
    super(`Received an invalid monitor field: ${message}`)
    this.name = 'InvalidMonitorFieldError'
  }
}
