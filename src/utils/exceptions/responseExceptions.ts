export class InvalidResponseFieldError extends Error {
  constructor(message: string) {
    super(`Received an invalid website monitor response field: ${message}`)
    this.name = 'InvalidResponseFieldError'
  }
}
