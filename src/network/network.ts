import { Monitor } from "src/models";
// import { request } from "./config";

export class Network {
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

  // TODO: authenticate with auth engine
  static async authenticate(token: string): Promise<NetworkAuthResponse> {
    return {
      status: 200,
      authenticated: true,
      userId: token,
    };
  }
  // TODO: get project name, agency
  static async getProjectInfo(token: string, monitor: Monitor): Promise<NetworkProjectInfo> {
    return {
      status: 200,
      projectName: monitor.title,
      company: token,
    };
  }
  // TODO: add monitor to scheduler
  static async scheduleMonitor(monitor: Monitor): Promise<boolean> {
    return monitor && true;
  }
  // TODO: remove monitor from scheduler
  static async unscheduleMonitor(monitor: Monitor): Promise<boolean> {
    return monitor && true;
  }
}
