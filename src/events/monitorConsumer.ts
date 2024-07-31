import { registerWebMonitorErrorResponse, registerWebMonitorResponse } from 'src/controllers'
import { logger } from 'src/lib'
import { validateResponse } from 'src/utils'
import { createConsumer } from '../lib/kafka'

const handleConsumerReceiveResponse = async (data: IResponse) => {
  try {
    console.log(data)
    const response: IResponse = await validateResponse(data)
    await registerWebMonitorResponse(response)
  } catch (error) {
    logger.error(`Error handling website response from consumer: ${error}`)
  }
}

const handleMonitorError = async (data: any) => {
  logger.error('Handle Monitor Error not implemented')
  // throw new NotImplementedError('Handle monitor error')
}

const handleMonitorErrorResponse = async (data: IErrorResponse) => {
  try {
    await registerWebMonitorErrorResponse(data)
  } catch (error) {
    logger.error(`Error handling website error response: ${error}`)
  }
}

export const registerMonitorConsumer = async () => {
  createConsumer('monitor-responses', handleConsumerReceiveResponse)
  createConsumer('monitor-responses-errors', handleMonitorErrorResponse)
  createConsumer('monitor-errors', handleMonitorError)
}
