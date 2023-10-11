import { Router } from "express";
import * as MainController from "./controllers/main.controller";
import * as MonitorController from "./controllers/monitor.controller";
import * as EventController from "./controllers/event.controller";

const router = Router();

/**
 * Main Routes
 */
router.get("/", MainController.healthCheck);

/**
 * Monitor Routes
 */
router.get("/monitors/", MonitorController.getMonitors);
router.get("/monitors/:id", MonitorController.getMonitor);
router.post("/monitors/", MonitorController.createMonitor);
router.put("/monitors/:id", MonitorController.updateMonitor);
router.delete("/monitors/:id", MonitorController.deleteMonitor);

/**
 * Event Routes
 */
router.get("/events/:id", EventController.getEvent);
router.delete("/events/:id", EventController.deleteEvent);
router.get("/events-search/", EventController.searchEvents);

export default router;


