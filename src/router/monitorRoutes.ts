import { Router } from 'express'
import { isAuthenticated } from '../middleware/authMiddleware'
import * as Views from '../views/monitorViews' // absolute import for swagger

const router = Router()

// router.get('/details', isAuthenticated, MonitorController.getDetailedMonitors)

router.get('/monitors/', isAuthenticated, Views.getMonitorsView)
router.get('/monitors/:id', isAuthenticated, Views.getMonitorView)
router.post('/monitors/', isAuthenticated, Views.createMonitorView)
router.put('/monitors/:id', isAuthenticated, Views.updateMonitorView)
router.patch('/monitors/:id', isAuthenticated, Views.updateMonitorView)
router.delete('/monitors/:id', isAuthenticated, Views.deleteMonitorView)

export const monitorRoutes = router
