const express = require("express");
const WebsitePing = require("./cron");
const router = require("./router");

const HOST = process.env.HOST;
const PORT = process.env.PORT;

require("dotenv").config();

const server = express();

let websitePing = new WebsitePing();
websitePing.setupJobs();

server.use(router);

server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
});
