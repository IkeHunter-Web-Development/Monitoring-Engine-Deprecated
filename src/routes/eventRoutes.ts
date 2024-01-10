import { Router } from 'express'
import { EventController } from 'src/controllers/eventController'
import { isAuthenticated } from 'src/middleware'

const router = Router()

router.get('/events/', isAuthenticated, EventController.getEventsForProject)

export const eventRoutes = router
