// import { Monitor } from "src/models";
import { MonitorSocket } from "src/config";
import { Event, Monitor } from "src/models";
import { MonitorResponse } from "src/models/responseModel";
import { MonitorService } from "src/services";

import { Stream } from "src/lib";

const RESPONSE_INTERVAL_MIN = 30;

export class EventConsumer {
  static instance: EventConsumer;
  protected stream: Stream;
  private constructor() {
    this.stream = Stream.getInstance();
    this.initializeConsumers();
  }

  private initializeConsumers = () => {
    this.stream.subscribe("monitor-events", (res) => {
      console.log("received:", res.message.value?.toString());

      try {
        const payload = JSON.parse(res.message.value?.toString() || "");
        const { action, data } = payload;

        if (action === "register-event") {
          this.handleAddEvent(data);
        } else if (action === "register-response") {
          console.log("registering response:", data);
          this.handleAddResponse(data);
        }
      } catch (error) {
        console.error("Error getting data from stream:", error);
      }
    });
  };

  private handleAddEvent = async (data: any) => {
    const { monitorId, status, statusCode, message } = data;

    if (!monitorId) return;
    
    const monitor = await MonitorService.getMonitor(monitorId);
    if (!monitor) return;

    let event: Event | null = null;

    if (monitor.online === true && status === "offline") {
      event = await MonitorService.handleMonitorDown(monitor, statusCode, message);
    } else if (monitor.online === false && status === "online") {
      event = await MonitorService.handleMonitorBackOnline(monitor, statusCode);
    } else if (monitor.status === "pending") {
      event = await MonitorService.registerEvent(monitor, status, statusCode, message);
    }

    if (event) MonitorSocket.pushClientEvent(monitorId, event);

    console.log("monitor udpated: ", monitor);
  };

  private handleAddResponse = async (data: any) => {
    const { monitorId, responseTime, timestamp } = data;
    MonitorSocket.updateClientResponseTimes(monitorId, responseTime);

    if (new Date().getMinutes() % RESPONSE_INTERVAL_MIN !== 0) return;

    const monitor: Monitor | null = await Monitor.findById(monitorId);
    if (!monitor) return;

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
