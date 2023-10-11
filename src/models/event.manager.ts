/**
 * @fileoverview Event manager class.
 */
import Event, { EventType } from "./event.model";
import MonitorManager from "./monitor.manager";
import { MonitorType } from "./monitor.model";

export default class EventManager {
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
  static async createEvent(data: any) {
    let monitor = await MonitorManager.getMonitor(data.monitorId);
    if (!monitor) throw new Error("Monitor not found");

    let payload = {
      monitorId: monitor._id,
      statusCode: data.statusCode,
      online: data.online,
      timestamp: data.timestamp ? data.timestamp : Date.now(),
      message: data.message,
    };

    let event = Event.create(payload).catch((err: any) => {
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
  static async getEvent(id: string): Promise<EventType | null> {
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
  static async getEventsForMonitor(monitor: MonitorType): Promise<Array<EventType>> {
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
  static async getOfflineEventsForMonitor(monitorId: string): Promise<Array<EventType>> {
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
  static async getLastOfflineTimeForMonitor(monitorId: string): Promise<EventType | null> {
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
  static async getLastOnlineTimeForMonitor(monitorId: string): Promise<EventType | null> {
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
  static async filterEvents(params: any, events: Array<EventType>): Promise<Array<EventType>> {
    let filteredEvents: Array<EventType> = events;

    if (params.online != null) {
      filteredEvents = filteredEvents.filter((event: EventType) => {
        return String(event.online) === params.online;
      });
    }

    if (params.last) {
      filteredEvents = filteredEvents.sort((a: EventType, b: EventType) => {
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      
      filteredEvents = [filteredEvents[0]]
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
  static async searchEvents(params: any): Promise<Array<EventType>> {
    let criteria: any = {};
    let events: Array<EventType> = [];
    let monitor: MonitorType;

    if (params.monitor) {
      monitor = await MonitorManager.getMonitor(params.monitor)
        .then((monitor) => {
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

    let allEvents: Array<EventType> = await EventManager.getEventsForMonitor(monitor);

    return EventManager.filterEvents(params, allEvents) || [];
  }
}
