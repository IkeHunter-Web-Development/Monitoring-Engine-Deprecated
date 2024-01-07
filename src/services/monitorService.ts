/**
 * @fileoverview Manager for the monitor model.
 */
import { NODE_ENV } from 'src/config/constants'
import { Event, Monitor, MonitorResponse } from 'src/models'
import { MonitorProducer } from 'src/data'
import { getResponseTime } from 'src/utils'
import { validateMonitor } from 'src/validators'

// export class MonitorService {

export const MonitorService = {
  notifyCreateMonitor: async (monitor: Monitor): Promise<void> => {
    if (NODE_ENV === 'development') return
    await MonitorProducer.sendMonitorMessage('create', monitor)
  },

  notifyDeleteMonitor: async (monitor: Monitor): Promise<void> => {
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
  createMonitor: async (data: any): Promise<Monitor> => {
    const payload = validateMonitor(data)

    const initialResponseTime = await getResponseTime(String(data.url)).catch((error) => {
      console.log('URL failed initial check:', error)
      throw error
    })

    const monitor = await Monitor.create(payload)
      .then(async (monitor: Monitor) => {
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
    const monitor = await Monitor.findOne({ _id: id })
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
  }
}
