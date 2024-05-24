import { NODE_ENV } from 'src/config'
import { logger } from 'src/lib/logger'
import { registerSocketConsumers } from './consumers'
import { io, server } from './server'

const PORT = 3333

io.on('connection', (socket) => {
  console.log('a user connected')
})

if (NODE_ENV === 'production' || NODE_ENV === 'network') {
  registerSocketConsumers()
}

server.listen(PORT, () => {
  logger.info(`Socket listening on port ${PORT}`, { service: 'socket' })
  // console.log(`Socket listening on port ${PORT}`)
})
