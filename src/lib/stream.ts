// import { Consumer, KafkaClient, Producer } from "kafka-node";
import { Kafka, Producer, Consumer, KafkaMessage } from "kafkajs";
import { KAFKA_HOST, KAFKA_PORT } from "src/config";

export type StreamTopic = "monitors" | "notifications" | "monitor-events";
type StreamMessage = {
  action: string;
  data: any;
}

export class Stream {
  client: Kafka | null;
  producer: Producer | null;
  consumer: Consumer | null;
  static instance: Stream;

  private constructor() {
    this.client = new Kafka({
      clientId: "monitor-engine",
      brokers: [`${KAFKA_HOST}:${KAFKA_PORT}`],
    });

    this.producer = this.client.producer();
    this.consumer = this.client.consumer({ groupId: "monitor-engine" });
  }

  public static getInstance = () => {
    if (!Stream.instance) {
      Stream.instance = new Stream();
    }

    return Stream.instance;
  };

  public send = async (topic: StreamTopic, messages: StreamMessage[]) => {
    await this.producer?.connect();
    await this.producer?.send({
      topic,
      messages: messages.map((message) => ({
        value: JSON.stringify(message),
      })),
    });
    await this.producer?.disconnect();
  };
  public subscribe = async (
    topic: StreamTopic,
    onMessage: (data: { topic: string; partition: number; message: KafkaMessage }) => void
  ) => {
    await this.consumer?.connect();
    await this.consumer?.subscribe({ topic });
    await this.consumer?.run({
      eachMessage: async ({ topic, partition, message }) =>
        onMessage({ topic, partition, message }),
    });
  };
}
