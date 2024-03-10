import { MonitorEventsConsumer } from 'src/queue'

export const registerConsumers = (): void => {
  MonitorEventsConsumer.connect()
}
