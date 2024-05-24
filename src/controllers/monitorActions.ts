import { produceSendEmail } from 'src/events'
import { Event, WebsiteResponse, type WebsiteMonitor } from 'src/models'
import { handleWebMonitorResponseTime } from 'src/services/monitorService'
import { validateResponse } from 'src/utils'
import { getWebMonitor } from './monitorResources'

export const registerWebMonitorResponse = async (response: IResponse): Promise<WebsiteResponse> => {
  validateResponse(response)

  const monitor = await getWebMonitor(response.monitorId)
  const resObject = await WebsiteResponse.create({
    ...response,
    timestamp: new Date(response.timestamp)
  })
  const originalStatus = monitor.status

  const updatePayload: Partial<WebsiteMonitor> = {
    responseTime: response.responseTime,
    lastCheck: new Date()
  }

  await monitor.updateOne(updatePayload)
  await handleWebMonitorResponseTime(monitor)
  const updatedMonitor = await getWebMonitor(monitor._id)

  if (updatedMonitor.status !== originalStatus)
    await handleWebMonitorStatusChange(updatedMonitor, originalStatus, updatedMonitor.status)

  return resObject
}

export const registerWebMonitorEvent = async (monitor: WebsiteMonitor, message: string) => {
  // validateEvent(event)

  const newEvent = await Event.create({
    message,
    monitorId: monitor._id,
    projectId: monitor.projectId
  })

  return newEvent
}

export const handleWebMonitorStatusChange = async (
  monitor: WebsiteMonitor,
  oldStatus: MonitorStatus,
  newStatus: MonitorStatus
) => {
  await registerWebMonitorEvent(monitor, `Status changed from ${oldStatus} to ${newStatus}.`)

  await produceSendEmail(monitor._id.toString(), {
    toEmails: monitor.subscribers.filter((sub) => sub.email).map((sub) => sub.email || ''),
    subject: 'Monitor Status Change',
    body: `Website monitor status changed from ${oldStatus} to ${newStatus}.`
  })
}
