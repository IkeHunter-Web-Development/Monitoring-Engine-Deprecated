const express = require("express");
const WebsitePing = require("./cron");
const fs = require("fs");
const winston = require("winston");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { combine, timestamp, cli, json, printf, colorize } = winston.format;

require("./emails")

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const server = express();

if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
}

const logger = winston.createLogger({
    level: "info",

    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS',
        }),
        printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })      
    ),

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
            level: process.env.LOGGING_LEVEL,
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

server.listen(PORT, HOST, () => {
    console.log(`Server running at ${HOST}:${PORT}`);
});
