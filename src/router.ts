import express from "express";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as MainController from "./controllers/main.controller";
import * as MonitorController from "./controllers/monitor.controller";

import swaggerDocument from "./swagger/swagger_output.json";

const router = Router();

router.get("/", MainController.healthCheck);

// router.get("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get("/monitors/", MonitorController.getMonitors);
router.get("/monitors/:id", MonitorController.getMonitor);
router.post("/monitors/", MonitorController.createMonitor);
router.put("/monitors/:id", MonitorController.updateMonitor);

router.delete("/monitors/:id", MonitorController.deleteMonitor);

export default router;


