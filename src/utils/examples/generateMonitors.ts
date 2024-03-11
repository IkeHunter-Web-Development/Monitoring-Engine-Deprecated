import { WebsiteMonitor } from 'src/models'
import { monitorExample } from './monitorExample'

export const generateMonitor = async (): Promise<WebsiteMonitor> => {
  return await WebsiteMonitor.create(monitorExample)
}
export const generateMonitors = async (count: number = 1): Promise<WebsiteMonitor[]> => {
  const monitors = []
  for (let i = 0; i < count; i++) {
    const monitor: WebsiteMonitor = await WebsiteMonitor.create(monitorExample)
    monitors.push(monitor)
  }
  return monitors
}
