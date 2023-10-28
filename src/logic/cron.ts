/**
 * Cron jobs to run on a schedule.
 */
import cron from "node-cron";
import Mailer from "./emails";
import Logger from "./logger";
import Monitor from "../models/monitor/monitor.model";

let LogManager: Logger = new Logger();
const logger = LogManager.logger;

const CRON_SCHEDULE = "*/1 * * * *";
const CRON_UPDATE_SCHEDULE = "*/10 * * * *";
const CRON_UPDATE_DELAY = 15000;
const RETRY_COUNT = 5;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default class WebsitePing {
  logger: any;
  error_websites: string[];
  mailer: Mailer;
  jobs: any[];

  constructor() {
    this.logger = logger;
    this.error_websites = [];
    this.mailer = new Mailer();
    this.jobs = [];
  }

  async getWebsites() {
    let websites = Monitor.find({ active: true })
      .then((websites) => {
        return websites ? websites : [];
      })
      .catch((err) => {
        this.logger.error(err);
        return [];
      });

    return websites;
  }

  websiteHasError(website: any) {
    return this.error_websites.includes(website.title);
  }

  removeErrorWebsite(website: any) {
    this.error_websites.splice(this.error_websites.indexOf(website.title), 1);
  }

  async getWebsiteStatus(url: string) {
    let returnStatus;
    let returnError;

    await fetch(url, { cache: "no-cache" })
      .then((res) => {
        returnStatus = res.status;
      })
      .catch((err) => {
        returnError = err;
      });

    return [returnStatus, returnError];
  }

  async handleWebsiteError(website: any, statusCode: number, error: String) {
    let down = true;

    for (let i = 0; i < RETRY_COUNT; i++) {
      this.logger.verbose("Issue with " + website.title + ", retrying... " + i);

      await sleep(RETRY_DELAY).then(() => {
        this.getWebsiteStatus(website.url).then(([retryStatus, retryErr]) => {
          if (!retryErr && retryStatus === website.statusCode) {
            down = false;
          }
        });
      });

      if (!down) {
        break;
      }
    }

    if (down) {
      let errorMsg = "";
      statusCode = statusCode ? statusCode : 500;
      if (error) {
        errorMsg = LogManager.getErrorResponseMessage(website, error);
      } else {
        errorMsg = LogManager.getErrorMessage(website, statusCode);
      }
      this.logger.error(errorMsg);
      // this.centralEngine.notify(website.url, statusCode, errorMsg);

      if (this.websiteHasError(website)) {
        this.logger.verbose("Already sent email for " + website.title + ".");
      } else {
        this.error_websites.push(website.title);
        this.mailer.sendWebsiteErrorEmail(website, errorMsg);
      }
    } else {
      this.handleWebsiteOnline(website, statusCode);
    }
  }

  handleWebsiteOnline(website: any, statusCode: number) {
    let successMsg = LogManager.getSuccessMessage(website, statusCode);

    if (this.websiteHasError(website)) {
      let successMsg = LogManager.getBackOnlineMessage(website, statusCode);
      this.removeErrorWebsite(website);
      this.mailer.sendWebsiteOnlineEmail(website, successMsg);
      this.logger.info(successMsg);
      // this.centralEngine.notify(website.url, statusCode, successMsg);
    } else {
      this.logger.verbose(successMsg);
    }
  }

  createWebsiteCronJob(website: any) {
    if (website.active === false) {
      this.logger.verbose("Skipping " + website.title + " because it is inactive.");
      return;
    }

    let job = cron.schedule(CRON_SCHEDULE, async () => {
      let [returnCode, returnError] = await this.getWebsiteStatus(website.url);
      let statusCode: number = returnCode ? returnCode : 500;
      let error: String = returnError ? returnError : "";

      if (error || statusCode !== website.statusCode) {
        this.handleWebsiteError(website, statusCode, error);
      } else {
        this.handleWebsiteOnline(website, statusCode);
      }
    });

    this.jobs.push(job);
  }

  pingWebsiteJobs() {
    this.getWebsites().then((websites) => {
      if (websites.length === 0) {
        this.logger.info("No websites found in database.");
        return;
      }

      websites.forEach((website) => {
        this.createWebsiteCronJob(website);
      });
    });
  }
  refreshDatabaseJob() {
    cron.schedule(CRON_UPDATE_SCHEDULE, () => {
      setTimeout(() => {
        this.logger.info("Refreshing database...");

        this.jobs.forEach((job) => {
          job.stop();
        });
        this.jobs = [];

        this.pingWebsiteJobs();
      }, CRON_UPDATE_DELAY);
    });
  }

  setupJobs() {
    console.log("Setting up cron jobs...");
    this.pingWebsiteJobs();
    this.refreshDatabaseJob();
  }
}
