/**
 * @fileoverview Manager for the monitor model.
 */
import Monitor, { MonitorType, monitorSchema } from "../models/monitor.model";

export default class MonitorManager {
  /**
   * Create a monitor.
   * @param projectId The id of the project the monitor belongs to.
   * @param url The url to monitor.
   * @param users The users to notify when the monitor goes offline.
   * @param title The title of the monitor.
   *
   * @returns The created monitor.
   */
  static async createMonitor(data: any) {
    let payload = {
      projectId: data.projectId || "",
      url: data.url || "",
      users: data.users || [],
      title: data.title || "",
    };

    let monitor = Monitor.create(payload)
      .then((monitor: any) => {
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
        // return null;
      });
      
    return monitor;

    // return await Monitor.create(payload);
  }

  /**
   * Update a monitor.
   * @param id The id of the monitor to update.
   * @param payload The payload to update the monitor with.
   *
   * @returns The updated monitor.
   */
  static async updateMonitor(id: string, payload: any) {
    let update = Monitor
      .findOneAndUpdate({_id: id}, payload, {new: true})
      .then((monitor: any) => {
        return monitor;
      })
      .catch((err: any) => {
        console.log(err);
        // return null;
        throw err;
      });
      
    return update;
  }

  /**
   * Get a monitor.
   * @param id The id of the monitor to get.
   *
   * @returns The monitor.
   */
  static async getMonitor(id: string) {
    let monitor = await Monitor.findOne({ _id: id });

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

  /**
   * Delete a monitor.
   * @param id The id of the monitor to delete.
   *
   * @returns Boolean, whether deletion was successful.
   */
  static async deleteMonitor(id: string) {
    let monitor = await Monitor.findOne({ _id: id });

    if (!monitor) return false;
    let status = monitor
      .deleteOne()
      .then(() => {
        return true;
      })
      .catch((err: any) => {
        console.log(err);
        throw err;
        // return false;
      });
    
    return status;
  }
}
