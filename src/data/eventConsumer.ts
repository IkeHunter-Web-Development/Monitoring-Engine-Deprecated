import { MonitorSocket } from 'src/config'
import { Stream } from 'src/lib'
import { WebsiteMonitor, type Event } from 'src/models'
import { WebsiteResponse } from 'src/models/websiteResponseModel'
import { MonitorService } from 'src/services'
// import { MonitorService } from 'src/services'

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
    // const monitors = await WebsiteMonitor.find({})

    // setInterval(() => {
    //   // console.log('tick...')
    //   // MonitorSocket.
    //   MonitorSocket.updateClientResponseTimes(monitors[0], 100, Date.now())
    // }, 5000)


    this.stream?.subscribe('monitor-events', (res) => {
      // console.log('received:', res.message.value?.toString())

      try {
        const payload = JSON.parse(res.message.value?.toString() ?? '')
        // const action = String(payload.action)
        // const data = payload.data
        const { action, data } = payload

        if (action === 'register-event') {
          this.handleAddEvent(data).catch((err) => {
            console.error('Error handling add event:', err)
          })
        } else if (action === 'register-response') {
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
    const { monitorId, availability } = data

    if (monitorId == null) return

    const monitor = await WebsiteMonitor.findById(monitorId)
    if (!monitor) return

    let event: Event | null = null

    if (availability !== monitor.availability) {
      console.log('monitor availability changed:', availability)
      event = await MonitorService.handleAvailabilityChanged(monitor._id, availability)
      if (event != null) MonitorSocket.pushClientEvent(monitorId, event) 
    }
  }

  private readonly handleAddResponse = async (data: any): Promise<void> => {
    const { monitorId, responseTime, timestamp } = data

    const monitor = await WebsiteMonitor.findById(monitorId)
    if (!monitor) return

    MonitorSocket.updateClientResponseTimes(monitor, responseTime, timestamp)

    await monitor.updateOne({
      responseTime: responseTime,
      lastCheck: timestamp
    })
    if (new Date().getMinutes() % RESPONSE_INTERVAL_MIN !== 0) return

    await WebsiteResponse.create({
      monitorId,
      responseTime,
      timestamp
    })
  }

  public static registerConsumer = (): EventConsumer => {
    return new EventConsumer()
  }
}
