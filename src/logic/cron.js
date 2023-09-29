/**
 * Cron jobs to run on a schedule.
 */
const cron = require("node-cron");
const request = require("request");
const Mailer = require("./emails");
const CentralEngine = require("./central-engine");
const LogManager = require("./logger");
const { stat } = require("fs");
const logger = LogManager.logger;
const Monitor = require("../models/monitor.model");

const CRON_SCHEDULE = "*/1 * * * *";
const CRON_UPDATE_SCHEDULE = "*/10 * * * *";
const CRON_UPDATE_DELAY = 15000;
const RETRY_COUNT = 5;
const RETRY_DELAY = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = class WebsitePing {
  constructor() {
    this.logger = logger;
    this.error_websites = [];
    this.mailer = new Mailer(logger);
    this.jobs = [];
    this.centralEngine = new CentralEngine();
  }

  // async getWebsites() {
  //   const websites = await this.centralEngine.getWebsites();
  //   this.websites = websites;
  //   let count = websites.length;
  //   this.logger.info(`Retrieved ${count} websites from the database.`);
  //   return websites;
  // }
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

  websiteHasError(website) {
    return this.error_websites.includes(website.title);
  }

  removeErrorWebsite(website) {
    this.error_websites.splice(this.error_websites.indexOf(website.title), 1);
  }

  async getWebsiteStatus(url) {
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

  async handleWebsiteError(website, statusCode, error) {
    let down = true;

    for (let i = 0; i < RETRY_COUNT; i++) {
      this.logger.verbose("Issue with " + website.title + ", retrying... " + i);

      await sleep(RETRY_DELAY).then(() => {
        this.getWebsiteStatus(website.url).then(([retryStatus, retryErr]) => {
          if (!retryErr && retryStatus === website.status_code) {
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
      this.centralEngine.notify(website.url, statusCode, errorMsg);

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

  handleWebsiteOnline(website, statusCode) {
    let successMsg = LogManager.getSuccessMessage(website, statusCode);

    if (this.websiteHasError(website)) {
      let successMsg = LogManager.getBackOnlineMessage(website, statusCode);
      this.removeErrorWebsite(website);
      this.mailer.sendWebsiteOnlineEmail(website, successMsg);
      this.logger.info(successMsg);
      this.centralEngine.notify(website.url, statusCode, successMsg);
    } else {
      this.logger.verbose(successMsg);
    }
  }

  createWebsiteCronJob(website) {
    if (website.active === false) {
      this.logger.verbose("Skipping " + website.title + " because it is inactive.");
      return;
    }

    let job = cron.schedule(CRON_SCHEDULE, async () => {
      let [statusCode, error] = await this.getWebsiteStatus(website.url);

      if (error || statusCode !== website.status_code) {
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
};
