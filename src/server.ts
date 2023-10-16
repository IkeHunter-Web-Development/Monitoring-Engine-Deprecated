import express from "express";
import router from "./router";
import multer from "multer";

const server = express();

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(multer().any());

server.use(router);

export default server;
