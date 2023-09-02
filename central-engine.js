const request = require("request");
const _ = require("lodash");

// TODO: create notify and get methods

module.exports = class CentralEngine {
    constructor() {
        this.centralUrl = process.env.CENTRAL_ENGINE_URL
        this.notifyEndpoint = process.env.CENTRAL_NOTIFY_ENDPOINT
        this.getEndpoint = process.env.CENTRAL_GET_ENDPOINT
    }
    notify(url, status_code, message) {
        request.post({
            url: new URL(this.notifyEndpoint, this.centralUrl),
            form: {
                url: url,
                status_code: status_code,
                message: message
            }
        }, (err, res, body) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }
    async getWebsites() {
        console.log("get websites")
        return new Promise((resolve, reject) => {
            request.get({
                url: new URL(this.getEndpoint, this.centralUrl),
            }, (err, res, body) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                let websites = JSON.parse(body);
                resolve(websites);
            });
        });
        
    }
    
}