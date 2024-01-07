import mongoose, { Types } from 'mongoose'

export interface IMonitorResponse {
  monitorId: Types.ObjectId
  responseTime: number
  timestamp: number
}

export const MonitorResponseSchema = new mongoose.Schema({
  monitorId: {
    type: Types.ObjectId,
    required: true
  },
  responseTime: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60 * 1000
  }
})

export const MonitorResponse = mongoose.model('MonitorResponse', MonitorResponseSchema)
export type MonitorResponse = InstanceType<typeof MonitorResponse>
