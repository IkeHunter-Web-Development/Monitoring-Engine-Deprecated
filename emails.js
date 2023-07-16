// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

module.exports = class Mailer {
    constructor() {
        this.sgMail = sgMail;
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
                console.log("Email sent");
            })
            .catch((error) => {
                console.error(error);
            });
    }
    
    sendWebsiteErrorEmail(website, log) {
        const subject = "Website Status Alert";
        const text = "Website issue detected with " + website.title + "!\nLog message:\n" + log;
        this.sendEmail(website.emails, subject, text);
    }
    sendWebsiteOnlineEmail(website, log) {
        const subject = "Website Status Alert";
        const text = website.title + " is operating normally.\nLog:\n" + log;
        this.sendEmail(website.emails, subject, text);
    }
    
}

// module.exports = sgMail;
