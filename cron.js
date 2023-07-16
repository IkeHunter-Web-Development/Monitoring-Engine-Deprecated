/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const fs = require("fs");

const WEBSITE_FILE = "websites.json";
const CRON_SCHEDULE = "*/1 * * * *";

module.exports = class WebsitePing {
    setupJobs() {
        console.log("Setting up cron jobs...")
        fs.readFile(WEBSITE_FILE, "utf8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let websites = JSON.parse(data).websites;
                websites.forEach((website) => {
                    cron.schedule(CRON_SCHEDULE, () => {
                        request(website.url, (error, response, body) => {
                            if (response.statusCode !== 200) {
                                console.log("Error: " + response.statusCode);
                            } else {
                                console.log("Success: " + response.statusCode);
                            }
                        });
                    });
                });
            }
        });
    }
}