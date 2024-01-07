import { Router } from 'express'
import { MonitorController } from '../controllers' // absolute import for swagger
import { isAuthenticated } from '../middleware/authMiddleware'

const router = Router()

router.get('/details', isAuthenticated, MonitorController.getDetailedMonitors)
// router.post('/alert', MonitorController.alertMonitor)
// router.get('/search', isAuthenticated, MonitorController.searchMonitors)

router.get('/monitors/', isAuthenticated, MonitorController.getMonitors)
router.get('/monitors/:id', isAuthenticated, MonitorController.getMonitor)
router.post('/monitors/', isAuthenticated, MonitorController.createMonitor)
router.put('/monitors/:id', isAuthenticated, MonitorController.updateMonitor)
router.patch('/monitors/:id', isAuthenticated, MonitorController.updateMonitor)
router.delete('/monitors/:id', isAuthenticated, MonitorController.deleteMonitor)
// router.get(
//   '/monitors/:id/online',
//   isAuthenticated,
//   hasPermission,
//   MonitorController.getMonitorOnlineStatus
// )

export const monitorRoutes = router
