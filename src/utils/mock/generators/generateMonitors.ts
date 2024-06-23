import { randomInt } from 'crypto'
import { Types } from 'mongoose'
import { WebsiteMonitor } from 'src/models'

import {
  getRandomMonitorStatus,
  getRandomSeedData,
  getRandomWebAvailability
} from 'src/utils/random'

export const monitorExample: IWebsiteMonitor = {
  projectId: randomInt(0, 500).toString(),
  name: 'Example Monitor',
  url: 'https://example.com'
}

export const monitorMetaExample: IWebsiteMonitorMeta = {
  ...monitorExample,
  availability: 'pending',
  responseTime: randomInt(500, 5000),
  id: new Types.ObjectId().toString(),
  status: 'stable',
  lastCheck: new Date().getTime(),
  createdAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 2,
  updatedAt: new Date().getTime() - 1000 * 60 * 60 * 24 * 1,
  events: [],
  responses: [],
  incidents: [],
  subscribers: []
}

export const createTestMonitor = async (
  defaults: Partial<IWebsiteMonitor> = {}
): Promise<WebsiteMonitor> => {
  // const randomIndex = randomInt(0, SEED_DATA.length)
  // const randomData = SEED_DATA[randomIndex]
  const randomData = getRandomSeedData()

  const payload = {
    ...monitorExample,
    name: randomData.app_name,
    url: randomData.url,
    status: getRandomMonitorStatus(),
    availability: getRandomWebAvailability(),
    ...defaults
  }

  const monitor = await WebsiteMonitor.create(payload)

  return monitor
}
export const createTestMonitors = async (count: number = 1): Promise<WebsiteMonitor[]> => {
  const monitors = []
  for (let i = 0; i < count; i++) {
    const monitor: WebsiteMonitor = await WebsiteMonitor.create(monitorExample)
    monitors.push(monitor)
  }
  return monitors
}
