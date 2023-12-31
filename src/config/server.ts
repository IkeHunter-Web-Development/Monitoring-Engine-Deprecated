// import swaggerUi from "swagger-ui-express";
import express from "express";
import multer from "multer";
import { router } from "src/routes";
import responseTime from "response-time";
import http from "http";
// import { initializeSwagger } from "src/docs/swagger";

const app = express();

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

app.use(urlencodedParser);
app.use(jsonParser);
app.use(multer().any());

app.use(responseTime());
app.use(router);



export const server = http.createServer(app);
