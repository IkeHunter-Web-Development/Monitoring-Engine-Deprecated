import { produceSendEmail, produceUpdateMonitor } from 'src/events'
import { Event, WebsiteResponse, type WebsiteMonitor } from 'src/models'
import {
  handleWebMonitorErrorResponse,
  handleWebMonitorResponseTime
} from 'src/services/monitorService'
import { serializeMonitor, validateResponse } from 'src/utils'
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
  const updatedMonitor = await handleWebMonitorResponseTime(monitor)

  if (updatedMonitor.status !== originalStatus)
    await handleWebMonitorStatusChange(updatedMonitor, originalStatus, updatedMonitor.status)

  return resObject
}

export const registerWebMonitorErrorResponse = async (response: IErrorResponse) => {
  const monitor = await getWebMonitor(response.monitorId)
  monitor.lastCheck = new Date()
  monitor.responseTime = undefined
  await monitor.save()

  await WebsiteResponse.create({
    ...response,
    monitorId: monitor._id,
    responseTime: null,
    timestamp: new Date(response.timestamp)
  })

  const originalStatus = monitor.status

  const updatedMonitor = await handleWebMonitorErrorResponse(monitor)

  if (updatedMonitor.status !== originalStatus)
    await handleWebMonitorStatusChange(updatedMonitor, originalStatus, updatedMonitor.status)
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
  const serialized = await serializeMonitor(monitor)
  await produceUpdateMonitor(monitor._id.toString(), serialized)

  await produceSendEmail(monitor._id.toString(), {
    toEmails: monitor.subscribers.filter((sub) => sub.email).map((sub) => sub.email || ''),
    subject: 'Monitor Status Change',
    body: `Website monitor status changed from ${oldStatus} to ${newStatus}.`
  })
}
