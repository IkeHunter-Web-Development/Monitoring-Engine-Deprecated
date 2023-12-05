import { Router } from "express";
import { BaseController } from "src/controllers";
import { monitorRoutes } from "./monitorRoutes";

const router = Router();

router.get("/", BaseController.healthCheck);
router.use("/api/monitors", monitorRoutes);
router.use("/api/events", monitorRoutes);

export default router;
