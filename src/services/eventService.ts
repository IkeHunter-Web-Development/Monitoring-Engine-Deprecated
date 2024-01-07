// /**
//  * @fileoverview Event manager class.
//  */
// // import { MonitorService } from "src/services";
// import { Event, Monitor } from "src/models";
// import { validateEvent } from "src/validators";

// export class EventService {
//   // static async parseData(data: any) {
//   //   let monitor = await MonitorService.getMonitor(data.monitorId);

//   //   if (!monitor) throw new Error("Monitor id invalid. Monitor doesn't exist.");

//   //   let payload = {
//   //     monitorId: monitor?._id,
//   //     projectId: data.projectId || monitor?.projectId,
//   //     status: data.status || monitor?.status,
//   //     statusCode: data.statusCode,
//   //     online: data.online,
//   //     timestamp: data.timestamp ? data.timestamp : Date.now(),
//   //     message: data.message,
//   //     responseTime: data.responseTime,
//   //   };

//   //   return payload;
//   // }

//   /**
//    * Creates a new event.
//    *
//    * @param monitorId The id of the monitor the event belongs to.
//    * @param statusCode The status code of the event.
//    * @param online Whether the monitor was online or offline.
//    * @param message The message of the event.
//    *
//    * @returns The created event.
//    */
//   static async createEvent(data: any): Promise<Event> {
//     // const payload = await this.parseData(data);
//     const payload = validateEvent(data);

//     let event: Event = await Event.create(payload)
//       .then((event) => {
//         if (!event) throw new Error("Error creating event! No event returned.");

//         return event;
//       })
//       .catch((err: any) => {
//         console.log(err);
//         throw err;
//       });

//     return event;
//   }

//   // /**
//   //  * Register generic event.
//   //  *
//   //  * @param monitorId The id of the monitor the event belongs to.
//   //  * @param status Monitor status at time of event
//   //  * @param statusCode The status code of the event.
//   //  * @param message The message of the event.
//   //  */
//   // static async registerGenericEvent(
//   //   monitor: Monitor,
//   //   status: string,
//   //   statusCode: number,
//   //   message: string
//   // ) {
//   //   const payload = {
//   //     monitorId: monitor._id,
//   //     projectId: monitor.projectId,
//   //     status,
//   //     statusCode,
//   //     message,
//   //     timestamp: new Date(),
//   //   };

//   //   const event: Event = await Event.create(payload);

//   //   return event;
//   // }

//   // /**
//   //  * Register a down event.
//   //  *
//   //  * @param monitorId The id of the monitor the event belongs to.
//   //  * @param statusCode The status code of the event.
//   //  * @param message The message of the event.
//   //  *
//   //  * @returns The created event.
//   //  */
//   // static async registerDownEvent(monitor: Monitor, statusCode: number, message: string) {
//   //   let event = await EventService.createEvent({
//   //     monitorId: monitor._id,
//   //     statusCode: statusCode,
//   //     status: "offline",
//   //     online: false,
//   //     message: message,
//   //   }).catch((err: any) => {
//   //     console.log(err);
//   //     throw err;
//   //   });

//   //   return event;
//   // }

//   /**
//    * Register an up event.
//    *
//    * @param monitorId The id of the monitor the event belongs to.
//    * @param statusCode The status code of the event.
//    * @param message The message of the event.
//    *
//    * @returns The created event.
//    */
//   static async registerUpEvent(monitor: Monitor, statusCode: number, message: string) {
//     let event = await EventService.createEvent({
//       monitorId: monitor._id,
//       statusCode: statusCode,
//       status: "online",
//       online: true,
//       message: message,
//     }).catch((err: any) => {
//       console.log(err);
//       throw err;
//     });

//     return event;
//   }

//   /**
//    * Gets all events for a monitor.
//    *
//    * @param monitorId The id of the monitor to get events for.
//    *
//    * @returns The events.
//    */
//   static async getEventsForMonitor(monitor: Monitor): Promise<Event[]> {
//     let events = await Event.find({ monitorId: monitor._id })
//       .then((event) => {
//         return event;
//       })
//       .catch((err: any) => {
//         console.log(err);
//         throw err;
//       });

//     return events;
//   }

//   /**
//    * Filter events.
//    *
//    * @param params The query parameters.
//    * @param events The events to filter.
//    *
//    * @returns The filtered events.
//    */
//   static async filterEvents(params: any, events: Array<Event>): Promise<Event[]> {
//     let filteredEvents: Array<Event> = events;

//     if (params.online != null) {
//       filteredEvents = filteredEvents.filter((event: Event) => {
//         return String(event.online) === params.online;
//       });
//     }

//     if (params.last) {
//       filteredEvents = filteredEvents.sort((a: Event, b: Event) => {
//         return b.timestamp!.getTime() - a.timestamp!.getTime();
//       });

//       filteredEvents = [filteredEvents[0]];
//     }

//     return filteredEvents || [];
//   }

//   /**
//    * Get events in a range.
//    *
//    * @param monitor The monitor to get events for.
//    * @param start The start of the range.
//    * @param end The end of the range.
//    * @returns The events in the range.
//    */
//   // TODO: CHECK THIS!
//   static async getEventsInRange(monitor: Monitor, start: Date, end: Date): Promise<Event[]> {
//     let events = await Event.find({
//       monitorId: monitor._id,
//       timestamp: {
//         $gte: start,
//         $lte: end,
//       },
//     }).catch((err: any) => {
//       console.log(err);
//       throw err;
//     });

//     events = events.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());

//     return events || [];
//   }
// }
