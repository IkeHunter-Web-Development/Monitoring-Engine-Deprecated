import { Router } from 'express'
import { CoreController } from '../controllers/coreController'
import { monitorRoutes } from './monitorRoutes' // absolute import for swagger
import { eventRoutes } from './eventRoutes'

const router = Router()
router.get('/', CoreController.healthCheck)
router.use('/api/monitor', monitorRoutes)
router.use('/api/monitor', eventRoutes)

export { router }

export * from './monitorRoutes'
