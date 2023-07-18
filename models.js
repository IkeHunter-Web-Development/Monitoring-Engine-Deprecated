/**
 * Models for MongoDB.
 */

const mongoose = require("mongoose");

const WebsiteSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,  
    },
    statusCode: {
        type: Number,
        required: true,
    },
    emails: {
        type: Array,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
        required: false
    }
        
});

const Website = mongoose.model("Website", WebsiteSchema);

module.exports = Website;