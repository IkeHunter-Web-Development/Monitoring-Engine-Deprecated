/**
 * @fileoverview Manager for the monitor model.
 */
import { NODE_ENV } from "src/config";
import { Event, Monitor, Report, User } from "src/models";
import { Network } from "src/services/network";
import { EventService, MonitorDetail, ReportService } from "src/services";
import { MonitorResponse } from "src/models/responseModel";
import { getResponseTime } from "src/utils";

export class MonitorService {
  public static instance: MonitorService = new MonitorService();

  public static notifyCreateMonitor = (monitor: Monitor) => {
    if (NODE_ENV === "development") return;
    Network.sendProducerMessage([
      {
        topic: "monitors",
        messages: JSON.stringify({
          action: "create",
          data: JSON.stringify(monitor),
        }),
      },
    ]);
  };

  public static notifyDeleteMonitor = (monitor: Monitor) => {
    if (NODE_ENV === "development") return;
    Network.sendProducerMessage([
      {
        topic: "monitors",
        messages: JSON.stringify({
          action: "delete",
          data: JSON.stringify(monitor),
        }),
      },
    ]);
  };

  /**
   * Parse data to create a monitor.
   *
   * @param data The data to parse.
   * @returns The parsed data.
   */
  public static async parseData(data: any) {
    let payload = {
      projectId: data.projectId,
      url: data.url || "",
      recipients: data.recipients || [],
      title: data.title || "",
      status: data.status || "pending",
    };

    return payload;
  }
  /**
   * Create a monitor.
   *
   * @param projectId The id of the project the monitor belongs to.
   * @param url The url to monitor.
   * @param recipients The users to notify when the monitor goes offline.
   * @param title The title of the monitor.
   * @returns The created monitor.
   */
  static async createMonitor(data: any) {
    let payload = await this.parseData(data);

    // TODO: Verify project exists
    // if (!payload.project) throw new Error("No project provided");
    // if (!payload.agency) throw new Error("No agency provided");

    const initialResponseTime = await getResponseTime(data.url).catch((error) => {
      console.log("URL failed initial check:", error);
      throw error;
    });

    let monitor = await Monitor.create(payload)
      .then((monitor: Monitor) => {
        this.notifyCreateMonitor(monitor);
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    await MonitorResponse.create({ monitorId: monitor._id, responseTime: initialResponseTime, timestamp: Date.now() });

    return monitor;
  }

  /**
   * Update a monitor.
   *
   * @param id The id of the monitor to update.
   * @param payload The payload to update the monitor with.
   * @returns The updated monitor.
   */
  static async updateMonitor(id: string, payload: any) {
    payload = await this.parseData(payload);

    let update = Monitor.findOneAndUpdate({ _id: id }, payload, { new: true })
      .then((monitor: any) => {
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
      });

    return update;
  }

  /**
   * Get a monitor.
   *
   * @param id The id of the monitor to get.
   * @returns The monitor.
   */
  static async getMonitor(id: string): Promise<Monitor | null> {
    let monitor: Monitor | null = await Monitor.findById(id);

    if (!monitor) return null;
    return monitor;
  }

  /**
   * Get all monitors.
   *
   * @returns All monitors.
   */
  static async getMonitors() {
    let monitors = await Monitor.find({});

    if (!monitors) return [];
    return monitors;
  }

  static async getMonitorDetails(networkToken: string, monitor: Monitor) {
    // async (monitor: Monitor) => {
    const events: Event[] = await EventService.getEventsForMonitor(monitor);
    const report: Report = await ReportService.generateReport(monitor);
    // const responses = [
    //   {
    //     responseTime: 0,
    //     timestamp: new Date(),
    //   },
    // ];
    const responses: MonitorResponse[] = await MonitorResponse.find({ monitorId: monitor._id });
    const networkRes = await Network.getProjectInfo(networkToken, monitor);
    const project: string = networkRes.projectTitle;
    const company: string = networkRes.companyName || "No company.";

    const responseTime = responses.length > 0 ? responses[responses.length - 1].responseTime : 0;

    try {
      const detail: MonitorDetail = {
        id: monitor._id.toString() || "",
        project: project,
        company: company,
        url: monitor.url,
        recipients: monitor.recipients || [],
        status: monitor.status || "unknown",
        targetStatusCode: monitor.targetStatusCode,
        currentStatusCode: monitor.statusCode,
        active: monitor.active,
        title: monitor.title,
        type: monitor.type,
        dateAdded: monitor.createdAt,
        responseTime: responseTime,
        timeout: monitor.timeout,
        retries: monitor.retries,
        coverImage: monitor.coverImage,
        events: events || [],
        report: report,
        responses: responses || [],
      };

      // console.log("detail: ", detail);

      return detail;
    } catch (error: any) {
      console.log("Error creating monitor details: ", error.message);
      throw error;
    }
    // }
  }

  /**
   * Get all monitors with their respective metrics,
   * events, reports.
   */
  static async getDetailedMonitors(networkToken: string) {
    // console.log("begine monitors detailed");
    let monitors = await Monitor.find({});
    if (!monitors) return [];
    // console.log("get monitors reached");

    const detailedMonitors: MonitorDetail[] = await Promise.all(
      monitors.map(async (monitor) => this.getMonitorDetails(networkToken, monitor))
    );

    return detailedMonitors;
  }

  /**
   * Delete a monitor.
   *
   * @param id The id of the monitor to delete.
   * @returns Boolean, whether deletion was successful.
   */
  static async deleteMonitor(id: string) {
    let monitor = await Monitor.findOne({ _id: id });
    if (!monitor) throw new Error("Monitor not found, cannot delete.");

    this.notifyDeleteMonitor(monitor);

    await Event.deleteMany({ monitorId: monitor._id });
    await Event.create({projectId: monitor.projectId, online: true, statusCode: 200, message: `Monitor ${monitor.title} deleted.`})

    if (!monitor) return false;
    let status = monitor
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
   * Search for monitors.
   *
   * @param query The query to search for.
   * @returns The monitors that match the query.
   */
  static async searchMonitors(query: any) {
    let filters = {};

    filters = query.url ? { ...filters, url: query.url } : filters;
    filters = query.title ? { ...filters, title: query.title } : filters;

    let monitors = await Monitor.find(filters);

    if (query.userId) {
      monitors = monitors.filter((monitor: any) => {
        return monitor.recipients.some((user: any) => {
          return user.userId === query.userId;
        });
      });
    }

    if (query.projectId) {
      monitors = monitors.filter((monitor: any) => {
        return monitor.projectId === query.projectId;
      });
    }

    if (!monitors) return [];
    return monitors;
  }
  /**
   * Check if a user has permission to access a monitor.
   *
   *
   * @param user The user to check.
   * @param monitor The monitor to check.
   * @returns Boolean, whether the user has permission.
   */
  static async userHasPermission(user: User, monitor: Monitor) {
    return user.projectIds?.includes(monitor.projectId);
  }

  /**
   * Handle a monitor going down.
   *
   * @param monitor The monitor that went down.
   * @param statusCode The status code of the monitor.
   * @param error The error message of the monitor.
   * @returns Boolean, whether the monitor was handled.
   */
  static async handleMonitorDown(monitor: Monitor, statusCode: number, error: string) {
    // monitor.online = false;
    let event = await EventService.registerDownEvent(monitor, statusCode, error);

    monitor.updateOne({ online: false, statusCode: statusCode, status: "offline" });

    if (!event) return false;
    console.log("Handling monitor down: ", monitor.title, " ", statusCode, " ", error);

    monitor.recipients.forEach(async (user: any) => {
      const userObj = await User.findById(user._id);
      if (userObj !== undefined) {
        let message = `Monitor ${monitor.title} is down. Status code: ${statusCode}`;
        console.log("sending email: ", message);
      }
    });
  }
  /**
   * Handle a monitor going back online.
   *
   * @param monitor The monitor.
   * @param statusCode The status code of the monitor.
   * @returns Boolean, whether the monitor was handled.
   */
  static async handleMonitorBackOnline(monitor: Monitor, statusCode: number) {
    monitor.online = false;
    let event = await EventService.registerUpEvent(monitor, statusCode, "Monitor is back online.");

    if (!event) return false;
    console.log("Handling monitor back online: ", monitor.title, " ", statusCode);

    monitor.recipients.forEach(async (user: any) => {
      const userObj = await User.findById(user._id);
      if (userObj !== undefined) {
        let message = `Monitor ${monitor.title} is back online. Status code: ${statusCode}`;
        console.log("sending email: ", message);
      }
    });
  }
}
