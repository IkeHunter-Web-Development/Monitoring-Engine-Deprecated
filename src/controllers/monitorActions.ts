import { produceSendEmail } from 'src/events'
import { Event, WebsiteResponse, type WebsiteMonitor } from 'src/models'
import { handleWebMonitorResponseTime } from 'src/services/monitorService'
import { validateEvent, validateResponse } from 'src/utils'
import { webMonitorGetOne } from './monitorResources'

export const webMonitorRegisterResponse = async (response: IResponse): Promise<WebsiteResponse> => {
  validateResponse(response)

  const monitor = await webMonitorGetOne(response.monitorId)
  const resObject = await WebsiteResponse.create(response)
  const originalStatus = monitor.status

  const updatePayload: Partial<WebsiteMonitor> = {
    responseTime: response.responseTime,
    lastCheck: new Date()
  }

  await monitor.updateOne(updatePayload)
  await handleWebMonitorResponseTime(monitor)

  if (monitor.status !== originalStatus)
    await webMonitorStatusChange(monitor, originalStatus, monitor.status)

  return resObject
}

export const webMonitorRegisterEvent = async (
  monitor: WebsiteMonitor,
  event: { message: string } | IEvent
) => {
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
) => {
  await webMonitorRegisterEvent(monitor, {
    message: `Status changed from ${oldStatus} to ${newStatus}.`
  })

  await produceSendEmail({
    toEmails: monitor.subscribers.filter((sub) => sub.email).map((sub) => sub.email || ''),
    subject: 'Monitor Status Change',
    body: `Website monitor status changed from ${oldStatus} to ${newStatus}.`
  })
}
