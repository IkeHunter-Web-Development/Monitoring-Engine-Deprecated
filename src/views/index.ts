import type { Request, Response } from 'express'
import { Responses } from 'src/utils'

/**
 * REST Api Views
 *
 * Views handle requests and responses from the router, and
 * will call any necessary controller. Views cannot directly access
 * services, validators, models, or other views.
 */
export const healthCheck = (req: Request, res: Response) => {
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
  return Responses.ok(res, 'Monitor Engine is operational.', true)
}
