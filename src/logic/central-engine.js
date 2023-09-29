const request = require("request");
const _ = require("lodash");
const { logger } = require("./logger");

const CENTRAL_NOTIFY_ENDPOINT="/engine/notify/"
const CENTRAL_GET_ENDPOINT="/engine/monitors/"

module.exports = class CentralEngine {
    constructor() {
        this.centralUrl = process.env.CENTRAL_ENGINE_URL;
        this.notifyEndpoint = CENTRAL_NOTIFY_ENDPOINT;
        this.getEndpoint = CENTRAL_GET_ENDPOINT;
        this.logger = logger;
    }
    notify(url, status_code, message) {
        request.post(
            {
                url: new URL(this.notifyEndpoint, this.centralUrl),
                form: {
                    url: url,
                    status_code: status_code,
                    message: message,
                },
            },
            (err, res, body) => {
                if (err) {
                    // console.log(err);
                    this.logger.error(err);
                    return;
                }
            }
        );
    }
    async getWebsitesRequest() {
        return new Promise((resolve, reject) => {
            request.get(
                {
                    url: new URL(this.getEndpoint, this.centralUrl),
                },
                (err, res, body) => {
                    let websites = [];
                    if (err) {
                        // console.log(err);
                        reject(err);
                    }
                    try {
                        websites = JSON.parse(body);
                        resolve(websites);
                    } catch (err) {
                        // console.log(err);
                        reject(err);
                    }
                }
            );
        });
    }
    // async getWebsites() {
    //     console.log("get websites");

    //     while (true) {
    //         try {
    //             let websites = await this.getWebsitesRequest();
    //             console.log("Central engine ready, returning websites: " + websites.length)
    //             return websites;
    //         } catch (err) {
    //             console.log("Central engine not ready, trying again...");
    //             await new Promise((resolve) => setTimeout(resolve, 1000));
    //         }
    //     }
    // }
};
