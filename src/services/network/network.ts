import { Monitor } from "src/models";
// import { request } from "./config";

export class NetworkManager {
  // private gatewayUrl: string;
  // private static instance = new NetworkManager();

  constructor() {
    // this.gatewayUrl = "http://localhost:8080";
  }

  static async sendRequest(url: string, data?: any) {
    // return request({
    //   url: this.instance.gatewayUrl,
    //   method: "GET",
    // });
    return url + data;
  }
  static async isAuthenticated(token: string) {
    return token;
  }
  // TODO: authenticate with auth engine
  static async authenticate(token: string) {
    return token;
  }
  // TODO: get project name, agency
  static async getProjectInfo(monitor: Monitor) {
    return monitor;
  }
  // TODO: add monitor to scheduler
  static async scheduleMonitor(monitor: Monitor) {
    return monitor;
  }
  // TODO: remove monitor from scheduler
  static async unscheduleMonitor(monitor: Monitor) {
    return monitor;
  }
}
