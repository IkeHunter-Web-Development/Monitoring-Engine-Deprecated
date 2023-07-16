/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const fs = require("fs");

const WEBSITE_FILE = "websites.json";
const CRON_SCHEDULE = "*/1 * * * *";

module.exports = class WebsitePing {
    constructor(logger) {
        this.logger = logger;
    }
    setupJobs() {
        console.log("Setting up cron jobs...");
        fs.readFile(WEBSITE_FILE, "utf8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let websites = JSON.parse(data).websites;
                websites.forEach((website) => {
                    cron.schedule(CRON_SCHEDULE, () => {
                        request(website.url, (error, response, body) => {
                            if (response.statusCode !== 200) {
                                // this.logger.error("Error " + response.statusCode + " " + website.title);
                                let error_msg =
                                    "Website issue detected with " +
                                    website.title +
                                    "! Expected: " +
                                    website.statusCode +
                                    ", received: " +
                                    response.statusCode + ".";
                                this.logger.error(error_msg);
                            } else {
                                let success_msg = website.title + " is operating normally. Status code: " + response.statusCode + ".";
                                this.logger.info(success_msg);
                            }
                        });
                    });
                });
            }
        });
    }
};
