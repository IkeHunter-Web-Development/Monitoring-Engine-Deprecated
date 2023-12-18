import kafka from "kafka-node";
import { KAFKA_HOST, KAFKA_PORT, NODE_ENV } from "src/config";

export class Stream {
  client: kafka.KafkaClient | null;
  producer: kafka.Producer | null;

  constructor() {
    this.client = this.createClient();
    this.producer = this.createProducer();
  }
  createClient = () => {
    if (NODE_ENV === "development" || NODE_ENV === "test") return null;
    return new kafka.KafkaClient({
      kafkaHost: `${KAFKA_HOST}:${KAFKA_PORT}`,
    });
  };

  createProducer = () => {
    if (NODE_ENV === "development" || NODE_ENV === "test") return null;
    return new kafka.Producer(this.client!);
  };
}
