/**
 * Kafka configuration
 */

import { registerMonitorConsumer } from 'src/kafka'
import { NODE_ENV } from './constants'

export const initializeKafka = () => {
  if (NODE_ENV === 'test' || NODE_ENV === 'development') return

  registerMonitorConsumer()
}
