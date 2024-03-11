import { Router } from 'express'
// import { EventController } from 'src/controllers/eventController'
import * as EventController from '../views/eventViews'
import { isAuthenticated } from 'src/middleware'

const router = Router()

router.get('/events', isAuthenticated, EventController.queryEventsView)

export const eventRoutes = router
