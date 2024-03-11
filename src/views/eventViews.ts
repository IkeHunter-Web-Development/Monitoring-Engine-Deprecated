import type { NextFunction, Request, Response } from 'express'
import { searchEvents } from 'src/controllers/eventActions'
import { Responses } from 'src/utils'
import { serializeEvents } from 'src/utils/serializers/eventSerializer'

export const queryEventsView = async (req: Request, res: Response, next: NextFunction) => {
  /**====================*
    @swagger Query Events
    #swagger.summary = 'Query Events'
    #swagger.tags = ['Events']
    #swagger.description = ''
    #swagger.parameters['monitorId'] = {
      in: "query",
      description: "Monitor id to search events",
      type: "string"
    }
    #swagger.parameters['projectId'] = {
      in: "query",
      description: "Project id to search events",
      type: "string"
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/EventMetaDoc" },
      description: ""
    }
   *=====================*/
  try {
    const { monitorId, projectId } = req.query

    const events = await searchEvents({
      monitorId: monitorId?.toString(),
      projectId: projectId?.toString()
    })
    const serialized = await serializeEvents(events)

    return Responses.ok(res, serialized)
  } catch (error) {
    next(error)
  }
}
