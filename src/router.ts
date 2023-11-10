import { Router } from "express";
import * as MainController from "./controllers/main.controller";
import * as MonitorController from "./controllers/monitor.controller";
import * as EventController from "./controllers/event.controller";
import { isAuthenticated } from "./middleware/auth.middleware";
import { hasPermission } from "./middleware/permissions.middleware";

const router = Router();

/**
 * Main Routes
 */
router.get("/", MainController.healthCheck);

/**
 * Monitor Routes
 */
router.get("/monitors/", isAuthenticated, MonitorController.getMonitors);
router.get("/monitors/:id", isAuthenticated, hasPermission, MonitorController.getMonitor);
router.post("/monitors/", isAuthenticated, MonitorController.createMonitor);
router.put("/monitors/:id", isAuthenticated, hasPermission, MonitorController.updateMonitor);
router.delete("/monitors/:id", isAuthenticated, hasPermission, MonitorController.deleteMonitor);
router.get(
  "/monitors/:id/online",
  isAuthenticated,
  hasPermission,
  MonitorController.getMonitorOnlineStatus
);
router.get("/monitors-search/", isAuthenticated, MonitorController.searchMonitors);

/**
 * Event Routes
 */
router.get("/events/:id", isAuthenticated, EventController.getEvent);
router.delete("/events/:id", isAuthenticated, EventController.deleteEvent);
router.get("/events-search/", isAuthenticated, EventController.searchEvents);

export default router;
