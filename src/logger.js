const fs = require("fs");
const winston = require("winston");

const { combine, timestamp, printf, colorize } = winston.format;

class Logger {
    constructor() {
        this.format = this.logFormat();
        this.logger = this.createLogger();

        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
    }

    logFormat() {
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
    }

    createLogger() {
        return winston.createLogger({
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
                    format: this.format,
                }),
            ],
        });
    }

    getErrorMessage(website, statusCode) {
        return (
            "Website issue detected with " +
            website.title +
            "! Expected: " +
            website.status_code +
            ", received: " +
            statusCode +
            "."
        );
    }
    
    getErrorResponseMessage(website, error) {
        return (
            "Website issue detected with " +
            website.title +
            "! Error: " +
            error +
            "."
        );
    }

    getSuccessMessage(website, statusCode) {
        return website.title + " is operating normally. Status code: " + statusCode + ".";
    }

    getBackOnlineMessage(website, statusCode) {
        return website.title + " is back online. Status code: " + statusCode + ".";
    }
}

module.exports = new Logger();
