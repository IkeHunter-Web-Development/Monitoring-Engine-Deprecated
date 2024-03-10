import type { EventQueue } from 'src/lib'

export class EventConsumer {
  protected queue: EventQueue
  protected topic: string
  protected actions: { [action: string]: (data: any) => Promise<void> } = {}
  constructor(queue: EventQueue, topic: string) {
    this.queue = queue
    this.topic = topic
  }

  public connect = async (): Promise<EventConsumer> => {
    this.queue?.subscribe(this.topic, async (res) => {
      try {
        const payload = JSON.parse(res.message.value?.toString() || '')
        const { action, data } = payload

        const callback = this.actions[action]
        if (!callback) {
          console.error(`Topic ${this.topic} received an unknown action: ${action}`)
        }

        await callback(data)
      } catch (error) {
        console.error('Error handling data from event queue:', error)
      }
    })

    return this
  }

  public registerConsumer = async (action: string, callback: (data: any) => Promise<void>) => {
    this.actions[action] = callback
  }
}
