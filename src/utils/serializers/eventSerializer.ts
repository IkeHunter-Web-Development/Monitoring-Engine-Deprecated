import type { Event } from 'src/models'
import { NotImplementedError } from '../exceptions'

export const serializeEvent = (event: Event): Promise<IEventMeta> => {
  throw new NotImplementedError('Serialize event')
}
export const serializeEvents = async (events: Event[]): Promise<IEventMeta[]> => {
  return await Promise.all(events.map(async (event) => serializeEvent(event)))
}
