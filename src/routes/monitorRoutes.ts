import { Router } from "express";
import { MonitorController } from "src/controllers/monitorController"; // absolute import for swagger
import { hasPermission, isAuthenticated } from "src/middleware";

const router = Router();

const controller = new MonitorController();

router.get("/details", isAuthenticated, hasPermission, controller.getDetailedMonitors);
router.post("/alert", controller.alertMonitor);
router.get("/search", isAuthenticated, controller.searchMonitors);

router.get("/monitors/", isAuthenticated, controller.getMonitors)
router.get("/monitors/:id", isAuthenticated, hasPermission, controller.getMonitor);
router.post("/monitors/", isAuthenticated, controller.createMonitor);
router.put("/monitors/:id", isAuthenticated, hasPermission, controller.updateMonitor);
router.delete("/monitors/:id", isAuthenticated, hasPermission, controller.deleteMonitor);
router.get("/monitors/:id/online", isAuthenticated, hasPermission, controller.getMonitorOnlineStatus);

export const monitorRoutes = router;
