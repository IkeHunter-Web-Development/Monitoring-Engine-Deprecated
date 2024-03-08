import type { WebsiteMonitor } from 'src/models'
import { type Event } from 'src/models'
// import WebSocket, { WebSocketServer, type Server } from 'ws'
import { Server } from 'socket.io'

/**
 * Private messages:
 * https://socket.io/get-started/private-messaging-part-2/
 */

export class MonitorSocket {
  // private readonly socket: Server<typeof WebSocket, typeof IncomingMessage>
  private readonly io: Server
  static instance: MonitorSocket
  // protected clients: Record<string, { socket: Server; monitorIds: string[] }> = {}
  // protected clients: { id: any; projectId: string }[] = []
  // public monitorClients: Record<string, string[]> = {}

  private constructor(server: any) {
    // this.socket = new WebSocketServer({ server })

    this.io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    this.io.on('connection', (socket) => {
      socket.once('join_projects', (data: { projects: string[] }) => {
        const { projects } = data 
        console.log('projects:', projects)
        projects.forEach((projectId) => {
          socket.join(String(projectId))
          // this.clients.push({ id: socket.id, projectId: String(projectId) })
        })
      })

      socket.on('disconnect', () => {
        console.log('client disconnected:', socket.id)
      })
    })
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
    monitor: WebsiteMonitor,
    responseTime: number,
    timestamp: number
  ): void => {
    // console.log('update response:', monitor.title)
    this.instance.io.in(String(monitor.projectId)).emit('new_responsetime', {
      monitorId: monitor._id,
      responseTime,
      timestamp
    })
  }

  public static pushClientEvent = (monitor: WebsiteMonitor, event: Event): void => {
    this.instance.io.in(String(monitor.projectId)).emit('new_event', {
      monitorId: monitor._id,
      event
    })
  }
}
