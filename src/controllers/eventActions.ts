import type { Types } from 'mongoose'
import { Event } from 'src/models'

export const searchEvents = async (params: {
  monitorId?: string | Types.ObjectId
  projectId?: string | string[]
}): Promise<Event[]> => {
  const { monitorId, projectId } = params
  if (!monitorId && !projectId) return []

  const events: Event[] = []

  const monitorEvents = monitorId ? await Event.find({ monitorId }) : []
  events.push(...monitorEvents)

  if (projectId && Array.isArray(projectId)) {
    const projectEvents = []

    for (const id of projectId) {
      const query = await Event.find({ projectId: id })
      projectEvents.push(...query)
    }

    events.push(...projectEvents)
  } else if (projectId) {
    const projectEvents = await Event.find({ projectId })
    events.push(...projectEvents)
  }

  return events
}
