import { Types } from 'mongoose'

export const eventExample: IEvent = {
  projectId: new Types.ObjectId().toString(),
  message: 'Example Event',
  timestamp: Date.now()
}
