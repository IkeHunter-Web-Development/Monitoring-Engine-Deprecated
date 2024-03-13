import type { Types } from 'mongoose'
import { Event } from 'src/models'

export const searchEvents = async (params: {
  monitorId?: string | Types.ObjectId
  projectId?: string
}): Promise<Event[]> => {
  const { monitorId, projectId } = params
  if (!monitorId && !projectId) return []

  const monitorEvents = monitorId ? await Event.find({ monitorId }) : []
  const projectEvents = projectId ? await Event.find({ projectId }) : []

  return [...monitorEvents, ...projectEvents]
}
