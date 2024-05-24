import { registerWebMonitorResponse } from 'src/controllers'
import { logger } from 'src/lib'
import { validateResponse } from 'src/utils'
import { createConsumer } from '../lib/kafka'

const topic = 'monitor-events'

const handleConsumerReceiveResponse = async (data: any) => {
  try {
    const response: IResponse = await validateResponse(data)
    await registerWebMonitorResponse(response)
  } catch (error) {
    logger.error('Error handling website response from consumer:', error)
  }
}

const handleMonitorError = async (data: any) => {
  logger.error('Handle Monitor Error not implemented')
  // throw new NotImplementedError('Handle monitor error')
}

export const registerMonitorConsumer = async () => {
  createConsumer('monitor-responses', handleConsumerReceiveResponse)
  createConsumer('monitor-errors', handleMonitorError)
}
