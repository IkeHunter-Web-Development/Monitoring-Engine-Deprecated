const mongoose = require("mongoose");
const User = require("./user.model");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
});

const monitorSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  users: [userSchema],
  statusCode: {
    type: Number,
    default: 200,
  },
  active: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model("Monitor", monitorSchema);
