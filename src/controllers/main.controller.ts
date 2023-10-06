/**
 * @fileoverview General routes for the API.
 */

export const healthCheck = (req: any, res: any) => {
  let payload = {
    status: 200,
    service: "Monitor Engine",
    message: "Systems online",
  };

  return res.status(200).json(payload);
};
