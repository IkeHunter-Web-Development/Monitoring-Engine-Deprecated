/**
 * @fileoverview Event manager class.
 */
import { MonitorService } from "src/services";
import { Event, Monitor } from "src/models";

export class EventService {
  static async parseData(data: any) {
    let monitor = await MonitorService.getMonitor(data.monitorId);

    if (!monitor) throw new Error("Monitor id invalid. Monitor doesn't exist.");

    let payload = {
      monitorId: monitor?._id,
      projectId: data.projectId || monitor?.projectId,
      status: data.status,
      statusCode: data.statusCode,
      online: data.online,
      timestamp: data.timestamp ? data.timestamp : Date.now(),
      message: data.message,
      responseTime: data.responseTime,
    };

    return payload;
  }

  /**
   * Creates a new event.
   *
   * @param monitorId The id of the monitor the event belongs to.
   * @param statusCode The status code of the event.
   * @param online Whether the monitor was online or offline.
   * @param message The message of the event.
   *
   * @returns The created event.
   */
  static async createEvent(data: any): Promise<Event> {
    const payload = await this.parseData(data);

    let event: Event = await Event.create(payload)
      .then((event) => {
        if (!event) throw new Error("Error creating event! No event returned.");

        return event;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return event;
  }

  /**
   * Register generic event.
   *
   * @param monitorId The id of the monitor the event belongs to.
   * @param status Monitor status at time of event
   * @param statusCode The status code of the event.
   * @param message The message of the event.
   */
  static async registerGenericEvent(
    monitor: Monitor,
    status: string,
    statusCode: number,
    message: string
  ) {
    const payload = {
      monitorId: monitor._id,
      status,
      statusCode,
      message,
      timestamp: new Date(),
    };

    const event: Event = await Event.create(payload);

    return event;
  }

  /**
   * Register a down event.
   *
   * @param monitorId The id of the monitor the event belongs to.
   * @param statusCode The status code of the event.
   * @param message The message of the event.
   *
   * @returns The created event.
   */
  static async registerDownEvent(monitor: Monitor, statusCode: number, message: string) {
    let event = await EventService.createEvent({
      monitorId: monitor._id,
      statusCode: statusCode,
      online: false,
      message: message,
    }).catch((err: any) => {
      console.log(err);
      throw err;
    });

    return event;
  }

  /**
   * Register an up event.
   *
   * @param monitorId The id of the monitor the event belongs to.
   * @param statusCode The status code of the event.
   * @param message The message of the event.
   *
   * @returns The created event.
   */
  static async registerUpEvent(monitor: Monitor, statusCode: number, message: string) {
    let event = await EventService.createEvent({
      monitorId: monitor._id,
      statusCode: statusCode,
      online: true,
      message: message,
    }).catch((err: any) => {
      console.log(err);
      throw err;
    });

    return event;
  }

  /**
   * Gets an event.
   *
   * @param id The id of the event to get.
   *
   * @returns The event.
   */
  static async getEvent(id: string): Promise<Event | null> {
    let event = await Event.findOne({ _id: id })
      .then((event) => {
        return event || null;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return event;
  }

  /**
   * Gets all events for a monitor.
   *
   * @param monitorId The id of the monitor to get events for.
   *
   * @returns The events.
   */
  static async getEventsForMonitor(monitor: Monitor): Promise<Event[]> {
    let events = await Event.find({ monitorId: monitor._id })
      .then((event) => {
        return event;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return events;
  }

  /**
   * Gets all offline events for a monitor.
   *
   * @param monitorId The id of the monitor to get offline events for.
   *
   * @returns The offline events.
   */
  // TODO: Is this needed? Should this have range?
  static async getOfflineEventsForMonitor(monitorId: string): Promise<Event[]> {
    let events = await Event.find({ monitorId: monitorId, online: false }).catch((err: any) => {
      console.log(err);
      throw err;
    });

    return events;
  }

  /**
   * Gets the last time a monitor was offline.
   *
   * @param monitorId The id of the monitor to get the last offline time for.
   *
   * @returns The last offline time.
   */
  static async getLastOfflineTimeForMonitor(monitorId: string): Promise<Event | null> {
    let event = await Event.findOne({ monitorId: monitorId, online: false })
      .sort({ timestamp: -1 })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return event;
  }

  /**
   * Gets the last time a monitor was online.
   *
   * @param monitorId The id of the monitor to get the last online time for.
   *
   * @returns The last online time.
   */
  static async getLastOnlineTimeForMonitor(monitorId: string): Promise<Event | null> {
    let event = await Event.findOne({ monitorId: monitorId, online: true })
      .sort({ timestamp: -1 })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return event;
  }

  /**
   * Delete an event.
   *
   * @param id The id of the event to delete.
   *
   * @returns Boolean, whether deletion was successful.
   */
  static async deleteEvent(id: string): Promise<boolean> {
    let event = await Event.findById(id).catch((err: any) => {
      console.log(err);
      throw err;
    });

    if (!event) return false;
    let status = event
      .deleteOne()
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return status;
  }
  /**
   * Filter events.
   *
   * @param params The query parameters.
   * @param events The events to filter.
   *
   * @returns The filtered events.
   */
  static async filterEvents(params: any, events: Array<Event>): Promise<Event[]> {
    let filteredEvents: Array<Event> = events;

    if (params.online != null) {
      filteredEvents = filteredEvents.filter((event: Event) => {
        return String(event.online) === params.online;
      });
    }

    if (params.last) {
      filteredEvents = filteredEvents.sort((a: Event, b: Event) => {
        return b.timestamp!.getTime() - a.timestamp!.getTime();
      });

      filteredEvents = [filteredEvents[0]];
    }

    return filteredEvents || [];
  }

  /**
   * Search events.
   * Must have a monitor specified.
   *
   * @param params The query parameters.
   *
   * @returns The events.
   */
  static async searchEvents(params: any): Promise<Event[]> {
    let criteria: any = {};
    // let events: Event[] = [];
    let monitor: Monitor;

    if (params.monitor) {
      monitor = await MonitorService.getMonitor(params.monitor)
        .then((monitor: Monitor | null) => {
          if (!monitor) throw new Error("Monitor not found");
          return monitor;
        })
        .catch((err: any) => {
          console.log(err);
          throw err;
        });
    } else {
      throw new Error("No monitor specified");
    }
    if (params.online != null) {
      criteria.online = params.online;
    }

    if (params.last) {
      criteria.timestamp = -1;
    }

    let allEvents: Array<Event> = await EventService.getEventsForMonitor(monitor);

    return EventService.filterEvents(params, allEvents) || [];
  }

  /**
   * Get events in a range.
   *
   * @param monitor The monitor to get events for.
   * @param start The start of the range.
   * @param end The end of the range.
   * @returns The events in the range.
   */
  // TODO: CHECK THIS!
  static async getEventsInRange(monitor: Monitor, start: Date, end: Date): Promise<Event[]> {
    let events = await Event.find({
      monitorId: monitor._id,
      timestamp: {
        $gte: start,
        $lte: end,
      },
    }).catch((err: any) => {
      console.log(err);
      throw err;
    });

    events = events.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());

    return events || [];
  }

  // TODO: CHECK THIS!
  static async getDowntimeFromEvents(events: Event[]): Promise<number> {
    let downTime = 0;
    let lastOnlineTime = null;
    let lastOfflineTime = null;

    for (let event of events) {
      if (event.online) {
        if (lastOfflineTime) {
          downTime += event.timestamp!.getTime() - lastOfflineTime.getTime();
          lastOfflineTime = null;
        }
        lastOnlineTime = event.timestamp;
      } else {
        if (lastOnlineTime) {
          lastOfflineTime = event.timestamp;
        }
      }
    }

    return downTime;
  }

  // TODO: CHECK THIS!
  static async filterDowntimeEvents(events: Event[]): Promise<Event[]> {
    let filteredEvents: Event[] = [];

    for (let event of events) {
      if (!event.online) {
        filteredEvents.push(event);
      }
    }

    return filteredEvents;
  }

  static async getAverageResponseTimeFromEvents(events: Event[]): Promise<number> {
    let totalResponseTime = 0;
    let totalEvents = 0;

    for (let event of events) {
      if (event.responseTime) {
        totalResponseTime += event.responseTime;
        totalEvents++;
      }
    }

    return totalResponseTime / totalEvents;
  }
}
