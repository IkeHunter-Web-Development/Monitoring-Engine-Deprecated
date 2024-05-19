import { webMonitorRegisterResponse } from 'src/controllers'
import { validateResponse } from 'src/utils'
import { createConsumer } from '../lib/kafka'

// const eventQueue = EventQueue.getInstance()
// const monitorConsumer = new EventConsumer(eventQueue, 'monitor-events')

export const registerMonitorConsumer = async () => {
  const topic = 'monitor-events'

  const handleConsumerReceiveResponse = async (data: any) => {
    try {
      const response: IResponse = await validateResponse(data)
      await webMonitorRegisterResponse(response)
    } catch (error) {
      console.error('Error handling website response from consumer:', error)
    }
  }

  createConsumer(topic, 'register-response', handleConsumerReceiveResponse)
}
