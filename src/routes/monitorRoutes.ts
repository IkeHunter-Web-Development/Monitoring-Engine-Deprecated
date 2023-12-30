import { Router } from "express";
import { MonitorController } from "../controllers/monitorController"; // absolute import for swagger
import { isAuthenticated } from "../middleware/authMiddleware";
import { hasPermission } from "../middleware";

const router = Router();

router.get("/details", isAuthenticated, hasPermission, MonitorController.getDetailedMonitors);
router.post("/alert", MonitorController.alertMonitor);
router.get("/search", isAuthenticated, MonitorController.searchMonitors);

router.get("/monitors/", isAuthenticated, MonitorController.getMonitors);
router.get("/monitors/:id", isAuthenticated, hasPermission, MonitorController.getMonitor);
router.post("/monitors/", isAuthenticated, MonitorController.createMonitor);
router.put("/monitors/:id", isAuthenticated, hasPermission, MonitorController.updateMonitor);
router.patch("/monitors/:id", isAuthenticated, hasPermission, MonitorController.updateMonitor);
router.delete("/monitors/:id", isAuthenticated, hasPermission, MonitorController.deleteMonitor);
router.get(
  "/monitors/:id/online",
  isAuthenticated,
  hasPermission,
  MonitorController.getMonitorOnlineStatus
);

export const monitorRoutes = router;
