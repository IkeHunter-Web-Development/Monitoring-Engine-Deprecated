import { Types } from 'mongoose'

export const responseExample: IResponse = {
  monitorId: Types.ObjectId.toString(),
  responseTime: 500
}
