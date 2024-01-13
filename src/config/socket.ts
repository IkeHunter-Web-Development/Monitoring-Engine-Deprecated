import { type IncomingMessage } from 'http'
import { type Event } from 'src/models'
import { v4 as uuidv4 } from 'uuid'
import WebSocket, { WebSocketServer, type Server } from 'ws'

export class MonitorSocket {
  private readonly socket: Server<typeof WebSocket, typeof IncomingMessage>
  static instance: MonitorSocket
  protected clients: Record<string, { socket: WebSocket; monitorIds: string[] }> = {}
  public monitorClients: Record<string, string[]> = {}

  private constructor(server: any) {
    this.socket = new WebSocketServer({ server })

    this.socket.on('connection', (connection) => {
      const userId = uuidv4()

      this.clients[userId] = { socket: connection, monitorIds: [] }
      console.log(`User ${userId} is connected to socket.`)

      connection.on('message', (message) => {
        this.handleMessage(message, userId)
      })

      connection.on('close', () => {
        this.handleConnectionClosed(userId)
      })
    })

    this.socket.on('listening', () => {
      console.log('WebSocket is listening')
    })
  }

  private readonly handleConnectionClosed = (userId: string): void => {
    const monitors = this.clients[userId].monitorIds

    /** Clear user ids from monitor list */
    monitors.forEach((monitor) => {
      try {
        if (this.monitorClients[monitor] != null) {
          const index = this.monitorClients[monitor].indexOf(userId)
          this.monitorClients[monitor].splice(index, 1)
        }
      } catch (error) {
        console.log('Error removing monitor from socket user:', error)
      }
    })

    /** Delete user from list */
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.clients[userId]

    console.log(`Client ${userId} disconnected.`)
  }

  private readonly handleMessage = (message: WebSocket.RawData, userId: string): void => {
    const data: any = JSON.parse(String(message))
    console.log('Socket message received:', data)
    const { type } = data

    if (type === 'set-monitors') this.setMonitors(data.monitors, userId)
  }

  private readonly setMonitors = (monitors: any, userId: string): void => {
    if (monitors == null || !Array.isArray(monitors)) return
    monitors.forEach((monitor) => {
      this.clients[userId].monitorIds.push(String(monitor))

      if (this.monitorClients[monitor] != null) {
        this.monitorClients[monitor].push(userId)
      } else {
        this.monitorClients[monitor] = [userId]
      }
    })
  }

  private readonly broadcastMessage = (client: WebSocket, type: string, data: any): void => {
    console.log('broadcast message:', data)
    if (client.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({
        type,
        data
      })
      client.send(payload)
    }
  }

  /** ===============*
   * Public Methods *
   *================ */
  public static createSocket = (server: any): MonitorSocket => {
    if (MonitorSocket.instance == null) {
      MonitorSocket.instance = new MonitorSocket(server)
    }

    return MonitorSocket.instance
  }

  public static updateClientResponseTimes = (
    monitorId: string,
    responseTime: number,
    timestamp: number
  ): void => {
    const clients: string[] | undefined = this.instance.monitorClients[monitorId]

    if (clients !== undefined) {
      clients.forEach((userId) => {
        const client: WebSocket | undefined = this.instance.clients[userId]?.socket

        if (client == null) return
        this.instance.broadcastMessage(client, 'set-responsetime', {
          monitorId,
          responseTime,
          timestamp
        })
      })
    }
  }

  public static pushClientEvent = (monitorId: string, event: Event): void => {
    const clients: string[] | undefined = this.instance.monitorClients[monitorId]
    console.log('event pushed:', event)

    if (clients !== undefined) {
      clients.forEach((userId) => {
        const client: WebSocket | undefined = this.instance.clients[userId]?.socket

        if (client == null) return
        this.instance.broadcastMessage(client, 'push-event', {
          monitorId,
          event
        })
      })
    }
  }
}
