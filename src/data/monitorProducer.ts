// import { Producer } from "kafka-node";
import { Stream, StreamTopic } from "src/lib";
import { Monitor } from "src/models";

type MonitorProducerAction = "create" | "delete";

export class MonitorProducer {
  static instance: MonitorProducer;
  protected stream: Stream;

  private constructor() {
    this.stream = Stream.getInstance();
  }

  public static getInstance = () => {
    if (!MonitorProducer.instance) {
      MonitorProducer.instance = new MonitorProducer();
    }

    return MonitorProducer.instance;
  };

  public static sendMonitorMessage = async (action: MonitorProducerAction, data: Monitor) => {
    const instance = this.getInstance();
    const topic: StreamTopic = "monitors";

    await instance.stream.send(topic, [{ action, data: data }]);
  };
}
