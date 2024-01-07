import { EventConsumer } from './eventConsumer'

export const registerConsumers = (): void => {
  EventConsumer.registerConsumer()
}

export * from './eventConsumer'
export * from './monitorProducer'
export * from './network'
