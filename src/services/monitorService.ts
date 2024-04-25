import type { WebsiteMonitor } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const handleWebMonitorResponseTime = async (monitor: WebsiteMonitor) => {
  if (monitor.responseTime < 0) {
    if (monitor.availability !== 'offline') {
      // Website now offline
      handleFailedResponseNew(monitor)
    } else {
      // Website still offline
      handleFailedResponseNoChange(monitor)
    }
  } else {
    if (monitor.availability !== 'online') {
      // Website back online
      handleSuccessResponseNew(monitor)
    } else {
      // Website still online, continue
      return
    }
  }
}

/** Website in unstable/down state received successful response */
const handleSuccessResponseNew = (monitor: WebsiteMonitor) => {
  throw new NotImplementedError('Handle website response success')
}

/** Website in stable/up state received unsuccessful response */
const handleFailedResponseNew = (monitor: WebsiteMonitor) => {
  throw new NotImplementedError('Handle website response failed new')
}

/** Website in unstable/down state got another failed response */
const handleFailedResponseNoChange = (monitor: WebsiteMonitor) => {
  throw new NotImplementedError('Handle website response failed no change')
}
