import { MonitorSocket } from 'src/config'
import { Stream } from 'src/lib'
import { WebsiteMonitor, type Event } from 'src/models'
import { MonitorResponse } from 'src/models/websiteResponseModel'
import { MonitorService } from 'src/services'

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
    
    console.log('Received event:', status, statusCode, message)

    // const monitor = await Monitor.findById(_monitorId)
    const monitor = await WebsiteMonitor.findById(_monitorId)
    if (monitor == null) return
    const monitorId = monitor._id.toString()

    let event: Event | null = null

    if (status !== monitor.status) {
      console.log('monitor status changed:', status)
      event = await MonitorService.handleStatusChanged(monitor._id, status)
      if (event != null) MonitorSocket.pushClientEvent(monitorId, event)
    }
  }

  private readonly handleAddResponse = async (data: any): Promise<void> => {
    const { monitorId, responseTime, timestamp } = data
    MonitorSocket.updateClientResponseTimes(String(monitorId), String(responseTime))

    if (new Date().getMinutes() % RESPONSE_INTERVAL_MIN !== 0) return

    const monitor: WebsiteMonitor | null = await WebsiteMonitor.findById(monitorId)
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
