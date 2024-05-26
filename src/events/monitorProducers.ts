// import { EventProducer, EventQueue } from 'src/lib'

import { createProducer } from 'src/lib'

// const topic = 'monitors'

export const produceCreateMonitor = createProducer<IMonitorMeta>('monitor-create')
export const produceUpdateMonitor = createProducer<IMonitorMeta>('monitor-update')
export const produceDeleteMonitor = createProducer<IMonitorMeta>('monitor-delete')
