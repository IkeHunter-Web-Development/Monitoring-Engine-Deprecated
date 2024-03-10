import { EventProducer, EventQueue } from 'src/lib'

const eventQueue = EventQueue.getInstance()
const monitorProducer = new EventProducer(eventQueue, 'monitors')

const produceCreateMonitor = monitorProducer.createProducer<IMonitorMeta>('create')
const produceDeleteMonitor = monitorProducer.createProducer<IMonitorMeta>('delete')

export const produceCreateMonitorEvent = produceCreateMonitor
export const produceDeleteMonitorEvent = produceDeleteMonitor
