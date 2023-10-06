/**
 * @fileoverview General routes for the API.
 */

module.exports.healthCheck = (req, res) => {
  let payload = {
    status: 200,
    service: "Monitor Engine",
    message: "Systems online"
  }
  
  return res.status(200).json(payload);
}