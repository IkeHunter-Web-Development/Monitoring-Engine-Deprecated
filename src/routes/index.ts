import { docsMiddleware } from './../middleware/docsMiddleware'
/**
 * REST Api Routing and Endpoint Definitions
 *
 * The routers are responsible for defining which
 * endpoints are available, and directing requests from
 * those endpoints to the appropriate views. They can
 * only reference views and middleware.
 */
import { Router } from 'express'

import * as CoreController from '../views'
import { eventRoutes } from './eventRoutes'
import { monitorRoutes } from './monitorRoutes' // absolute import for swagger

const router = Router()
router.get('/', docsMiddleware, CoreController.healthCheck)
router.use('/api/monitor', docsMiddleware, monitorRoutes)
router.use('/api/monitor', docsMiddleware, eventRoutes)

export { router }

export * from './monitorRoutes'
