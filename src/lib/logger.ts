import fs from "fs";
import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

export default class Logger {
  format: any;
  logger: any;
  
  constructor() {
    this.format = this.logFormat();
    this.logger = this.createLogger();

    if (!fs.existsSync("logs")) {
      fs.mkdirSync("logs");
    }
  }

  logFormat() {
    if (NODE_ENV === "production") {
      return combine(
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS",
        }),
        printf((info: any) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        })
      );
    } else {
      return combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS",
        }),
        printf((info: any) => {
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
        printf((info: any) => {
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
          level: LOGGING_LEVEL,
          format: this.format,
        }),
      ],
    });
  }

  getErrorMessage(website: any, statusCode: Number) {
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

  getErrorResponseMessage(website: any, error: String) {
    return "Website issue detected with " + website.title + "! Error: " + error + ".";
  }

  getSuccessMessage(website: any, statusCode: Number) {
    return website.title + " is operating normally. Status code: " + statusCode + ".";
  }

  getBackOnlineMessage(website: any, statusCode: Number) {
    return website.title + " is back online. Status code: " + statusCode + ".";
  }
}

// module.exports = new Logger();
