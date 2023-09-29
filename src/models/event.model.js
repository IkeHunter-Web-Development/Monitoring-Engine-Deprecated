const mongoose = require("mongoose");
const Monitor = require("./monitor.model");

const eventSchema = new mongoose.Schema({
  monitor: {
    type: Monitor,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  online: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Event", eventSchema);
