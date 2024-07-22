import { createProducer } from 'src/lib'

export const produceCreateMonitor = createProducer<IWebsiteMonitorMeta>('monitor-create')
export const produceUpdateMonitor = createProducer<IWebsiteMonitorMeta>('monitor-update')
export const produceDeleteMonitor = createProducer<IWebsiteMonitorMeta>('monitor-delete')
