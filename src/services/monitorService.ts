/**
 * @fileoverview Manager for the monitor model.
 */
import type { Types } from 'mongoose'
import { NODE_ENV } from 'src/config/constants'
import { MonitorProducer } from 'src/data'
import { Event, Incident, WebsiteMonitor, WebsiteResponse } from 'src/models'
import { getResponseTime } from 'src/utils'
import { validateMonitor } from 'src/utils/validators'

// export class MonitorService {

export type WebsiteMonitorDetails = Partial<WebsiteMonitor> & {
  responses: WebsiteResponse[]
  incidents: Incident[]
  // subscribers: Subscriber[]
}

// export const MonitorService = {
export const notifyCreateMonitor = async (monitor: WebsiteMonitor): Promise<void> => {
  if (NODE_ENV === 'development') return
  await MonitorProducer.sendMonitorMessage('create', monitor)
}

export const notifyDeleteMonitor = async (monitor: WebsiteMonitor): Promise<void> => {
  if (NODE_ENV === 'development') return
  await MonitorProducer.sendMonitorMessage('delete', monitor)
}

/**
 * Create a monitor.
 *
 * @param projectId The id of the project the monitor belongs to.
 * @param url The url to monitor.
 * @param recipients The users to notify when the monitor goes offline.
 * @param title The title of the monitor.
 * @returns The created monitor.
 */
export const createMonitor = async (data: any): Promise<WebsiteMonitor> => {
  const payload = validateMonitor(data)

  const initialResponseTime = await getResponseTime(String(data.url)).catch((error) => {
    console.log('URL failed initial check:', error)
    throw error
  })

  const monitor = await WebsiteMonitor.create(payload)
    .then(async (monitor: WebsiteMonitor) => {
      await notifyCreateMonitor(monitor)
      return monitor
    })
    .catch((err: any) => {
      console.log(err)
      throw err
    })

  await WebsiteResponse.create({
    monitorId: monitor._id,
    responseTime: initialResponseTime,
    timestamp: Date.now()
  })

  await Event.create({
    projectId: monitor.projectId,
    monitorId: monitor._id,
    message: `Created new monitor: ${monitor.title}.`
  })

  return monitor
}

/**
 * Delete a monitor.
 *
 * @param id The id of the monitor to delete.
 * @returns Boolean, whether deletion was successful.
 */
export const deleteMonitor = async (id: string): Promise<boolean> => {
  const monitor = await WebsiteMonitor.findOne({ _id: id })
  if (monitor === null) throw new Error('Monitor not found, cannot delete.')

  await notifyDeleteMonitor(monitor)

  await Event.deleteMany({ monitorId: monitor._id })
  await Event.create({
    projectId: monitor.projectId,
    online: true,
    status: 'alert',
    statusCode: 200,
    message: `${monitor.title} deleted.`
  })

  const status = monitor
    .deleteOne()
    .then(() => {
      return true
    })
    .catch((err: any) => {
      console.log(err)
      throw err
    })

  return await status
}

export const handleAvailabilityChanged = async (
  id: Types.ObjectId,
  newAvailability: WebsiteAvailability
): Promise<Event | null> => {
  // TODO: Create incident
  const monitor = await WebsiteMonitor.findById(id)
  if (monitor == null) return null

  const newEvent = await Event.create({
    projectId: monitor.projectId,
    monitorId: monitor._id,
    message: `${monitor.title} availability changed from ${monitor.availability} to ${newAvailability}`
  })

  await monitor.updateOne({ availability: newAvailability })
  let status: MonitorStatus

  console.log('new availability:', newAvailability)

  switch (newAvailability) {
    case 'online':
      // TODO: End incident
      status = 'stable'
      break
    case 'offline':
      // TODO: Handle major outage
      status = 'emergency'
      break
    default:
      status = 'pending'
  }

  await monitor.updateOne({ status: status })

  return newEvent
}

export const getMonitorDetails = async (
  monitor: WebsiteMonitor
): Promise<WebsiteMonitorDetails> => {
  const responses: WebsiteResponse[] = await WebsiteResponse.find({ monitorId: monitor._id })
  const incidents: Incident[] = await Incident.find({ monitorId: monitor._id })
  // const subscribers: Subscriber[] = await Subscriber.find({ monitorId: monitor._id })

  return {
    ...monitor.toObject(),
    responses,
    incidents
    // subscribers
  }
}

export const getManyMonitorsDetails = async (
  monitors: WebsiteMonitor[]
): Promise<WebsiteMonitorDetails[]> => {
  return Promise.all(monitors.map(async (monitor) => await getMonitorDetails(monitor)))
}
