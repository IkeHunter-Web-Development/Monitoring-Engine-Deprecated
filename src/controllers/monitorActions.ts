import type { WebsiteMonitor } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const registerWebsiteResponse = async (monitor: WebsiteMonitor, response: IResponse) => {
  throw new NotImplementedError('Register website response')
}

export const registerMonitorEvent = async (monitor: WebsiteMonitor, event: IEvent) => {
  throw new NotImplementedError('Register monitor event')
}
