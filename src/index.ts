import WebsitePing from "./logic/cron";
import mongoose from "mongoose";
import "dotenv/config";
import server from "./server";
import swaggerUi from "swagger-ui-express";
import { initializeSwagger } from "./docs/swagger";

const HOST = process.env.HOST || "localhost";
const PORT = +(process.env.PORT || 3000);

const uri = process.env.MONGO_URI || "";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    let websitePing = new WebsitePing();
    websitePing.setupJobs();
  })
  .catch((err: any) => {
    console.error.bind("Error connecting to MongoDB: ", err);
  });

initializeSwagger().then(() => {
  const swaggerDocument = require('./docs/swagger_output.json');
  server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
})

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

export default server;
