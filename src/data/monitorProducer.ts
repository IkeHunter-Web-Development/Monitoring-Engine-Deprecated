import { Stream, type StreamTopic } from 'src/lib'
import { type Monitor } from 'src/models'

type MonitorProducerAction = 'create' | 'delete'

export class MonitorProducer {
  static instance: MonitorProducer
  protected stream: Stream

  private constructor () {
    this.stream = Stream.getInstance()
  }

  public static getInstance = (): MonitorProducer => {
    if (MonitorProducer.instance == null) {
      MonitorProducer.instance = new MonitorProducer()
    }

    return MonitorProducer.instance
  }

  public static sendMonitorMessage = async (action: MonitorProducerAction, data: Monitor): Promise<void> => {
    const instance = this.getInstance()
    const topic: StreamTopic = 'monitors'

    await instance.stream.send(topic, [{ action, data }])
  }
}
