import { getMonitorEvents } from 'src/controllers'
import {
  getMonitorIncidents,
  getMonitorResponses,
  getMonitorSubscribers
} from 'src/controllers/monitorResources'
import type { WebsiteMonitor } from 'src/models'

export const serializeMonitor = async (monitor: WebsiteMonitor): Promise<IWebsiteMonitorMeta> => {
  const events = await getMonitorEvents(monitor)
  const responses = await getMonitorResponses(monitor)
  const subscribers = await getMonitorSubscribers(monitor)
  const incidents = await getMonitorIncidents(monitor)

  return {
    projectId: monitor.projectId,
    title: monitor.title,
    interval: monitor.interval,
    icon: monitor.icon,
    active: monitor.active,
    reminderIntervals: monitor.reminderIntervals,
    subscribers: subscribers.map((sub) => ({
      id: sub._id.toString(),
      monitorId: sub.monitorId.toString(),
      displayName: sub.displayName || '',
      email: sub.email,
      phone: sub.phone,
      method: sub.method,
      userId: sub.userId
    })),
    url: monitor.url,
    checkType: monitor.checkType,
    retries: monitor.retries,
    timeout: monitor.timeout,

    id: monitor._id.toString(),
    uuid: 'TODO',
    status: monitor.status,
    lastCheck: monitor.lastCheck?.getTime(),
    createdAt: monitor.createdAt?.getTime(),
    updatedAt: monitor.updatedAt?.getTime(),
    events: events.map((event) => ({
      id: event._id.toString(),
      projectId: event.projectId,
      message: event.message,
      incidentId: event.incidentId?.toString(),
      timestamp: event.timestamp?.getTime(),
      createdAt: event.createdAt.getTime()
    })),
    responses: responses.map((res) => ({
      id: res._id.toString(),
      monitorId: res.monitorId.toString(),
      responseTime: res.responseTime,
      createdAt: res.createdAt?.getTime()
    })),
    incidents: incidents.map((incident) => ({
      id: incident._id.toString(),
      monitorId: incident.monitorId.toString(),
      impact: incident.impact,
      status: incident.status,
      cause: incident.cause,
      displayName: incident.displayName,
      notes: incident.notes,
      createdAt: incident.createdAt.getTime(),
      updatedAt: incident.updatedAt.getTime(),
      resolvedAt: incident.resolvedAt?.getTime()
    })),
    availability: monitor.availability,
    responseTime: monitor.responseTime
  }
}

export const serializeMonitors = async (
  monitors: WebsiteMonitor[]
): Promise<IWebsiteMonitorMeta[]> => {
  return await Promise.all(monitors.map((monitor) => serializeMonitor(monitor)))
}
