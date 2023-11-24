import mongoose from "mongoose";
import { userSchema } from "../../core/models/user/user.model";
// import { ProjectSchema } from "../project/project.model";
// import { AgencySchema } from "../agency/agency.model";
import { MonitorType } from "./types";

export const monitorSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  users: [userSchema],
  url: {
    type: String,
    required: true,
  },
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
  },
  type: {
    type: String,
    enum: ["http"],
    default: "http",
  },
  endpoints: {
    type: Array,
    default: ["/"],
  },
  interval: {
    type: Number,
    default: 60,
  },
  timeout: {
    type: Number,
    default: 30,
  },
  retries: {
    type: Number,
    default: 3,
  },
});

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;
