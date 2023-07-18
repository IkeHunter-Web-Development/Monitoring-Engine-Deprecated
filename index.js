const express = require("express");
const WebsitePing = require("./cron");
const fs = require("fs");
const winston = require("winston");
const mongoose = require("mongoose");

const { combine, timestamp, printf, colorize } = winston.format;

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

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

const logFormat = () => {
    if (process.env.NODE_ENV === "production") {
        return combine(
            timestamp({
                format: "YYYY-MM-DD hh:mm:ss.SSS",
            }),
            printf((info) => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        );
    } else {
        return combine(
            colorize({ all: true }),
            timestamp({
                format: "YYYY-MM-DD hh:mm:ss.SSS",
            }),
            printf((info) => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        );
    }
};

const logger = winston.createLogger({
    level: "info",

    format: combine(
        timestamp({
            format: "YYYY-MM-DD hh:mm:ss.SSS",
        }),
        printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),

    transports: [
        new winston.transports.File({
            filename: "logs/combined.log",
            level: "info",
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.Console({
            level: process.env.LOGGING_LEVEL,
            format: logFormat(),
        }),
    ],
});

websitePing = new WebsitePing(logger);
websitePing.setupJobs();

server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
});
