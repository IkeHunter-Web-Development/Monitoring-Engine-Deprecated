import 'module-alias/register'
import swaggerUi from 'swagger-ui-express'

import { HOST, NODE_ENV, PORT, server, setupDatabase } from 'src/config'
import { initializeSwagger } from 'src/docs'
import { registerMonitorConsumer } from 'src/events'
import { logger } from 'src/lib'
import { processCliArgs } from 'src/scripts'

setupDatabase()

if (NODE_ENV === 'production' || NODE_ENV === 'network') {
  registerMonitorConsumer()
}

/** Generate swagger docs */
initializeSwagger().then(async () => {
  const swaggerDocument = await import('src/docs/swagger_output.json')
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }))
})

if (process.argv.length > 2) {
  processCliArgs(process.argv)
} else {
  /** Start server */
  server.listen(PORT, HOST, () => {
    logger.info(`Server running at http://${HOST}:${PORT}.`)
  })
}
