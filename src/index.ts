import swaggerUi from "swagger-ui-express";
import { HOST, PORT, server, setupDatabase } from "src/config";
import { initializeSwagger } from "./docs/swagger";
import { registerConsumers } from "./data";

setupDatabase();
registerConsumers();

initializeSwagger().then(() => {
  const swaggerDocument = require("src/docs/swagger_output.json");
  server.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

export default server;
