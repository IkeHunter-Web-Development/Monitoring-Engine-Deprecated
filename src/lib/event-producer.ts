import type { EventQueue } from './event-queue'

export class EventProducer {
  protected queue: EventQueue
  protected topic: string

  constructor(queue: EventQueue, topic: string) {
    this.queue = queue
    this.topic = topic
  }

  public createProducer = <T>(action: string): ((data: T) => Promise<void>) => {
    return async (data: T) =>
      await this.queue.send(this.topic, [{ action, data }]).catch((error) => {
        console.error('Error sending producer message:', error)
      })
  }
}
