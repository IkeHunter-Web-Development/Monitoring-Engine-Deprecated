export class InvalidMonitorEventFieldError extends Error {
  constructor(message: string) {
    super(`Received an invalid monitor event field: ${message}`)
  }
}
