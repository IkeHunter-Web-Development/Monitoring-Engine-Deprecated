// import { EventProducer, EventQueue } from 'src/lib'

import { createProducer } from 'src/lib'

const topic = 'monitors'

export const produceCreateMonitor = createProducer<IMonitorMeta>(topic, 'create')
export const produceUpdateMonitor = createProducer<IMonitorMeta>(topic, 'udpate')
export const produceDeleteMonitor = createProducer<IMonitorMeta>(topic, 'delete')
