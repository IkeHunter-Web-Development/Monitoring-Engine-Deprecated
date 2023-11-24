import { MonitorType } from "src/monitor/models/types";

export default class NetworkManager {
  static async sendRequest(url: string, data: any) {}
  // TODO: authenticate with auth engine
  static async authenticate(token: string) {}
  // TODO: get project name, agency
  static async getProjectInfo(monitor: MonitorType) {}
  // TODO: add monitor to scheduler
  static async scheduleMonitor(monitor: MonitorType) {}
  // TODO: remove monitor from scheduler
  static async unscheduleMonitor(monitor: MonitorType) {}
}