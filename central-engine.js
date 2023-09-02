const request = require("request");

// TODO: create notify and get methods

class CentralEngine {
    constructor() {
        this.centralUrl = process.env.CENTRAL_ENGINE_URL
        this.notifyEndpoint = process.env.CENTRAL_NOTIFY_ENDPOINT
    }
    notify(url, status_code, message) {
        console.log("notify central engine")
        request.post({
            url: new URL(this.notifyEndpoint, this.centralUrl),
            body: {
                url: url,
                status_code: status_code,
                message: message
            }
        }, (err, res, body) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(body);
        });
    }
    
}