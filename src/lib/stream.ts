import { KafkaClient, Producer } from "kafka-node";
import { KAFKA_HOST, KAFKA_PORT } from "src/config";

export class Stream {
  client: KafkaClient;
  producer: Producer;

  constructor() {
    this.client = new KafkaClient({ kafkaHost: `${KAFKA_HOST}:${KAFKA_PORT}` });
    this.producer = this.createProducer();
  }

  createProducer = () => {
    return new Producer(this.client);
  };
}

