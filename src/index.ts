import swaggerUi from "swagger-ui-express";
import { HOST, PORT, server, setupDatabase, MonitorSocket } from "src/config";

import { registerConsumers } from "./data";
import "src/config/socket";
import { initializeSwagger } from "./docs/swagger";
import { router } from "./routes";
import http from "http";

setupDatabase();
registerConsumers();

/** Create websocket application */
const app = http.createServer(server);
MonitorSocket.createSocket(app);

/** Generate swagger docs */
initializeSwagger().then(() => {
  const swaggerDocument = require("src/docs/swagger_output.json");
  router.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

/** Start server */
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
