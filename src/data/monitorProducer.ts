import { Producer } from "kafka-node";
import { Stream } from "src/lib";

export class MonitorProducer {
  protected producer: Producer | null;
  static instance: MonitorProducer;

  private constructor() {
    this.producer = new Stream().createProducer();

    this.producer?.on("ready", () => {
      console.log("Connected to Kafka client.");
    });
  }

  public static getInstance = () => {
    if (!MonitorProducer.instance) {
      MonitorProducer.instance = new MonitorProducer();
    }

    return MonitorProducer.instance;
  };

  public static sendMessage = async (topic: string, action: string, data: any) => {
    const instance = this.getInstance();
    console.log('producer:', instance.producer);

    instance.producer?.send(
      [
        {
          topic,
          messages: JSON.stringify({
            action,
            data: JSON.stringify(data),
          }),
        },
      ],
      (error, data) => {
        if (error) {
          console.log("Error sending message:", error);
          throw error;
        }

        console.log("Message sent to stream:", data);
      }
    );
  };
}
