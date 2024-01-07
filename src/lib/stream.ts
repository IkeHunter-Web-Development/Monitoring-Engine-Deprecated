// import { Consumer, KafkaClient, Producer } from "kafka-node";
import { Kafka, type Producer, type Consumer, type KafkaMessage } from 'kafkajs'
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
      brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`]
    })

    this.producer = this.client.producer()
    this.consumer = this.client.consumer({ groupId: 'monitor-engine' })
  }

  public static getInstance = (): Stream => {
    if (Stream.instance != null) {
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
    await this.consumer?.connect()
    await this.consumer?.subscribe({ topic })
    await this.consumer?.run({
      eachMessage: async ({ topic, partition, message }) => {
        onMessage({ topic, partition, message })
      }
    })
  }
}
