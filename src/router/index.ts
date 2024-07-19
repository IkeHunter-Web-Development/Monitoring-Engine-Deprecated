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
import * as CoreViews from '../views/coreViews'
import { eventRoutes } from './eventRoutes'
import { incidentRoutes } from './incidentRoutes'
import { monitorRoutes } from './monitorRoutes' // absolute import for swagger

const router = Router()
router.get('/', CoreViews.healthCheck)
router.get('/health', CoreViews.healthCheck)
router.use('/api/monitor', docsMiddleware, monitorRoutes)
router.use('/api/monitor', docsMiddleware, eventRoutes)
router.use('/api/monitor', docsMiddleware, incidentRoutes)

export { router }
