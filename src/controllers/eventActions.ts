import type { Event } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const searchEvents = async (params: {
  monitorId?: string
  projectId?: string
}): Promise<Event[]> => {
  throw new NotImplementedError('Search events')
}
