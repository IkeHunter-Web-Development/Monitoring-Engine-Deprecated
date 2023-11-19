import mongoose from "mongoose";
import { userSchema } from "../user/user.model";
import { ProjectSchema } from "../project/project.model";
import { AgencySchema } from "../agency/agency.model";

export const monitorSchema = new mongoose.Schema({
  // TODO: Add Interval
  // TODO: Add timeout
  // TODO: Add threshold
  // TODO: Add endpoints

  project: {
    type: ProjectSchema,
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
});

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;
