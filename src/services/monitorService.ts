import type { WebsiteMonitor } from 'src/models'

/**
 * Successful website response was recorded
 */
export const handleWebMonitorResponseTime = async (monitor: WebsiteMonitor) => {
  switch (monitor.status) {
    case 'stable':
      break
    case 'pending':
    case 'alert':
      monitor.status = 'stable'
      break
    case 'critical':
      monitor.status = 'alert'
      break
    default:
      monitor.status = 'pending'
  }

  switch (monitor.availability) {
    case 'online':
      break
    case 'offline':
      monitor.availability = 'online'
      break
    case 'degraded':
      monitor.availability = 'online'
      break
    case 'maintenance':
      monitor.availability = 'maintenance'
      break
    case 'pending':
      monitor.availability = 'online'
      break
    default:
      monitor.availability = 'pending'
  }

  await monitor.save()
  return monitor
}

/**
 * Website ping returned an error
 */
export const handleWebMonitorErrorResponse = async (monitor: WebsiteMonitor) => {
  // console.l
  switch (monitor.status) {
    case 'critical':
      break
    case 'stable':
      monitor.status = 'alert'
      break
    case 'pending':
    case 'alert':
      monitor.status = 'critical'
      break
    default:
      monitor.status = 'alert'
  }

  switch (monitor.availability) {
    case 'offline':
      break
    case 'online':
    case 'degraded':
    case 'pending':
      monitor.availability = 'offline'
      break
    case 'maintenance':
      break
    default:
      monitor.availability = 'pending'
  }

  await monitor.save()
  return monitor
}
