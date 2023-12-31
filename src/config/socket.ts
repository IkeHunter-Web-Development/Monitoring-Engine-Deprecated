import WebSocket, { WebSocketServer, Server } from "ws";
import { v4 as uuidv4 } from "uuid";
import { IncomingMessage } from "http";

export class MonitorSocket {
  private socket: Server<typeof WebSocket, typeof IncomingMessage>;
  static instance: MonitorSocket;
  protected clients: { [userId: string]: { socket: WebSocket; monitorIds: string[] } } = {};
  public monitorClients: { [monitorId: string]: string[] } = {};

  private constructor(server: any) {
    this.socket = new WebSocketServer({ server });

    this.socket.on("connection", (connection) => {
      const userId = uuidv4();

      this.clients[userId] = { socket: connection, monitorIds: [] };
      console.log(`User ${userId} is connected to socket.`);

      connection.on("message", (message) => this.handleMessage(message, userId));

      connection.on("close", () => {
        this.handleConnectionClosed(userId);
      });
    });

    this.socket.on("listening", () => {
      console.log("WebSocket is listening");
    });
  }

  private handleConnectionClosed = (userId: string) => {
    const monitors = this.clients[userId].monitorIds;

    /** Clear user ids from monitor list */
    monitors.forEach((monitor) => {
      try {
        if (this.monitorClients[monitor]) {
          const index = this.monitorClients[monitor].indexOf(userId);
          this.monitorClients[monitor].splice(index, 1);

          if (this.monitorClients[monitor].length < 1) {
            delete this.monitorClients[monitor];
          }
        }
      } catch (error) {
        console.log("Error removing monitor from socket user:", error);
      }
    });

    /** Delete user from list */
    delete this.clients[userId];

    console.log(`Client ${userId} disconnected.`);
  };

  private handleMessage = (message: any, userId: string) => {
    const data: any = JSON.parse(message.toString());
    console.log("Socket message received:", data);
    const { type } = data;

    if (type === "set-monitors") this.setMonitors(data.monitors, userId);
  };

  private setMonitors = (monitors: string[], userId: string) => {
    monitors.forEach((monitor) => {
      this.clients[userId].monitorIds.push(monitor);

      if (this.monitorClients[monitor]) {
        this.monitorClients[monitor].push(userId);
      } else {
        this.monitorClients[monitor] = [userId];
      }
    });
  };

  private broadcastMessage = (client: WebSocket, type: string, data: any) => {
    console.log('broadcast message:', data)
    if (client.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        type,
        data,
      });
      client.send(payload);
    }
  };

  /**===============*
   * Public Methods *
   *================*/
  public static createSocket = (server: any): MonitorSocket => {
    if (!MonitorSocket.instance) {
      MonitorSocket.instance = new MonitorSocket(server);
    }

    return MonitorSocket.instance;
  };

  public static updateClientResponseTimes = (monitorId: string, responseTime: string) => {
    const clients: string[] | undefined = this.instance.monitorClients[monitorId];

    if (clients !== undefined) {
      clients.forEach((userId) => {
        const client: WebSocket | undefined = this.instance.clients[userId]?.socket;

        if (!client) return;
        this.instance.broadcastMessage(client, "set-responsetime", {
          monitorId: monitorId,
          responseTime: responseTime,
        });
      });
    }
  };
}
