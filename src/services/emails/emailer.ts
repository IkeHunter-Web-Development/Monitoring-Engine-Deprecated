export default class Emailer {
  static async sendEmail(recipient: string, subject: string, body: string) {
    console.log(`Sending email to ${recipient} with subject ${subject} and body ${body}`);
  }
}