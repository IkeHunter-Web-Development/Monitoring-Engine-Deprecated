import type { Event } from 'src/models'

export const serializeEvent = (event: Event): IEventMeta => {
  const eventMeta: IEventMeta = {
    id: event.id,
    createdAt: event.createdAt.getTime(),
    projectId: event.projectId,
    message: event.message,
    monitorId: event.monitorId?.toString(),
    timestamp: event.timestamp?.getTime(),
    incidentId: event.incidentId?.toString()
  }

  return eventMeta
}
export const serializeEvents = async (events: Event[]): Promise<IEventMeta[]> => {
  // return await Promise.all(events.map(async (event) => serializeEvent(event)))
  return events.map((event) => serializeEvent(event))
}
