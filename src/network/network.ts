import { Monitor } from "src/models";
import { request } from "./config";
import { GATEWAY_URL } from "src/config";
import { NetworkAuthResponse, NetworkProjectInfo, NetworkRequest } from "./types/network";
import { AUTH_URL, PROJECT_SINGLE_URL } from "./utils/endpoints";
import { AxiosResponse } from "axios";

export class Network {
  private gatewayUrl: string;
  private static instance = new Network();

  constructor() {
    this.gatewayUrl = GATEWAY_URL;
  }

  static async sendRequest(options: NetworkRequest): Promise<AxiosResponse | any> {
    const res = request({
      ...options.options,
      url: this.instance.gatewayUrl + options.endpoint,
      method: options.method,
      params: options.params,
      data: options.data,
      headers: options.headers,
      
    });
    return res;
  }

  // TODO: authenticate with auth engine
  static async authenticate(token: string): Promise<NetworkAuthResponse> {
    const config: NetworkRequest = {
      endpoint: AUTH_URL,
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token
      },
    }
    const res: AxiosResponse | any = await this.sendRequest(config)
    
    return {
      status: res.status,
      userId: res.data?.id
    };
  }
  // TODO: get project name, agency
  static async getProjectInfo(token: string, monitor: Monitor): Promise<NetworkProjectInfo> {
    const config: NetworkRequest  = {
      endpoint: PROJECT_SINGLE_URL(monitor.projectId),
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token
      }
    }
    const res: AxiosResponse | any = await this.sendRequest(config);
    
    return {
      status: res.status,
      projectTitle: res.data?.title,
      companyName: res.data?.company,
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
