import { randomInt } from 'crypto'
import { Types } from 'mongoose'
import { WebsiteResponse } from 'src/models'

export const responseExample: IResponse = {
  monitorId: new Types.ObjectId().toString(),
  responseTime: randomInt(10, 2000)
}

export const createTestResponse = async (
  defaults: Partial<IResponse> = {}
): Promise<WebsiteResponse> => {
  const payload = { ...responseExample, ...defaults }
  return await WebsiteResponse.create(payload)
}

export const createTestResponses = async (
  count: number,
  defaults: Partial<IResponse>
): Promise<WebsiteResponse[]> => {
  return Promise.all(Array.from(Array(count)).map(async () => await createTestResponse(defaults)))
}
