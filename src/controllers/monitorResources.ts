import type { Types } from 'mongoose'
import { Event, WebsiteMonitor, WebsiteResponse } from 'src/models'
import { MonitorNotFoundError } from 'src/utils'

export const createMonitor = async (data: IWebsiteMonitor): Promise<WebsiteMonitor> => {
  const monitor = await WebsiteMonitor.create(data)
  return monitor
}
export const getMonitors = async (): Promise<WebsiteMonitor[]> => {
  const monitors = await WebsiteMonitor.find({})

  return monitors
}
export const getMonitor = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await WebsiteMonitor.findById(id)

  if (!monitor) throw new MonitorNotFoundError(`Monitor not found with id ${id}`)

  return monitor
}
export const updateMonitor = async (
  id: string | Types.ObjectId,
  data: Partial<IWebsiteMonitor>
): Promise<WebsiteMonitor> => {
  const monitor = await getMonitor(id)
  await monitor.updateOne(data)

  const newMonitor = await getMonitor(id) 

  return newMonitor
}
export const deleteMonitor = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await getMonitor(id)

  await monitor.deleteOne()
  return monitor
}

export const getMonitorEvents = async (monitor: WebsiteMonitor): Promise<Event[]> => {
  const events = await Event.find({ monitorId: monitor._id })

  return events
}
export const getMonitorResponses = async (monitor: WebsiteMonitor): Promise<WebsiteResponse[]> => {
  const responses = await WebsiteResponse.find({ monitorId: monitor._id })

  return responses
}
