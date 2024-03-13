import { Types } from 'mongoose'

export const responseExample: IResponse = {
  monitorId: new Types.ObjectId().toString(),
  responseTime: 500
}
