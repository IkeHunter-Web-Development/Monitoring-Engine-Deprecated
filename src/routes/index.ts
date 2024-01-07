import { Router } from 'express'
import { CoreController } from '../controllers/coreController'
import { monitorRoutes } from './monitorRoutes' // absolute import for swagger

const router = Router()
router.get('/', CoreController.healthCheck)
router.use('/api/monitor', monitorRoutes)

export { router }

export * from './monitorRoutes'
