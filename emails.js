/**
 * Mailer class to send emails using SendGrid.
 */

const sgMail = require("@sendgrid/mail");
require("dotenv").config();

module.exports = class Mailer {
    constructor(logger) {
        this.sgMail = sgMail;
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.logger = logger;
    }

    sendEmail(recipient, subject, text) {
        const msg = {
            to: recipient,
            from: process.env.EMAIL_USER,
            subject: subject,
            text: text,
        };
        this.sgMail
            .send(msg)
            .then(() => {
                // console.log("Email sent");
                this.logger.info("Email sent to " + recipient);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    sendWebsiteErrorEmail(website, log) {
        const subject = "Website Status Alert";
        const text =
            "Website issue detected with " +
            website.title +
            "!\nLog message:\n" +
            log;
        this.sendEmail(website.users, subject, text);
    }
    sendWebsiteOnlineEmail(website, log) {
        const subject = "Website Status Alert";
        const text = website.title + " is operating normally.\nLog:\n" + log;
        this.sendEmail(website.users, subject, text);
    }
};

