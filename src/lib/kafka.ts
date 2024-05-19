/**
 * Kafka Configuration with KafkaJS
 *
 * Resources:
 * https://kafka.js.org/docs/introduction
 */

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
  connectionTimeout: 3000,

  retry: {
    retries: 3,
    // restartOnFailure: async () => true,
    maxRetryTime: 5000
  }
})

/**
 * Create a producer for a Kafka topic.
 * @param topic - The topic to produce to.
 * @param action - The action to send to the consumer.
 *
 * @returns wrapper function
 * @param key - Used to determine partition, resource level id
 * @param data - The data to send to Kafka
 *
 */
export const createProducer =
  <T>(topic: string, action?: string) =>
  async (key: string, data: T) => {
    const producer = kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
      retry: { retries: 3 }
    })
    await producer.connect()
    await producer
      .send({
        topic,
        messages: [{ key, value: JSON.stringify({ action, data }) }]
      })
      .then(() => {
        logger.debug(`Produced message for ${topic}.`)
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
 * @param options - Optional configuration parameters
 */
export const createConsumer = async (
  topic: string,
  callback: (data: any, action?: string) => Promise<void>,
  options?: { fromBeginning?: boolean }
) => {
  const consumer = kafka.consumer({
    groupId: `${KAFKA_GROUP_ID}-${topic}`,
    sessionTimeout: 10000,
    heartbeatInterval: 1000
  })
  await consumer.connect()
  await consumer
    .subscribe({
      topic,
      fromBeginning: options?.fromBeginning || true
    })
    .then(() => {
      logger.info(`Consumer created for ${topic}.`)
    })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const payload = JSON.parse(message.value?.toString() || '')
        const { action, data } = payload
        logger.debug(`Consumed message for ${topic}.`)

        await callback(data, action)
      } catch (error) {
        logger.error('Error handling data from event queue:', error)
      }
    }
  })
}
