// import { EventProducer, EventQueue } from 'src/lib'

import { createProducer } from 'src/lib'

const topic = 'monitors'

export const produceCreateMonitor = createProducer<IMonitorMeta>(topic, 'create')
export const produceDeleteMonitor = createProducer<IMonitorMeta>(topic, 'delete')
