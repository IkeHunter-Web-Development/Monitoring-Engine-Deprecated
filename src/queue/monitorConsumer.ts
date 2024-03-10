import { registerWebsiteResponse } from 'src/controllers'
import { EventConsumer, EventQueue } from 'src/lib'
import { validateResponse } from 'src/utils'

const eventQueue = EventQueue.getInstance()
const monitorConsumer = new EventConsumer(eventQueue, 'monitor-events')

const handleConsumerReceiveResponse = async (data: any) => {
  try {
    const response: IResponse = await validateResponse(data)
    await registerWebsiteResponse(response)
  } catch (error) {
    console.error('Error handling website response from consumer:', error)
  }
}

monitorConsumer.registerConsumer('register-response', handleConsumerReceiveResponse)
export const MonitorEventsConsumer = monitorConsumer
