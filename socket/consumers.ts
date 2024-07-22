import { createConsumer } from 'src/lib'
import { validateMonitorMeta, validateResponse } from 'src/utils'
import { io } from './server'

export const registerSocketConsumers = () => {
  createConsumer('monitor-responses', async (data: any) => {
    const response = validateResponse(data)
    io.emit('monitor-responses', response)
  })
  createConsumer('monitor-responses-errors', async (data: IErrorResponse) => {
    // const response = validateResponse(data)
    const response = validateResponse(data)
    io.emit('monitor-responses', response)
  })

  createConsumer('monitor-create', async (data: any) => {
    const monitor = validateMonitorMeta(data)
    io.emit('monitor-create', monitor)
  })

  createConsumer('monitor-update', async (data: any) => {
    const monitor = validateMonitorMeta(data)
    io.emit('monitor-update', monitor)
  })

  createConsumer('monitor-delete', async (data: any) => {
    const monitor = validateMonitorMeta(data)
    io.emit('monitor-delete', monitor)
  })

  createConsumer('user-update', async (data: any) => {
    console.log('user update:', data)
    io.emit('user-update', data)
  })
}
