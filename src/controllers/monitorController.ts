import type { Event, WebsiteMonitor, WebsiteResponse } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const createMonitor = async (data: IWebsiteMonitor): Promise<WebsiteMonitor> => {
  throw new NotImplementedError('Create monitor controller')
}
export const getMonitors = async (): Promise<WebsiteMonitor[]> => {
  throw new NotImplementedError('Get monitors controller')
}
export const getMonitor = async (id: string): Promise<WebsiteMonitor> => {
  throw new NotImplementedError('Get monitor controller')
}
export const updateMonitor = async (
  id: string,
  data: Partial<IWebsiteMonitor>
): Promise<WebsiteMonitor> => {
  throw new NotImplementedError('Update monitor controller')
}
export const deleteMonitor = async (id: string): Promise<WebsiteMonitor> => {
  throw new NotImplementedError('Delete monitor controller')
}

export const getMonitorEvents = async (monitor: WebsiteMonitor): Promise<Event[]> => {
  throw new NotImplementedError('Get monitor events')
}
export const getMonitorResponses = async (monitor: WebsiteMonitor): Promise<WebsiteResponse[]> => {
  throw new NotImplementedError('Get monitor responses')
}
