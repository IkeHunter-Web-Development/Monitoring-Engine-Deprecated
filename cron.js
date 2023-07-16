/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const fs = require("fs");
const Mailer = require("./emails");

mailer = new Mailer();

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

    websiteHasError(website) {
        return this.error_websites.includes(website.title);
    }

    getErrorMessage(website, statusCode) {
        return (
            "Website issue detected with " +
            website.title +
            "! Expected: " +
            website.statusCode +
            ", received: " +
            statusCode +
            "."
        );
    }

    getSuccessMessage(website, statusCode) {
        return (
            website.title +
            " is operating normally. Status code: " +
            statusCode +
            "."
        );
    }

    // sendEmail(website, message) {
    //     this.mailOptions.to = website.emails;
    //     this.mailOptions.text = message;

    //     this.transporter.sendMail(this.mailOptions, (error, info) => {
    //         if (error) {
    //             console.log("Email error: " + error);
    //         } else {
    //             this.logger.info("Email sent to " + website.emails + ".");
    //         }
    //     });
    // }

    removeErrorWebsite(website) {
        this.error_websites.splice(
            this.error_websites.indexOf(website.title),
            1
        );
    }

    createWebsiteCronJob(website) {
        cron.schedule(CRON_SCHEDULE, () => {
            request(website.url, (error, response, body) => {
                if (error) {
                    this.logger.error(
                        "Error retrieving " + website.title + ": \n"
                    );
                    console.log(error);
                    return;
                }
                if (response.statusCode !== 200) {
                    let error_msg = this.getErrorMessage(
                        website,
                        response.statusCode
                    );

                    this.logger.error(error_msg);

                    if (this.websiteHasError(website)) {
                        this.logger.verbose(
                            "Already sent email for " + website.title + "."
                        );
                    } else {
                        this.error_websites.push(website.title);

                        // this.sendEmail(website, error_msg);
                        mailer.sendWebsiteErrorEmail(website, error_msg);
                    }
                } else {
                    let success_msg = this.getSuccessMessage(
                        website,
                        response.statusCode
                    );
                    this.logger.info(success_msg);

                    if (this.websiteHasError(website)) {
                        this.removeErrorWebsite(website);
                        // this.sendEmail(website, success_msg);
                        mailer.sendWebsiteOnlineEmail(website, success_msg);
                    }
                }
            });
        });
    }

    pingWebsiteJobs() {
        fs.readFile(WEBSITE_FILE, "utf8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let websites = JSON.parse(data).websites;
                websites.forEach((website) => {
                    this.createWebsiteCronJob(website);
                });
            }
        });
    }

    setupJobs() {
        console.log("Setting up cron jobs...");
        this.pingWebsiteJobs();
    }
};
