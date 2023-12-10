import { Router } from "express";
import { MonitorController } from "src/controllers";
import { hasPermission, isAuthenticated } from "src/middleware";

const router = Router();

router.get("/", isAuthenticated, MonitorController.getMonitors)
router.get("/:id", isAuthenticated, hasPermission, MonitorController.getMonitor);
router.post("/", isAuthenticated, MonitorController.createMonitor);
router.put("/:id", isAuthenticated, hasPermission, MonitorController.updateMonitor);
router.delete("/:id", isAuthenticated, hasPermission, MonitorController.deleteMonitor);
router.get("/:id/online", isAuthenticated, hasPermission, MonitorController.getMonitorOnlineStatus);

router.post("/alert", MonitorController.alertMonitorDown);
router.get("/search", isAuthenticated, MonitorController.searchMonitors);

export const monitorRoutes = router;
