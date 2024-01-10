import type { Request, Response } from 'express'
import type { AuthLocals } from 'src/middleware'
import { Event } from 'src/models'
import { responses } from './utils/responses'

export const EventController = {
  getEventsForProject: async (_: Request, res: Response) => {
    // TODO: Make documentation
    // const { projectIds } = req.body
    const { projectIds } = <AuthLocals>res.locals
    const events = []

    for (const id of projectIds) {
      const foundEvents = await Event.find({ projectId: id })
      events.push(...foundEvents)
    }

    return responses.ok(res, events)
  }
}
