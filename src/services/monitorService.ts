import type { WebsiteMonitor } from 'src/models'

export const handleWebMonitorResponseTime = async (monitor: WebsiteMonitor) => {
  if (monitor.responseTime < 0) {
    if (monitor.availability !== 'offline') {
      // Website now offline
      await handleFailedResponseNew(monitor)
    } else {
      // Website still offline
      await handleFailedResponseNoChange(monitor)
    }
  } else {
    if (monitor.availability !== 'online') {
      // Website back online
      await handleSuccessResponseNew(monitor)
    } else {
      // Website still online, continue
      return
    }
  }
}

/** Website in unstable/down state received successful response */
const handleSuccessResponseNew = async (monitor: WebsiteMonitor) => {
  switch (monitor.availability) {
    case 'offline':
      monitor.availability = 'degraded'
      monitor.status = 'alert'
      break
    case 'degraded':
      monitor.availability = 'online'
      monitor.status = 'stable'
      break
    case 'maintenance':
      monitor.availability = 'pending'
      monitor.status = 'pending'
      break
    case 'pending':
      monitor.availability = 'online'
      monitor.status = 'stable'
      break
    default:
      monitor.availability = 'pending'
      monitor.status = 'pending'
  }
  await monitor.save()
}

/** Website in stable/up state received unsuccessful response */
const handleFailedResponseNew = async (monitor: WebsiteMonitor) => {
  switch (monitor.availability) {
    case 'online':
      monitor.availability = 'degraded'
      monitor.status = 'alert'
      break
    case 'degraded':
    case 'pending':
      monitor.availability = 'offline'
      monitor.status = 'emergency'
      break
    case 'maintenance':
      monitor.status = 'pending'
      break
    default:
      monitor.availability = 'pending'
      monitor.status = 'alert'
  }
  await monitor.save()
}

/** Website in unstable/down state got another failed response */
const handleFailedResponseNoChange = async (monitor: WebsiteMonitor) => {
  return monitor
}
