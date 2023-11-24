/**
 * @fileoverview General routes for the API.
 */

export const healthCheck = (req: any, res: any) => {
  // #swagger.tags = ['Main']
  // #swagger.description = 'Endpoint for checking the health of the API.'
  
  let payload = {
    status: 200,
    service: "Monitor Engine",
    message: "Systems online",
  };
  /*
  #swagger.responses[200] = {
    schema: {
      "status": 200,
      "service": "Monitor Engine",
      "message": "Systems online"
    }
  }
  */
  return res.status(200).json(payload);
};
