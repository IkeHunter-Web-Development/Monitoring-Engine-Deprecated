const express = require("express");
// const cron = require("./cron");
// import WebsitePing from "./cron";
const WebsitePing = require("./cron");
// const cron = require("node-cron");

const app = express();

websitePing = new WebsitePing();
websitePing.setupJobs();

// cron.schedule("*/1 * * * *", () => {
//     console.log("running a task every minute");
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
