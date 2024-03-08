import { HOST, MonitorSocket, PORT, setupDatabase } from 'src/config'
import swaggerUi from 'swagger-ui-express'

import http from 'http'
import 'src/config/socket'
import { server } from './config/server'
import { registerConsumers } from './data'
import { initializeSwagger } from './docs/swagger'
import { router } from './routes'

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

/** Start server */
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
})
