import mongoose from "mongoose";

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

export const monitorSchema = new mongoose.Schema({
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

const Monitor = mongoose.model("Monitor", monitorSchema);

export default Monitor;
export type MonitorType = InstanceType<typeof Monitor>;
