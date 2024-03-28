/**
 * Serializer Schemas
 *
 * Resource schemas contain all editable fields on
 * a resource. Resource meta schemas contain all of
 * the fields from the resource schemas, plus additional
 * fields with metrics and obtained data.
 */
interface IEvent {
  projectId: string
  message: string
  monitorId?: string
  timestamp?: number // Date, ms
}
interface IEventMeta extends IEvent {
  id: string
  createdAt: number // Date, ms
  incidentId?: string
}
interface IResponse {
  monitorId: string
  responseTime: number // ms
}
interface IResponseMeta extends IResponse {
  id: string
  createdAt: number // Date, ms
}
interface ISubscriber {
  displayName?: string
  email?: string
  phone?: string
  method: NotificationMethod
  userId?: string
}
interface ISubscriberMeta extends ISubscriber {
  id: string
  monitorId: string
}
declare interface IMonitor {
  projectId: string
  title: string
  interval: number
  icon: string // Link to bucket
  active: boolean
  reminderIntervals: number
  subscribers: Array<ISubscriberMeta>
}
declare interface IMonitorMeta extends IMonitor {
  id: string
  uuid: string
  status: MonitorStatus
  lastCheck: number // Date, ms
  createdAt: number // Date, ms
  updatedAt: number // Date, ms
  events: Array<IEventMeta>
  responses: Array<IResponseMeta>
  incidents: Array<IIncidentMeta>
}

declare interface IWebsiteMonitor extends IMonitor {
  url: string
  checkType: 'http'
  retries: number
  timeout: number // s
}

declare interface IWebsiteMonitorMeta extends IMonitorMeta, IWebsiteMonitor {
  availability: WebsiteAvailability
  responseTime: number // ms
}

declare interface IIncident {
  monitorId: string
  impact: IncidentImpact
  status: IncidentStatus
  cause: string
  displayName?: string
  notes?: string
}
declare interface IIncidentMeta extends IIncident {
  id: string
  createdAt: number
  updatedAt?: number
  resolvedAt?: number
}
