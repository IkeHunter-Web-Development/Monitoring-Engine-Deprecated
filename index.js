const express = require("express");
const WebsitePing = require("./cron");
const winston = require("winston");
const mongoose = require("mongoose");

const router = require("./router");



const HOST = process.env.HOST;
const PORT = process.env.PORT;

require("dotenv").config();

let username = process.env.MONGO_USER;
let password = process.env.MONGO_PASS;
let cluster = "utilitiescluster.vbeshqw";
let dbname = "ping_websites";

const MONGO_DB_URI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to database successfully.");
});

const server = express();


let websitePing = new WebsitePing();
websitePing.setupJobs();

server.use(router);

server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
});
