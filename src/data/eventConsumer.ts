// import { Monitor } from "src/models";
import { MonitorSocket } from "src/config";
import { Event, Monitor } from "src/models";
import { MonitorResponse } from "src/models/responseModel";
import { EventService, MonitorService, Network } from "src/services";

const RESPONSE_INTERVAL_MIN = 30;

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

    const monitor = await MonitorService.getMonitor(monitorId);

    if (!monitor) return;

    let event: Event | null = null;

    if (monitor.online === true && status === "offline") {
      event = await MonitorService.handleMonitorDown(monitor, statusCode, message);
      // const event = await EventService.createEvent();
    } else if (monitor.online === false && status === "online") {
      event = await MonitorService.handleMonitorBackOnline(monitor, statusCode);
    } else if (monitor.status === "pending") {
      // event = await EventService.registerUpEvent(monitor, statusCode, message);
      event = await MonitorService.registerEvent(monitor, status, statusCode, message);
    }

    if (event) MonitorSocket.pushClientEvent(monitorId, event);

    console.log("monitor udpated: ", monitor);
  };

  private handleAddResponse = async (message: any) => {
    const data: any = JSON.parse(message);
    const { monitorId, responseTime, timestamp } = data;
    MonitorSocket.updateClientResponseTimes(monitorId, responseTime);

    if (new Date().getMinutes() % RESPONSE_INTERVAL_MIN !== 0) return;

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
