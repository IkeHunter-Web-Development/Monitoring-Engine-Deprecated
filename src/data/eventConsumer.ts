import { Event, Monitor } from "src/models";
import { MonitorResponse } from "src/models/responseModel";
import { Network } from "src/services";

export class EventConsumer {
  constructor() {
    const consumer = Network.createConsumer("monitor-events");

    consumer.on("message", (message: any) => {
      try {
        const parsedMessage = JSON.parse(message.value);
        console.log("message recieved:", parsedMessage);

        if (String(parsedMessage.action).toLocaleLowerCase() === "register-event") {
          this.handleAddEvent(parsedMessage.data);
        } else if (String(parsedMessage.action).toLocaleLowerCase() === "register-response") {
          this.handleAddResponse(parsedMessage.data);
        }
      } catch (error) {
        console.error("Error getting data from stream:", error);
      }
    });
  }

  private handleAddEvent = async (eventMessage: any) => {
    const data: any = JSON.parse(eventMessage);

    const { monitorId, status, statusCode, message } = data;

    if (!monitorId) return;

    const event = await Event.create({
      monitorId,
      status,
      statusCode,
      message,
    });

    console.log("Event created:", event);

    const monitor = await Monitor.findOneAndUpdate({ _id: monitorId }, { status: status });
    console.log("monitor udpated: ", monitor);
  };

  private handleAddResponse = async (message: any) => {
    // if (new Date().getMinutes() % 10 !== 0) return;
    const data: any = JSON.parse(message);

    const { monitorId, responseTime, timestamp } = data;
    const monitor: Monitor | null = await Monitor.findById(monitorId);

    if (!monitor) return;

    // const responses = monitor
    await MonitorResponse.create({
      monitorId,
      responseTime,
      timestamp,
    });
  };

  public static registerConsumer = () => {
    return new EventConsumer();
  };
}
