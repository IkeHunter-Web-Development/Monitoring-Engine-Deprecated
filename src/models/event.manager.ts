/**
 * @fileoverview Event manager class.
 */
import Event, { EventType } from "./event.model";

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
    let payload = {
      monitorId: data.monitorId,
      statusCode: data.statusCode,
      online: data.online,
      timestamp: data.timestamp ? data.timestamp : Date.now(),
      message: data.message,
    };

    let event = Event.create(payload)
      .catch((err: any) => {
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
  static async getEvent(id: string) {
    let event = await Event.findById(id)
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
  static async getEventsForMonitor(monitorId: string) {
    let events = await Event.find({monitorId: monitorId})
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
  static async getOfflineEventsForMonitor(monitorId: string) {
    let events = await Event.find({monitorId: monitorId, online: false})
      .catch((err: any) => {
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
  static async getLastOfflineTimeForMonitor(monitorId: string) {
    let event = await Event.findOne({monitorId: monitorId, online: false}).sort({timestamp: -1})
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
  static async getLastOnlineTimeForMonitor(monitorId: string) {
    let event = await Event.findOne({monitorId: monitorId, online: true}).sort({timestamp: -1})
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
  static async deleteEvent(id: string) {
    let event = await Event.findById(id)
      .catch((err: any) => {
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
}
