import http from 'http'
import 'module-alias/register'
import swaggerUi from 'swagger-ui-express'

import { HOST, MonitorSocket, PORT, setupDatabase } from 'src/config'
import { registerConsumers } from './config/eventQueue'
import { server } from './config/server'
import { initializeSwagger } from './docs/swagger'
import { router } from './router'

import 'src/config/socket'
import { processCliArgs } from './scripts'

setupDatabase()
registerConsumers()

/** Create websocket application */
const app = http.createServer(server)
MonitorSocket.createSocket(app)

/** Generate swagger docs */
initializeSwagger().then(async () => {
  const swaggerDocument = await import('src/docs/swagger_output.json')
  router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))
})

if (process.argv.length > 2) {
  processCliArgs(process.argv)
} else {
  /** Start server */
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`)
  })
}
