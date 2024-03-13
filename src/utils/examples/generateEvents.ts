import { Types } from 'mongoose'
import { Event } from 'src/models'
import { eventExample } from 'src/utils'

export const generateEvents = async (
  count: number,
  defaults?: {
    projectIds?: string[]
    monitorIds?: string[]
  }
): Promise<Event[]> => {
  const events = []
  const monitorIds = defaults?.monitorIds
  const projectIds = defaults?.projectIds

  for (let i = 0; i < count; i++) {
    const projectId = projectIds
      ? projectIds[Math.floor(Math.random() * projectIds.length)]
      : `project-${i}`
    const monitorId = monitorIds
      ? monitorIds[Math.floor(Math.random() * monitorIds.length)]
      : new Types.ObjectId().toString()
    const event: Event = await Event.create({ ...eventExample, projectId, monitorId })
    events.push(event)
  }
  return events
}

export const generateEventSchemas = (
  count: number,
  defaults?: {
    projectIds?: string[]
    monitorIds?: string[]
  }
): IEvent[] => {
  const events = []
  const monitorIds = defaults?.monitorIds
  const projectIds = defaults?.projectIds

  for (let i = 0; i < count; i++) {
    const projectId = projectIds
      ? projectIds[Math.floor(Math.random() * projectIds.length)]
      : `project-${i}`
    const monitorId = monitorIds
      ? monitorIds[Math.floor(Math.random() * monitorIds.length)]
      : `project-${i}`
    const schema: IEvent = { ...eventExample, monitorId, projectId }
    events.push(schema)
  }
  return events
}
