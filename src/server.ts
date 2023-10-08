import express from "express";
import router from "./router"; 
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger_output.json";
const server = express();


const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(urlencodedParser);
server.use(jsonParser);
server.use(router);

export default server;