/**
 * Mailer class to send emails using SendGrid.
 */
import sgMail from "@sendgrid/mail";
import logger from "./logger";
import 'dotenv/config';
import { EMAIL_USER, SENDGRID_API_KEY } from "src/config";

export default class Mailer {
  sgMail: any;
  logger: any;
  
  constructor() {
    this.sgMail = sgMail;
    this.sgMail.setApiKey(SENDGRID_API_KEY);
    this.logger = logger;
  }

  sendEmail(recipient: String, subject: String, text: String) {
    const msg = {
      to: recipient,
      from: EMAIL_USER,
      subject: subject,
      text: text,
    };
    this.sgMail
      .send(msg)
      .then(() => {
        this.logger.info("Email sent to " + recipient);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  sendWebsiteErrorEmail(website: any, log: String) {
    const subject = "Website Status Alert";
    const text = "Website issue detected with " + website.title + "!\nLog message:\n" + log;
    this.sendEmail(website.users, subject, text);
  }
  sendWebsiteOnlineEmail(website: any, log: String) {
    const subject = "Website Status Alert";
    const text = website.title + " is operating normally.\nLog:\n" + log;
    this.sendEmail(website.users, subject, text);
  }
}
