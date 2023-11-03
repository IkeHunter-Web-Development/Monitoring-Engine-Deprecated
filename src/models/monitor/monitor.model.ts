import mongoose from "mongoose";
import { userSchema } from "../user/user.model";



export const monitorSchema = new mongoose.Schema({
  // TODO: Add monitor type
  // TODO: Add Interval
  // TODO: Add timeout
  // TODO: Add threshold
  // TODO: Add endpoints
  
  projectId: {
    type: String,
    required: true,
  },
  companyId: {
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

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;


