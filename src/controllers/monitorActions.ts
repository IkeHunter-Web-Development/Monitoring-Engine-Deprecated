import { Event, WebsiteResponse, type WebsiteMonitor } from 'src/models'
import { handleWebMonitorResponseTime } from 'src/services/monitorService'
import { validateEvent, validateResponse } from 'src/utils'
import { webMonitorGetOne } from './monitorResources'

export const webMonitorRegisterResponse = async (response: IResponse): Promise<WebsiteResponse> => {
  validateResponse(response)

  const monitor = await webMonitorGetOne(response.monitorId)
  const resObject = await WebsiteResponse.create(response)

  const updatePayload: Partial<WebsiteMonitor> = {
    responseTime: response.responseTime,
    lastCheck: new Date()
  }

  await monitor.updateOne(updatePayload)

  await handleWebMonitorResponseTime(monitor)

  return resObject
}

export const webMonitorRegisterEvent = async (monitor: WebsiteMonitor, event: IEvent) => {
  validateEvent(event)

  const newEvent = await Event.create({
    ...event,
    monitorId: monitor._id,
    projectId: monitor.projectId
  })

  return newEvent
}

export const webMonitorStatusChange = async (
  monitor: WebsiteMonitor,
  oldStatus: MonitorStatus,
  newStatus: MonitorStatus
) => {}
