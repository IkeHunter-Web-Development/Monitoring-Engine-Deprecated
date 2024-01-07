import { MonitorSocket } from 'src/config'
import { type Event, Monitor } from 'src/models'
import { MonitorResponse } from 'src/models/responseModel'
import { Stream } from 'src/lib'

const RESPONSE_INTERVAL_MIN = 30

export class EventConsumer {
  static instance: EventConsumer
  protected stream: Stream
  private constructor() {
    this.stream = Stream.getInstance()
    this.initializeConsumers()
      .then(() => {
        console.log('Event consumer initialized')
      })
      .catch((err) => {
        console.error('Error initializing event consumer:', err)
      })
  }

  private readonly initializeConsumers = async (): Promise<void> => {
    await this.stream?.subscribe('monitor-events', (res) => {
      console.log('received:', res.message.value?.toString())

      try {
        const payload = JSON.parse(res.message.value?.toString() ?? '')
        const { action, data } = payload

        if (action === 'register-event') {
          this.handleAddEvent(data).catch((err) => {
            console.error('Error handling add event:', err)
          })
        } else if (action === 'register-response') {
          console.log('registering response:', data)
          this.handleAddResponse(data).catch((err) => {
            console.error('Error handling add response:', err)
          })
        }
      } catch (error) {
        console.error('Error getting data from stream:', error)
      }
    })
  }

  private readonly handleAddEvent = async (data: any): Promise<void> => {
    const { _monitorId, status, statusCode, message } = data

    if (_monitorId == null) return

    const monitor = await Monitor.findById(_monitorId)
    if (monitor == null) return
    const monitorId = monitor._id.toString()

    const event: Event | null = null

    if (monitor.online && status === 'offline') {
      console.log('monitor down:', monitor)
      // TODO: Handle monitor down
    } else if (!monitor.online && status === 'online') {
      console.log('monitor back online:', monitor)
      // TODO: Handle monitor online
    } else if (monitor.status === 'pending') {
      console.log('monitor pending:', monitor)
      // TODO: Handle monitor pending
    }

    if (event != null) MonitorSocket.pushClientEvent(monitorId, event)

    console.log('monitor udpated: ', monitor, statusCode, message)
  }

  private readonly handleAddResponse = async (data: any): Promise<void> => {
    const { monitorId, responseTime, timestamp } = data
    MonitorSocket.updateClientResponseTimes(String(monitorId), String(responseTime))

    if (new Date().getMinutes() % RESPONSE_INTERVAL_MIN !== 0) return

    const monitor: Monitor | null = await Monitor.findById(monitorId)
    if (monitor == null) return

    await MonitorResponse.create({
      monitorId,
      responseTime,
      timestamp
    })
  }

  public static registerConsumer = (): EventConsumer => {
    return new EventConsumer()
  }
}
