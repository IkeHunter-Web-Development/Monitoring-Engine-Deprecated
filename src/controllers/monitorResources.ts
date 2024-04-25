import type { Types } from 'mongoose'
// import type { Subscriber } from 'src/models'
import { Event, Incident, WebsiteMonitor, WebsiteResponse } from 'src/models'
import { MonitorNotFoundError, validateMonitorInput, validatePartialMonitorInput } from 'src/utils'

export const webMonitorCreate = async (data: IWebsiteMonitor): Promise<WebsiteMonitor> => {
  validateMonitorInput(data)
  const monitor = await WebsiteMonitor.create(data)
  return monitor
}
export const webMonitorGetList = async (): Promise<WebsiteMonitor[]> => {
  const monitors = await WebsiteMonitor.find({})

  return monitors
}
export const webMonitorGetOne = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await WebsiteMonitor.findById(id)

  if (!monitor) throw new MonitorNotFoundError(`Monitor not found with id ${id}`)

  return monitor
}
export const webMonitorUpdate = async (
  id: string | Types.ObjectId,
  data: Partial<IWebsiteMonitor>
): Promise<WebsiteMonitor> => {
  validatePartialMonitorInput(data)
  const monitor = await WebsiteMonitor.findOneAndUpdate({ _id: id }, data, { new: true })
  if (!monitor) throw new MonitorNotFoundError(`Monitor not found with id ${id}.`)

  return monitor
}
export const webMonitorDelete = async (id: string | Types.ObjectId): Promise<WebsiteMonitor> => {
  const monitor = await webMonitorGetOne(id)

  await monitor.deleteOne()
  return monitor
}

export const webMonitorGetEvents = async (monitor: WebsiteMonitor): Promise<Event[]> => {
  const events = await Event.find({ monitorId: monitor._id })

  return events
}
export const webMonitorGetResponses = async (
  monitor: WebsiteMonitor
): Promise<WebsiteResponse[]> => {
  const responses = await WebsiteResponse.find({ monitorId: monitor._id })

  return responses
}
// export const webMonitorGetSubscribers = (monitor: WebsiteMonitor): Subscriber[] => {
//   // const subscribers = await Subscriber.find({ monitorId: monitor._id })

//   return monitor.subscribers
//   // return subscribers
// // }
export const webMonitorGetIncidents = async (monitor: WebsiteMonitor): Promise<Incident[]> => {
  const incidents = await Incident.find({ monitorId: monitor._id })

  return incidents
}
