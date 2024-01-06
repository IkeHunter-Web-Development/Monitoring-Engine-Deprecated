import { BaseController } from "./baseController";
import { Request, Response } from "express";

export class CoreController extends BaseController {
  
  static async healthCheck(_: Request, res: Response) {
    /**==========================*
    #swagger.tags = ['Main']
    #swagger.description = 'Endpoint for checking the health of the API.'
    #swagger.responses[200] = {
      schema: {
        "status": 200,
        "service": "Monitor Engine",
        "message": "Systems online"
      }
    }
    *===========================*/

    let payload = {
      status: 200,
      service: "Monitor Engine",
      message: "Systems online",
    };
    /*
    
    */
    return super.ok(res, payload);
  }
}
