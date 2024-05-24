import { createConsumer } from 'src/lib'
import { io } from './server'
import { validateResponse } from 'src/utils'

const emitWebMonitorResponseTime = async (data: any) => {
  const response = validateResponse(data)
  io.emit('monitor-responses', response)
}

export const registerSocketConsumers = () => {
  createConsumer('monitor-responses', emitWebMonitorResponseTime)
}
