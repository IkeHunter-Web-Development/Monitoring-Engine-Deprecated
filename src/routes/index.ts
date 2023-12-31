import swaggerUi from "swagger-ui-express";
import { Router } from "express";
import { BaseController } from "../controllers/baseController";
import { monitorRoutes } from "./monitorRoutes"; // absolute import for swagger
import { eventRoutes } from "./eventRoutes"; // absolute import for swagger
import { initializeSwagger } from "src/docs/swagger";

const router = Router();
router.get("/", BaseController.healthCheck);
router.use("/api/monitor", monitorRoutes);
router.use("/api/monitor/events", eventRoutes);

initializeSwagger().then(() => {
  const swaggerDocument = require("src/docs/swagger_output.json");
  router.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

export { router };

export * from "./monitorRoutes";
export * from "./eventRoutes";
