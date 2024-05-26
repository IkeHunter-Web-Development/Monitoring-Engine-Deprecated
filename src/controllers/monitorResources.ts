import type { Types } from 'mongoose'
import { produceCreateMonitor, produceDeleteMonitor, produceUpdateMonitor } from 'src/events'
// import type { Subscriber } from 'src/models'
import { Event, Incident, WebsiteMonitor, WebsiteResponse } from 'src/models'
import {
  MonitorNotFoundError,
  serializeMonitor,
  serializeMonitors,
  validateFullMonitor,
  validateMonitorInput
} from 'src/utils'

export const createWebMonitor = async (data: IWebsiteMonitor): Promise<WebsiteMonitor> => {
  validateFullMonitor(data)
  const monitor = await WebsiteMonitor.create(data)

  const serialized = await serializeMonitor(monitor)
  await produceCreateMonitor(serialized.id, serialized)

  return monitor
}
export const getWebMonitors = async (query: any): Promise<WebsiteMonitor[]> => {
  const monitors = await WebsiteMonitor.find({ ...query })

  return monitors
}
export const getWebMonitor = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await WebsiteMonitor.findById(id)

  if (!monitor) throw new MonitorNotFoundError(`Monitor not found with id ${id}`)

  return monitor
}
export const updateWebMonitor = async (
  id: string | Types.ObjectId,
  data: Partial<IWebsiteMonitor>
): Promise<WebsiteMonitor> => {
  validateMonitorInput(data)
  const monitor = await WebsiteMonitor.findOneAndUpdate({ _id: id }, data, { new: true })
  if (!monitor) throw new MonitorNotFoundError(`Monitor not found with id ${id}.`)

  const serialized = await serializeMonitor(monitor)
  produceUpdateMonitor(String(id), serialized)

  return monitor
}
export const deleteWebMonitor = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await getWebMonitor(id)

  await monitor.deleteOne()

  const serialized = await serializeMonitor(monitor)
  await produceDeleteMonitor(serialized.id, serialized)

  return monitor
}

export const deleteWebMonitors = async (query: any): Promise<WebsiteMonitor[]> => {
  const monitors = await getWebMonitors({ ...query })
  await WebsiteResponse.deleteMany().all(
    'monitorId',
    monitors.map((m) => m._id)
  )
  await Event.deleteMany().all(
    'monitorId',
    monitors.map((m) => m._id)
  )
  await WebsiteMonitor.deleteMany({ ...query })

  const serialized = await serializeMonitors(monitors)
  await produceDeleteMonitor('delete-many', serialized)

  return monitors
}

export const getWebMonitorEvents = async (monitor: WebsiteMonitor): Promise<Event[]> => {
  const events = await Event.find({ monitorId: monitor._id })

  return events
}
export const getWebMonitorResponses = async (
  monitor: WebsiteMonitor
): Promise<WebsiteResponse[]> => {
  const responses = await WebsiteResponse.find({ monitorId: monitor._id })

  return responses
}

export const getWebMonitorIncidents = async (monitor: WebsiteMonitor): Promise<Incident[]> => {
  const incidents = await Incident.find({ monitorId: monitor._id })

  return incidents
}
