import type { Types } from 'mongoose'
import { Event } from 'src/models'

export const eventSearch = async (params: {
  monitorId?: string | Types.ObjectId
  projectId?: string | string[]
}): Promise<Event[]> => {
  const { monitorId, projectId } = params
  if (!monitorId && !projectId) return []

  const events: Event[] = []

  const monitorEvents = monitorId ? await Event.find({ monitorId }) : []
  events.push(...monitorEvents)

  if (projectId && Array.isArray(projectId)) {
    const projectEvents = await Event.find().all('projectId', projectId)
    events.push(...projectEvents)
  } else if (projectId) {
    const projectEvents = await Event.find({ projectId })
    events.push(...projectEvents)
  }

  return events
}
