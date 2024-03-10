import type { WebsiteMonitor } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const handleAvailabilityChange = async (
  monitor: WebsiteMonitor,
  availability: WebsiteAvailability
) => {
  throw new NotImplementedError('Handle monitor availability change')
}

export const handleWebsiteResponse = async (monitor: WebsiteMonitor, response: IResponse) => {
  throw new NotImplementedError('Handle Website Response')
}

export const createMonitorEvent = async (monitor: WebsiteMonitor, event: IEvent) => {
  throw new NotImplementedError('Create Monitor Event')
}
