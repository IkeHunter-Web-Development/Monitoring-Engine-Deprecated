import { type IncidentInterface } from 'src/models'

export const validateIncident = (data: any): IncidentInterface => {
  const { monitorId, type, status, message, timestamp } = data

  if (!monitorId) {
    throw new Error('monitorId is required')
  }

  if (!message) {
    throw new Error('message is required')
  }

  if (!type) {
    throw new Error('type is required')
  }

  if (!status) {
    throw new Error('status is required')
  }

  return {
    monitorId,
    type,
    status,
    message,
    timestamp: timestamp || new Date()
  }
}
