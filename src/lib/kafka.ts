import { Kafka, logLevel } from 'kafkajs'
import { KAFKA_BROKERS, KAFKA_GROUP_ID } from 'src/config'
import { logger } from './logger'

export const kafka = new Kafka({
  clientId: KAFKA_GROUP_ID,
  brokers: KAFKA_BROKERS,
  retry: {
    retries: 3,
    // restartOnFailure: async () => false,
    maxRetryTime: 5000
  },
  logLevel: logLevel.NOTHING
})

/**
 * Create a producer for a Kafka topic.
 * @param topic - The topic to produce to.
 * @param action - The action to send to the consumer.
 */
export const createProducer =
  <T>(topic: string, action: string) =>
  async (data: T) => {
    const producer = kafka.producer()
    await producer.connect()
    await producer
      .send({
        topic,
        messages: [{ value: JSON.stringify({ action, data }) }]
      })
      .catch((error) => {
        console.error('Error sending producer message:', error)
      })
    await producer.disconnect()
  }

/**
 * Create a consumer for a Kafka topic.
 * @param topic - The topic to consume from.
 * @param action - The action to listen for.
 * @param callback - The callback to run when the action is received.
 */
export const createConsumer = (
  topic: string,
  action: string,
  callback: (data: any) => Promise<void>
) => {
  const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID })
  consumer.connect().then(() => {
    logger.info(`Consumer for "${action}" connected to topic ${topic}.`)
    consumer.subscribe({ topic })
    consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const payload = JSON.parse(message.value?.toString() || '')
          const { action: receivedAction, data } = payload

          if (receivedAction === action) {
            await callback(data)
          }
        } catch (error) {
          console.error('Error handling data from event queue:', error)
        }
      }
    })
  })
}
