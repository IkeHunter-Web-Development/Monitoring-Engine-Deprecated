import { MonitorType } from "src/monitor/models/monitor.types";
// import axios from "axios";
import { request } from "./config";

export default class NetworkManager {
  private gatewayUrl: string;
  private static instance = new NetworkManager();

  constructor() {
    this.gatewayUrl = "http://localhost:8080";
  }

  static async sendRequest(url: string, data?: any) {
    return request({
      url: this.instance.gatewayUrl,
      method: "GET",
    });
  }
  static async isAuthenticated(token: string) {}
  // TODO: authenticate with auth engine
  static async authenticate(token: string) {}
  // TODO: get project name, agency
  static async getProjectInfo(monitor: MonitorType) {}
  // TODO: add monitor to scheduler
  static async scheduleMonitor(monitor: MonitorType) {}
  // TODO: remove monitor from scheduler
  static async unscheduleMonitor(monitor: MonitorType) {}
}
