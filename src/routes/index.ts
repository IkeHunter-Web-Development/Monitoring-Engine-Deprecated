import { Router } from "express";
import { BaseController } from "src/controllers/baseController";
import { monitorRoutes } from "./monitorRoutes"; // absolute import for swagger
import { eventRoutes } from "./eventRoutes"; // absolute import for swagger

const router = Router();
router.get("/", BaseController.healthCheck);
router.use("/api/monitor", monitorRoutes);
router.use("/api/monitor/events", eventRoutes);

export { router };

export * from "./monitorRoutes";
export * from "./eventRoutes";
