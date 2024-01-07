/**
 * @fileoverview Manager for the monitor model.
 */
import { NODE_ENV } from 'src/config/constants'
import { Event, Monitor, MonitorResponse } from 'src/models'
import { MonitorProducer } from 'src/data'
import { getResponseTime } from 'src/utils'
import { validateMonitor } from 'src/validators'

// export class MonitorService {

export const MonitorService = {
  notifyCreateMonitor: async (monitor: Monitor): Promise<void> => {
    if (NODE_ENV === 'development') return
    await MonitorProducer.sendMonitorMessage('create', monitor)
  },

  // private static sendRecipientsPushNotification = async (
  //   monitor: Monitor,
  //   subject: string,
  //   body: string
  // ) => {
  //   const emailRecipients: string[] = monitor.recipients
  //     .filter((rec) => rec.preferredMethod === "email")
  //     .map((rec) => rec.email || "")
  //     .filter((email) => email !== "");
  //   const messageRecipients: string[] = monitor.recipients
  //     .filter((rec) => rec.preferredMethod === "phone")
  //     .map((rec) => rec.phone || "")
  //     .filter((phone) => phone !== "");

  //   console.log("email recipients:", emailRecipients);
  //   console.log("message recipients:", messageRecipients);

  //   if (emailRecipients.length > 0)
  //     await NotificationProducer.sendEmailMessage(emailRecipients, subject, body);

  //   if (messageRecipients.length > 0)
  //     await NotificationProducer.sendSmsMessage(messageRecipients, body);
  // };

  notifyDeleteMonitor: async (monitor: Monitor): Promise<void> => {
    if (NODE_ENV === 'development') return
    await MonitorProducer.sendMonitorMessage('delete', monitor)
  },

  // export const notifyMonitorDown = async (
  //   monitor: Monitor,
  //   statusCode: number,
  //   message: string
  // ) => {
  //   const subject = `${monitor.title} is down`;
  //   const body = `${monitor.title} is down. Status code: ${statusCode}. Message: ${message}`;

  //   this.sendRecipientsPushNotification(monitor, subject, body);
  // };

  // export const notifyMonitorUp = async (monitor: Monitor, statusCode: number) => {
  //   const subject = `${monitor.title} is back up`;
  //   const body = `Monitor ${monitor.title} is back online. Status code: ${statusCode}`;

  //   this.sendRecipientsPushNotification(monitor, subject, body);
  // };

  // /**
  //  * Parse data to create a monitor.
  //  *
  //  * @param data The data to parse.
  //  * @returns The parsed data.
  //  */
  // export const async parseData(data: any) {
  //   let payload = {
  //     projectId: data.projectId,
  //     url: data.url || "",
  //     recipients:
  //       data.recipients?.map((recipient: any) => ({
  //         name: recipient.name || "",
  //         email: recipient.email || "",
  //         phone: recipient.phone || "",
  //         enabled: recipient.enabled || true,
  //         preferredMethod: recipient.preferredMethod || "email",
  //       })) || [],
  //     title: data.title || "",
  //     status: data.status || "pending",
  //   };

  //   return payload;
  // }
  /**
   * Create a monitor.
   *
   * @param projectId The id of the project the monitor belongs to.
   * @param url The url to monitor.
   * @param recipients The users to notify when the monitor goes offline.
   * @param title The title of the monitor.
   * @returns The created monitor.
   */
  createMonitor: async (data: any): Promise<Monitor> => {
    const payload = validateMonitor(data)

    const initialResponseTime = await getResponseTime(String(data.url)).catch((error) => {
      console.log('URL failed initial check:', error)
      throw error
    })

    const monitor = await Monitor.create(payload)
      .then(async (monitor: Monitor) => {
        await MonitorService.notifyCreateMonitor(monitor)
        return monitor
      })
      .catch((err: any) => {
        console.log(err)
        throw err
      })

    await MonitorResponse.create({
      monitorId: monitor._id,
      responseTime: initialResponseTime,
      timestamp: Date.now()
    })

    return monitor
  },

  // /**
  //  * Update a monitor.
  //  *
  //  * @param id The id of the monitor to update.
  //  * @param payload The payload to update the monitor with.
  //  * @returns The updated monitor.
  //  */
  // export const updateMonitor = async (id: string, payload: any): Promise<Monitor> => {
  //   // TODO: Produce message on update

  //   const update = Monitor.findOneAndUpdate({ _id: id }, ...payload, { new: true })
  //     .then((monitor: any) => {
  //       return monitor
  //     })
  //     .catch((err: any) => {
  //       console.log(err)
  //       throw err
  //     })

  //   return await update
  // }

  // /**
  //  * Get a monitor.
  //  *
  //  * @param id The id of the monitor to get.
  //  * @returns The monitor.
  //  */
  // export const getMonitor(id: string): Promise<Monitor | null> {
  //   let monitor: Monitor | null = await Monitor.findById(id);

  //   if (!monitor) return null;
  //   return monitor;
  // }

  // /**
  //  * Get all monitors.
  //  *
  //  * @returns All monitors.
  //  */
  // export const getMonitors() {
  //   let monitors = await Monitor.find({});

  //   if (!monitors) return [];
  //   return monitors;
  // }

  // export const getMonitorDetails = async (
  //   networkToken: string,
  //   monitor: Monitor
  // ): Promise<Monitor> => {
  //   // async (monitor: Monitor) => {
  //   // const events: Event[] = await EventService.getEventsForMonitor(monitor);
  //   // const events: Event[] = await Event.find({ monitorId: monitor._id })

  //   // const report: Report = await ReportService.generateReport(monitor)
  //   // const responses = [
  //   //   {
  //   //     responseTime: 0,
  //   //     timestamp: new Date(),
  //   //   },
  //   // ];
  //   // const responses: MonitorResponse[] = await MonitorResponse.find({
  //   //   monitorId: monitor._id
  //   // })
  //   // const networkRes = await Network.getProjectInfo(networkToken, monitor)
  //   // const project: string = networkRes.projectTitle
  //   // const company: string = networkRes.companyName ?? 'No company.'

  //   // const responseTime = responses.length > 0 ? responses[responses.length - 1].responseTime : 0

  //   // try {
  //   //   const detail: MonitorDetail = {
  //   //     id: monitor._id.toString(),
  //   //     project,
  //   //     company,
  //   //     url: monitor.url,
  //   //     recipients: monitor.recipients,
  //   //     status: monitor.status,
  //   //     targetStatusCode: monitor.targetStatusCode,
  //   //     currentStatusCode: monitor.currentStatusCode,
  //   //     active: monitor.active,
  //   //     title: monitor.title,
  //   //     type: monitor.type,
  //   //     dateAdded: monitor.createdAt,
  //   //     responseTime,
  //   //     timeout: monitor.timeout,
  //   //     retries: monitor.retries,
  //   //     coverImage: monitor.coverImage,
  //   //     events,
  //   //     // report,
  //   //     responses
  //   //   }

  //   //   // console.log("detail: ", detail);

  //   //   return detail
  //   // } catch (error: any) {
  //   //   console.log('Error creating monitor details: ', error.message)
  //   //   throw error
  //   // }
  //   // }
  // }

  // /**
  //  * Get all monitors with their respective metrics,
  //  * events, reports.
  //  */
  // export const getDetailedMonitors = async (networkToken: string): Promise<MonitorDetail[]> => {
  //   // console.log("begine monitors detailed");
  //   const monitors = await Monitor.find({})
  //   if (monitors == null) return []
  //   // console.log("get monitors reached");

  //   const detailedMonitors: MonitorDetail[] = await Promise.all(
  //     monitors.map(async (monitor) => await getMonitorDetails(networkToken, monitor))
  //   )

  //   return detailedMonitors
  // }

  /**
   * Delete a monitor.
   *
   * @param id The id of the monitor to delete.
   * @returns Boolean, whether deletion was successful.
   */
  deleteMonitor: async (id: string): Promise<boolean> => {
    const monitor = await Monitor.findOne({ _id: id })
    if (monitor === null) throw new Error('Monitor not found, cannot delete.')

    await MonitorService.notifyDeleteMonitor(monitor)

    await Event.deleteMany({ monitorId: monitor._id })
    await Event.create({
      projectId: monitor.projectId,
      online: true,
      status: 'alert',
      statusCode: 200,
      message: `Monitor ${monitor.title} deleted.`
    })

    const status = monitor
      .deleteOne()
      .then(() => {
        return true
      })
      .catch((err: any) => {
        console.log(err)
        throw err
      })

    return await status
  }

  // /**
  //  * Search for monitors.
  //  *
  //  * @param query The query to search for.
  //  * @returns The monitors that match the query.
  //  */
  // export const searchMonitors(query: any) {
  //   let filters = {};

  //   filters = query.url ? { ...filters, url: query.url } : filters;
  //   filters = query.title ? { ...filters, title: query.title } : filters;

  //   let monitors = await Monitor.find(filters);

  //   if (query.userId) {
  //     monitors = monitors.filter((monitor: any) => {
  //       return monitor.recipients.some((user: any) => {
  //         return user.userId === query.userId;
  //       });
  //     });
  //   }

  //   if (query.projectId) {
  //     monitors = monitors.filter((monitor: any) => {
  //       return monitor.projectId === query.projectId;
  //     });
  //   }

  //   if (!monitors) return [];
  //   return monitors;
  // }
  /**
   * Check if a user has permission to access a monitor.
   *
   *
   * @param user The user to check.
   * @param monitor The monitor to check.
   * @returns Boolean, whether the user has permission.
   */
  // export const userHasPermission(user: User, monitor: Monitor) {
  //   return user.projectIds?.includes(monitor.projectId);
  // }

  // /**
  //  * Handle a monitor going down.
  //  *
  //  * @param monitor The monitor that went down.
  //  * @param statusCode The status code of the monitor.
  //  * @param error The error message of the monitor.
  //  * @returns Boolean, whether the monitor was handled.
  //  */
  // export const handleMonitorDown(
  //   monitor: Monitor,
  //   statusCode: number,
  //   error: string
  // ): Promise<Event | null> {
  //   const syncedMonitor = await Monitor.findById(monitor._id);
  //   if (!syncedMonitor) return null;

  //   let event = await EventService.registerDownEvent(syncedMonitor, statusCode, error);

  //   await syncedMonitor.updateOne({
  //     online: false,
  //     currentStatusCode: statusCode,
  //     status: "offline",
  //   });

  //   if (!event) return null;
  //   console.log("Handling monitor down: ", syncedMonitor.title, " ", statusCode, " ", error);

  //   await this.notifyMonitorDown(monitor, statusCode, error);

  //   return event;
  // }
  // /**
  //  * Handle a monitor going back online.
  //  *
  //  * @param monitor The monitor.
  //  * @param statusCode The status code of the monitor.
  //  * @returns Boolean, whether the monitor was handled.
  //  */
  // export const handleMonitorBackOnline(
  //   monitor: Monitor,
  //   statusCode: number
  // ): Promise<Event | null> {
  //   const syncedMonitor = await Monitor.findById(monitor._id);
  //   if (!syncedMonitor) return null;

  //   let event = await EventService.registerUpEvent(
  //     syncedMonitor,
  //     statusCode,
  //     "Monitor is back online."
  //   );
  //   await syncedMonitor.updateOne({
  //     online: true,
  //     currentStatusCode: statusCode,
  //     status: "online",
  //   });

  //   if (!event) return null;
  //   console.log("Handling monitor back online: ", syncedMonitor.title, " ", statusCode);

  //   await this.notifyMonitorUp(monitor, statusCode);

  //   return event;
  // }

  // export const registerEvent = async (
  //   monitor: Monitor,
  //   status: string,
  //   statusCode: number,
  //   message: string
  // ): Promise<Event | null> => {
  //   // const event = await EventService.registerGenericEvent(monitor, status, statusCode, message);
  //   const event = await Event.create({})
  //   const syncedMonitor = await Monitor.findById(monitor._id);
  //   if (!syncedMonitor) return null;

  //   await syncedMonitor.updateOne({
  //     currentStatusCode: statusCode,
  //     status,
  //     online: monitor.currentStatusCode === statusCode,
  //   });

  //   return event;
  // };
}

// }
