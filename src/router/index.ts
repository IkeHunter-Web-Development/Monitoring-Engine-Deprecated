/**
 * Network ingress/egress router
 *
 * The routers are responsible for defining which
 * endpoints are available, and directing requests from
 * those endpoints to the appropriate views. They can
 * only reference views and middleware.
 */
import { Router } from 'express'

import { docsMiddleware } from '../middleware/docsMiddleware'
import * as CoreController from '../views'
import { eventRoutes } from './eventRoutes'
import { incidentRoutes } from './incidentRoutes'
import { monitorRoutes } from './monitorRoutes' // absolute import for swagger

const router = Router()
router.get('/', CoreController.healthCheck)
router.use('/api/monitor', docsMiddleware, monitorRoutes)
router.use('/api/monitor', docsMiddleware, eventRoutes)
router.use('/api/incident', docsMiddleware, incidentRoutes)

export { router }
