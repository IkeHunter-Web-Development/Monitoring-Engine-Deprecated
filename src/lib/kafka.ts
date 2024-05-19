import { Kafka, Partitioners, logLevel } from 'kafkajs'
import { KAFKA_BROKERS, KAFKA_GROUP_ID } from 'src/config'
import { logger } from './logger'

const toWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.ERROR:
      return 'warn'
    case logLevel.WARN:
      return 'info'
    case logLevel.INFO:
    case logLevel.NOTHING:
    case logLevel.DEBUG:
      return 'debug'
    default:
      return 'debug'
  }
}

const WinstonLogCreator = () => {
  return (entry: {
    namespace: string
    level: logLevel
    label: string
    log: { message: string }
  }) => {
    const { log, level } = entry
    const { message, ...extra } = log

    logger.log({
      level: toWinstonLogLevel(level),
      message,
      service: 'kafka',
      extra
    })
  }
}

export const kafka = new Kafka({
  clientId: KAFKA_GROUP_ID,
  brokers: KAFKA_BROKERS,
  logLevel: logLevel.INFO,
  logCreator: WinstonLogCreator,

  retry: {
    retries: 3,
    // restartOnFailure: async () => false,
    maxRetryTime: 5000
  }
})

/**
 * Create a producer for a Kafka topic.
 * @param topic - The topic to produce to.
 * @param action - The action to send to the consumer.
 */
export const createProducer =
  <T>(topic: string, action: string) =>
  async (data: T) => {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner
    })
    await producer.connect()
    await producer
      .send({
        topic,
        messages: [{ value: JSON.stringify({ action, data }) }]
      })
      .catch((error) => {
        logger.error('Error sending producer message:', error)
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
  callback: (data: any) => Promise<void>,
  options?: { fromBeginning?: boolean }
) => {
  const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID })
  consumer.connect().then(() => {
    logger.info(`Consumer created for ${topic}::${action}.`)
    consumer.subscribe({
      topic,
      fromBeginning: options?.fromBeginning || false
    })
    consumer.run({
      eachMessage: async ({ message }) => {
        logger.debug(`Received message for ${topic}::${action}.`)
        try {
          const payload = JSON.parse(message.value?.toString() || '')
          const { action: receivedAction, data } = payload

          if (receivedAction === action) {
            await callback(data)
          }
        } catch (error) {
          logger.error('Error handling data from event queue:', error)
        }
      }
    })
  })
}
