import { type Request, type Response } from 'express'
import { responses } from './utils/responses'

export const CoreController = {
  healthCheck: async (_: Request, res: Response) => {
    /** ==========================*
    #swagger.tags = ['Main']
    #swagger.description = 'Endpoint for checking the health of the API.'
    #swagger.responses[200] = {
      schema: {
        "status": 200,
        "service": "Monitor Engine",
        "message": "Systems online"
      }
    }
    *=========================== */

    const payload = {
      status: 200,
      service: 'Monitor Engine',
      message: 'Systems online'
    }

    return responses.ok(res, payload)
  }
}
