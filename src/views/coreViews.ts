import type { NextFunction, Request, Response } from 'express'
import { kafka } from 'src/lib'
import { WebsiteMonitor } from 'src/models'
import { errorResponse, ok } from 'src/utils'

/**
 * REST Api Views
 *
 * Views handle requests and responses from the router, and
 * will call any necessary controller. Views cannot directly access
 * services, validators, models, or other views.
 */
export const healthCheck = async (req: Request, res: Response, next: NextFunction) => {
  /** ==========================*
    @swagger Health Check
    #swagger.summary = 'Health Check'
    #swagger.tags = ['General']
    #swagger.description = 'Root route to check if the system is online.'
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Success200" },
      description: "Monitor Engine is operational."
    }
   *=========================== */
  try {
    await kafka.admin({ retry: { retries: 3 } }).connect()
    await WebsiteMonitor.count()
  } catch (e) {
    return errorResponse(e, res, next)
  }
  return ok(res, 'Monitor Engine is operational.', true)
}
