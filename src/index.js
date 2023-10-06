const express = require("express");
const WebsitePing = require("./logic/cron");
const mongoose = require("mongoose");
const router = require("./router"); 

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
  
const urlencodedParser = express.urlencoded({ extended: false });
const jsonParser = express.json();

server.use(urlencodedParser);
server.use(jsonParser);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
