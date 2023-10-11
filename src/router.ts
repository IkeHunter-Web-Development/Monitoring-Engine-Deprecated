import { Router } from "express";
import * as MainController from "./controllers/main.controller";
import * as MonitorController from "./controllers/monitor.controller";

const router = Router();

router.get("/", MainController.healthCheck);

router.get("/monitors/", MonitorController.getMonitors);
router.get("/monitors/:id", MonitorController.getMonitor);
router.post("/monitors/", MonitorController.createMonitor);
router.put("/monitors/:id", MonitorController.updateMonitor);

router.delete("/monitors/:id", MonitorController.deleteMonitor);

export default router;


