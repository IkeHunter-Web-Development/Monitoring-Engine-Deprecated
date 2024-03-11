import type { NextFunction, Request, Response } from 'express'
import { NotImplementedError } from 'src/utils'

export const queryEventsView = (req: Request, res: Response, next: NextFunction) => {
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
    throw new NotImplementedError('Query events view')
  } catch (error) {
    next(error)
  }
}
