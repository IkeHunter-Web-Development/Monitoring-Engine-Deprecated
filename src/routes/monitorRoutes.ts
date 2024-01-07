import { Router } from 'express'
import { MonitorController } from '../controllers/monitorController' // absolute import for swagger
import { isAuthenticated } from '../middleware/authMiddleware'

const router = Router()

router.get('/details', isAuthenticated, MonitorController.getDetailedMonitors)

router.get('/monitors/', isAuthenticated, MonitorController.getMonitors)
router.get('/monitors/:id', isAuthenticated, MonitorController.getMonitor)
router.post('/monitors/', isAuthenticated, MonitorController.createMonitor)
router.put('/monitors/:id', isAuthenticated, MonitorController.updateMonitor)
router.patch('/monitors/:id', isAuthenticated, MonitorController.updateMonitor)
router.delete('/monitors/:id', isAuthenticated, MonitorController.deleteMonitor)

export const monitorRoutes = router
