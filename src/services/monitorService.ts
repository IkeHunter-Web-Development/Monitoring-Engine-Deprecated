/**
 * @fileoverview Manager for the monitor model.
 */
import type { Types } from 'mongoose'
import { NODE_ENV } from 'src/config/constants'
import { MonitorProducer } from 'src/data'
import { Event, MonitorResponse, WebsiteMonitor } from 'src/models'
import { getResponseTime } from 'src/utils'
import { validateMonitor } from 'src/validators'

// export class MonitorService {

export const MonitorService = {
  notifyCreateMonitor: async (monitor: WebsiteMonitor): Promise<void> => {
    if (NODE_ENV === 'development') return
    await MonitorProducer.sendMonitorMessage('create', monitor)
  },

  notifyDeleteMonitor: async (monitor: WebsiteMonitor): Promise<void> => {
    if (NODE_ENV === 'development') return
    await MonitorProducer.sendMonitorMessage('delete', monitor)
  },

  /**
   * Create a monitor.
   *
   * @param projectId The id of the project the monitor belongs to.
   * @param url The url to monitor.
   * @param recipients The users to notify when the monitor goes offline.
   * @param title The title of the monitor.
   * @returns The created monitor.
   */
  createMonitor: async (data: any): Promise<WebsiteMonitor> => {
    const payload = validateMonitor(data)

    const initialResponseTime = await getResponseTime(String(data.url)).catch((error) => {
      console.log('URL failed initial check:', error)
      throw error
    })

    const monitor = await WebsiteMonitor.create(payload)
      .then(async (monitor: WebsiteMonitor) => {
        await MonitorService.notifyCreateMonitor(monitor)
        return monitor
      })
      .catch((err: any) => {
        console.log(err)
        throw err
      })

    await MonitorResponse.create({
      monitorId: monitor._id,
      responseTime: initialResponseTime,
      timestamp: Date.now()
    })

    return monitor
  },

  /**
   * Delete a monitor.
   *
   * @param id The id of the monitor to delete.
   * @returns Boolean, whether deletion was successful.
   */
  deleteMonitor: async (id: string): Promise<boolean> => {
    const monitor = await WebsiteMonitor.findOne({ _id: id })
    if (monitor === null) throw new Error('Monitor not found, cannot delete.')

    await MonitorService.notifyDeleteMonitor(monitor)

    await Event.deleteMany({ monitorId: monitor._id })
    await Event.create({
      projectId: monitor.projectId,
      online: true,
      status: 'alert',
      statusCode: 200,
      message: `Monitor ${monitor.title} deleted.`
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
  },

  handleStatusChanged: async (
    id: Types.ObjectId,
    newStatus: MonitorStatus
  ): Promise<Event | null> => {
    const monitor = await WebsiteMonitor.findById(id)
    if (monitor == null) return null

    const newEvent = await Event.create({
      projectId: monitor.projectId,
      message: `Monitor status changed from ${monitor.status} to ${newStatus}`
    })

    await monitor.updateOne({ status: newStatus })

    return newEvent
  }
}
