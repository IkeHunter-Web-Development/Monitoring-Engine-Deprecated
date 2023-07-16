const express = require("express");
const WebsitePing = require("./cron");
const fs = require("fs");
const winston = require("winston");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { combine, timestamp, cli, json, printf, colorize } = winston.format;

const app = express();

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

const logger = winston.createLogger({
    level: "info",
    // format: combine(timestamp(), json()),
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS',
        }),
        printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })      
    ),
    // transports: [new winston.transports.Console()]
    transports: [
        new winston.transports.File({
            filename: "logs/combined.log",
            level: "info"
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error"
        }),
        new winston.transports.Console({
            level: "verbose",
            format: combine(
                colorize({ all: true }),
                timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss.SSS',
                }),
                printf((info) => {
                    return `${info.timestamp} ${info.level}: ${info.message}`;
                })      
            ),
        })
    ]
})

user = process.env.EMAIL_USER;
pass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: user,
        pass: pass
    }
});


websitePing = new WebsitePing(logger, transporter);
websitePing.setupJobs();

// cron.schedule("*/1 * * * *", () => {
//     console.log("running a task every minute");
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
