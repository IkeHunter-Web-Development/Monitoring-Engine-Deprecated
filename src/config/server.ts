// import swaggerUi from "swagger-ui-express";
import express from "express";
import multer from "multer";
import { router } from "src/routes";
import responseTime from "response-time";
// import { initializeSwagger } from "src/docs/swagger";

export const server = express();

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(multer().any());

server.use(responseTime());
server.use(router);

// export const app = http.createServer(server);
