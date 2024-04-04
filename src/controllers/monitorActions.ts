import { Event, WebsiteResponse, type WebsiteMonitor } from 'src/models'
import { validateEvent, validateResponse } from 'src/utils'
import { getMonitor } from './monitorResources'

export const registerWebsiteResponse = async (response: IResponse): Promise<WebsiteResponse> => {
  validateResponse(response)

  const monitor = await getMonitor(response.monitorId)
  const resObject = await WebsiteResponse.create(response)

  const updatePayload: Partial<WebsiteMonitor> = {
    responseTime: resObject.responseTime,
    lastCheck: new Date()
  }
  await monitor.updateOne(updatePayload)

  return resObject
}

export const registerMonitorEvent = async (monitor: WebsiteMonitor, event: IEvent) => {
  validateEvent(event)

  const newEvent = await Event.create({
    ...event,
    monitorId: monitor._id,
    projectId: monitor.projectId
  })

  return newEvent
}
