/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const fs = require("fs");

const WEBSITE_FILE = "websites.json";
const CRON_SCHEDULE = "*/1 * * * *";

module.exports = class WebsitePing {
    constructor(logger, transporter) {
        this.logger = logger;
        this.transporter = transporter;
        this.mailOptions = {
            from: process.env.EMAIL_USER,
            to: "",
            subject: "Website Status Alert",
            text: "",
        };
        this.error_websites = [];
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
                            if (error) {
                                this.logger.error("Error retrieving " + website.title + ": \n");
                                console.log(error);
                                return;
                            }
                            if (response.statusCode !== 200) {
                                // this.logger.error("Error " + response.statusCode + " " + website.title);
                                let error_msg =
                                    "Website issue detected with " +
                                    website.title +
                                    "! Expected: " +
                                    website.statusCode +
                                    ", received: " +
                                    response.statusCode +
                                    ".";
                                this.logger.error(error_msg);

                                if (
                                    this.error_websites.includes(website.title)
                                ) {
                                    this.logger.verbose(
                                        "Already sent email for " +
                                            website.title +
                                            "."
                                    );
                                } else {
                                    this.error_websites.push(website.title);
                                    this.mailOptions.to = website.emails;
                                    this.mailOptions.text = error_msg;

                                    this.transporter.sendMail(
                                        this.mailOptions,
                                        (error, info) => {
                                            if (error) {
                                                // this.logger.error(error);
                                                console.log("err: " + error);
                                            } else {
                                                this.logger.info(
                                                    "Email sent to " +
                                                        website.emails +
                                                        "."
                                                );
                                            }
                                        }
                                    );
                                }
                            } else {
                                let success_msg =
                                    website.title +
                                    " is operating normally. Status code: " +
                                    response.statusCode +
                                    ".";
                                this.logger.info(success_msg);

                                if (
                                    this.error_websites.includes(website.title)
                                ) {
                                    this.error_websites.splice(
                                        this.error_websites.indexOf(
                                            website.title
                                        ),
                                        1
                                    );
                                    
                                    this.mailOptions.to = website.emails;
                                    this.mailOptions.text = success_msg;
                                    
                                    this.transporter.sendMail(
                                        this.mailOptions,
                                        (error, info) => {
                                            if (error) {
                                                console.log("Email error: " + error);
                                            } else {
                                                this.logger.info(
                                                    "Email sent to " +
                                                        website.emails +
                                                        "."
                                                );
                                            }
                                        });
                                }
                                
                            }
                        });
                    });
                });
            }
        });
    }
};
