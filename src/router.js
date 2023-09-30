const express = require("express");
const router = express.Router();

const MonitorController = require("./controllers/monitor.controller");

router.get("/monitors/", MonitorController.getMonitors);
router.get("/monitors/:id", MonitorController.getMonitor);
router.post("/monitors/", MonitorController.createMonitor);
router.put("/monitors/:id", MonitorController.updateMonitor);

router.delete("/monitors/:id", MonitorController.deleteMonitor);

module.exports = router;


