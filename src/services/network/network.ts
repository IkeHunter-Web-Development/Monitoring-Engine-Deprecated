import { Monitor } from "src/models";
import { request } from "./config";
import { GATEWAY_URL, KAFKA_ACTIONS, KAFKA_HOST, KAFKA_PORT, KAFKA_TOPICS } from "src/config";
import { NetworkAuthResponse, NetworkProjectInfo, NetworkRequest } from "./types/network.types";
import { PROJECT_SERVICE, SCHEDULE_SERVICE, AUTH_SERVICE } from "./utils/endpoints";
import { AxiosResponse } from "axios";
// import { Stream } from "src/lib";
import { Consumer, KafkaClient } from "kafka-node";
import { MonitorProducer } from "src/data";

export class Network {
  private gatewayUrl: string;
  private static instance = new Network();

  constructor() {
    this.gatewayUrl = GATEWAY_URL;
  }

  static async sendRequest(options: NetworkRequest): Promise<AxiosResponse | any> {
    const res = await request({
      ...options.options,
      url: this.instance.gatewayUrl + options.endpoint,
      method: options.method,
      params: options.params,
      data: options.data,
      headers: options.headers,
    }).catch((err) => {
      console.log("err: ", err);
      return err;
    });
    // console.log('res: ', res)
    return res;
  }

  // TODO: authenticate with auth engine
  static async authenticate(token: string): Promise<NetworkAuthResponse> {
    const config: NetworkRequest = {
      endpoint: AUTH_SERVICE.verify,
      method: "GET",
      headers: {
        Authorization: "Token " + token,
      },
    };
    const res: AxiosResponse | any = await this.sendRequest(config);

    return {
      status: res.status,
      userId: res.data?.id,
    };
  }
  // TODO: get project name, agency
  static async getProjectInfo(token: string, monitor: Monitor): Promise<NetworkProjectInfo> {
    const config: NetworkRequest = {
      // endpoint: PROJECT_SINGLE_URL(monitor.projectId),
      endpoint: PROJECT_SERVICE.getOne(monitor.projectId),
      method: "GET",
      headers: {
        Authorization: "Token " + token,
      },
    };
    const res: AxiosResponse | any = await this.sendRequest(config);

    // console.log('project res: ', res)

    return {
      status: res.status,
      projectTitle: res.data?.title,
      companyName: res.data?.company,
    };
  }
  static async scheduleMonitor(monitor: Monitor): Promise<boolean> {
    // return monitor && true;
    const config: NetworkRequest = {
      endpoint: SCHEDULE_SERVICE.createMonitor,
      method: "POST",
      data: {
        foreignId: monitor._id,
        url: monitor.url,
        targetCode: monitor.currentStatusCode,
      },
    };
    const res: AxiosResponse | any = await this.sendRequest(config);
    console.log("res: ", res);

    return res.status === 201;
  }
  static async unscheduleMonitor(monitor: Monitor): Promise<boolean> {
    // return monitor && true;
    const config: NetworkRequest = {
      endpoint: SCHEDULE_SERVICE.deleteMonitor(monitor._id.toString()),
      method: "DELETE",
    };
    const res: AxiosResponse | any = await this.sendRequest(config);
    console.log("res: ", res);

    return res.status === 204;
  }

  // TODO: Abstract .on() method to fix testing
  static sendMonitorMessage = async (action: string, data: any): Promise<void> => {
    await MonitorProducer.sendMessage(KAFKA_TOPICS.monitors, action, data).catch((error) => {
      console.log("Could not send message:", error);
    });
  };

  static sendEmailNotification = async (
    recipients: string[],
    subject: string,
    body: string
  ): Promise<void> => {
    await MonitorProducer.sendMessage(
      KAFKA_TOPICS.notifications,
      KAFKA_ACTIONS.notifications.email,
      {
        recipients: [recipients.join(",")],
        subject: subject,
        body: body,
      }
    );
  };

  static createConsumer(topic: string) {
    return new Consumer(
      new KafkaClient({ kafkaHost: `${KAFKA_HOST}:${KAFKA_PORT}` }),
      [{ topic: topic }],
      {}
    );
  }
}
