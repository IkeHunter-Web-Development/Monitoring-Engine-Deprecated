import { WebsiteMonitor } from 'src/models'

export const sampleMonitor = {
  projectId: 'abc',
  url: 'https://example.com',
  users: [],
  statusCode: 200,
  active: true,
  title: 'Example Live',
  online: true,
  type: 'http',
  interval: 60,
  timeout: 1000,
  retries: 3
}
export const generateMonitor = async (): Promise<WebsiteMonitor> => {
  return await WebsiteMonitor.create(sampleMonitor)
}
export const generateMonitors = async (count: number = 1): Promise<WebsiteMonitor[]> => {
  const monitors = []
  for (let i = 0; i < count; i++) {
    const monitor: WebsiteMonitor = await WebsiteMonitor.create(sampleMonitor)
    monitors.push(monitor)
  }
  return monitors
}
