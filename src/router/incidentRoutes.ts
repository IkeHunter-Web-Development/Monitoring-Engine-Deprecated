import { Router } from 'express'
import { isAuthenticated } from 'src/middleware'
import * as Views from '../views/incidentViews'

const router = Router()

router.post('/incidents', isAuthenticated, Views.createIncidentView)
router.get('/incidents', isAuthenticated, Views.getIncidentsView)
router.get('/incidents/:id', isAuthenticated, Views.getIncidentView)
router.put('/incidents/:id', isAuthenticated, Views.updateIncidentView)
router.patch('/incidents/:id', isAuthenticated, Views.updateIncidentView)
router.delete('/incidents/:id', isAuthenticated, Views.deleteIncidentView)

router.post('/active', isAuthenticated, Views.startActiveIncidentView)
router.get('/active', isAuthenticated, Views.getActiveIncidentsView)
router.get('/active/:id', isAuthenticated, Views.getActiveIncidentView)
router.put('/active/:id', isAuthenticated, Views.updateActiveIncidentView)
router.patch('/active/:id', isAuthenticated, Views.updateActiveIncidentView)
router.delete('/active/:id', isAuthenticated, Views.endActiveIncidentView)

export const incidentRoutes = router
