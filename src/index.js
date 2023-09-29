const express = require("express");
const WebsitePing = require("./logic/cron");
const router = require("./router");
const mongoose = require("mongoose");

const HOST = process.env.HOST;
const PORT = process.env.PORT;

require("dotenv").config();

const server = express();

const uri = process.env.MONGO_URI || "";

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    
    let websitePing = new WebsitePing();
    websitePing.setupJobs();
  })
  .catch((err) => {
    console.error.bind("Error connecting to MongoDB: ", err);
  });

server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`Server running at ${HOST}:${PORT}`);
});
