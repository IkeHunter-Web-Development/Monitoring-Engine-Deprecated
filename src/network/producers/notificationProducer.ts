import { Stream, type StreamTopic } from 'src/lib'

type NotificationProducerAction = 'send-email' | 'send-sms'

export class NotificationProducer {
  static instance: NotificationProducer
  protected stream: Stream

  private constructor() {
    this.stream = Stream.getInstance()
  }

  public static getInstance = (): NotificationProducer => {
    if (NotificationProducer.instance != null) {
      NotificationProducer.instance = new NotificationProducer()
    }

    return NotificationProducer.instance
  }

  public static sendEmailMessage = async (
    recipients: string[],
    subject: string,
    body: string
  ): Promise<void> => {
    const instance = this.getInstance()
    const topic: StreamTopic = 'notifications'
    const action: NotificationProducerAction = 'send-email'

    await instance.stream.send(topic, [
      {
        action,
        data: {
          recipients,
          subject,
          body
        }
      }
    ])
  }

  public static sendSmsMessage = async (recipients: string[], body: string): Promise<void> => {
    const instance = this.getInstance()
    const topic: StreamTopic = 'notifications'
    const action: NotificationProducerAction = 'send-sms'

    await instance.stream.send(topic, [
      {
        action,
        data: {
          recipients,
          body
        }
      }
    ])
  }
}
