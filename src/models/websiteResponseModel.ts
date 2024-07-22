import mongoose, { Types } from 'mongoose'

export const WebsiteResponseSchema = new mongoose.Schema({
  monitorId: {
    type: Types.ObjectId,
    ref: 'WebsiteMonitor',
    required: true
  },
  responseTime: {
    type: Number,
    default: null,
    required: false
  },
  timestamp: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60
  }
})

export const WebsiteResponse = mongoose.model('MonitorResponse', WebsiteResponseSchema)
export type WebsiteResponse = InstanceType<typeof WebsiteResponse>
