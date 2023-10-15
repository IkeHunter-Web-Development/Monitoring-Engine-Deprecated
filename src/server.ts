import express from "express";
import router from "./router";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerDocument from "./docs/swagger_output.json";
import multer from "multer";
// import * as swagger from "swagger-express-ts";
// import { SwaggerDefinitionConstant } from "swagger-express-ts";

const server = express();

const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(multer().any());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Monitor Engine API Test",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local server",
      },
    ],
    
  },
  apis: [
    "/src/router.ts",
    "/src/controllers/event.controller.ts",
    "/src/controllers/monitor.controller.ts",
    "/src/controllers/main.controller.ts",
  ]
  }
// const swaggerSpec = swaggerJSDoc(options);

// server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
// server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// server.use("/docs", express.static('swagger'));;
// server.use("/docs/assets", express.static('node_modules/swagger-ui-dist'));
// server.use(swagger.express({
//   definition: {
//     info: {
//       title: "Monitor Engine API",
//       version: "0.1.0",
//     },
//     securityDefinitions: {
//       Bearer: {
//         type: SwaggerDefinitionConstant.Security.Type.API_KEY,
//         in: SwaggerDefinitionConstant.Security.In.HEADER,
//         name: "Authorization",
//       },
//     },
//   },
// }));




server.use(router);

export default server;
