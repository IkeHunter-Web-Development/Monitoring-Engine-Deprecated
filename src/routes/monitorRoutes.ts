import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as MonitorController from '../views/monitorViews' // absolute import for swagger

const router = Router()

// router.get('/details', isAuthenticated, MonitorController.getDetailedMonitors)

router.get('/monitors/', MonitorController.getMonitorsView)
router.get('/monitors/:id', isAuthenticated, MonitorController.getMonitorView)
router.post('/monitors/', isAuthenticated, MonitorController.createMonitorView)
router.put('/monitors/:id', isAuthenticated, MonitorController.updateMonitorView)
router.patch('/monitors/:id', isAuthenticated, MonitorController.updateMonitorView)
router.delete('/monitors/:id', isAuthenticated, MonitorController.deleteMonitorView)

export const monitorRoutes = router
