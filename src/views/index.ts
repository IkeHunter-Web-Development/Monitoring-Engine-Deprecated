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
  return Responses.ok(res, 'Monitor Engine is operational.', true)
}
