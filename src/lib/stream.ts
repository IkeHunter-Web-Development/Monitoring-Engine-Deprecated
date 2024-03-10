// import { Consumer, KafkaClient, Producer } from "kafka-node";
import { Kafka, type Consumer, type KafkaMessage, type Producer, logLevel } from 'kafkajs'
import { KAFKA_HOST, KAFKA_PORT } from 'src/config'

export type StreamTopic = 'monitors' | 'notifications' | 'monitor-events'
interface StreamMessage {
  action: string
  data: any
}

export class Stream {
  client: Kafka | null
  producer: Producer | null
  consumer: Consumer | null
  static instance: Stream

  private constructor() {
    this.client = new Kafka({
      clientId: 'monitor-engine',
      brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
      retry: {
        retries: 3,
        restartOnFailure: async () => false,
        maxRetryTime: 5000
      },
      logLevel: logLevel.NOTHING
    })

    this.producer = this.client.producer()
    this.consumer = this.client.consumer({ groupId: 'monitor-engine' })
  }

  public static getInstance = (): Stream => {
    if (!Stream.instance) {
      Stream.instance = new Stream()
    }

    return Stream.instance
  }

  public send = async (topic: StreamTopic, messages: StreamMessage[]): Promise<void> => {
    await this.producer?.connect()
    await this.producer?.send({
      topic,
      messages: messages.map((message) => ({
        value: JSON.stringify(message)
      }))
    })
    await this.producer?.disconnect()
  }

  public subscribe = async (
    topic: StreamTopic,
    onMessage: (data: { topic: string; partition: number; message: KafkaMessage }) => void
  ): Promise<void> => {
    await this.consumer?.connect().catch((error) => {
      console.log('Error connecting to consumer:', error)
      return null
    })
    await this.consumer?.subscribe({ topic }).catch((error) => {
      console.log('Error subscribing to consumer:', error)
      return null
    })
    await this.consumer
      ?.run({
        eachMessage: async ({ topic, partition, message }) => {
          onMessage({ topic, partition, message })
        }
      })
      .catch((error) => {
        console.log('Error listening for messages on consumer:', error)
        return null
      })
  }
}
