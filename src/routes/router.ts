import { Router } from "express";
import { BaseController } from "src/controllers/baseController";
import { monitorRoutes } from "./monitorRoutes";
import { eventRoutes } from "./eventRoutes";

const router = Router();

router.get("/", BaseController.healthCheck);
router.use("/api/monitors", monitorRoutes);
router.use("/api/events", eventRoutes);

export default router;
