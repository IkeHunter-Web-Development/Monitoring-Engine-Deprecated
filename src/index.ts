import express from "express";
import WebsitePing from "./logic/cron";
import mongoose from "mongoose";
import router from "./router"; 
import 'dotenv/config';

const HOST = process.env.HOST || "localhost";
const PORT = +(process.env.PORT || 3000);

// require("dotenv").config();

const server = express();

// const uri = process.env.MONGO_URI || "";
const uri = `${process.env.MONGO_URI}:${process.env.MONGO_PORT}`;

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
  
const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
