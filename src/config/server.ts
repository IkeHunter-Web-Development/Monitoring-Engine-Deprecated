import express from "express";
import multer from "multer";
import { router } from "src/routes";
import cors from "cors";
import responseTime from "response-time";

const server = express();

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(multer().any());
// FIXME: CONVERT TO CONDITIONAL VALUE FOR DEV/PROD
server.use(
  cors({
    origin: "*",
  })
);

server.use(responseTime());
server.use(router);

export { server };
