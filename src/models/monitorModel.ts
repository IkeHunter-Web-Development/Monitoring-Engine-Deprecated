import mongoose, { Schema } from 'mongoose'
/**
 * Reference:
 * https://developer.statuspage.io/#operation/getPagesPageIdIncidents
 */

export enum MonitorStatus {
  'stable',
  'alert',
  'emergency',
  'pending'
}

export const MonitorSchema = {
  /** REQUIRED */
  projectId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },

  /** OPTIONAL */
  status: {
    type: String,
    enum: MonitorStatus,
    default: 'pending'
  },
  interval: {
    type: Number,
    default: 60 // Seconds
  },
  icon: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: false,
    default: true
  },
  reminderIntervals: {
    type: Number,
    default: 10 // Minutes
  }
}

export const WebsiteMonitorSchema = new Schema({
  ...MonitorSchema,
  /** Required */
  url: {
    type: String,
    required: true
  },

  /** Optional */
  checkType: {
    type: String,
    enum: ['http'],
    default: 'http'
  },
  availability: {
    type: String,
    enum: ['online', 'degraded', 'offline', 'maintenance', 'pending'],
    default: 'pending'
  },
  retries: {
    type: Number,
    default: 3
  },
  timeout: {
    type: Number,
    default: 30 // Seconds
  },
  responseTime: {
    type: Number,
    default: -1
  }
})

export const WebsiteMonitor = mongoose.model('Monitor', WebsiteMonitorSchema)
export type WebsiteMonitor = InstanceType<typeof WebsiteMonitor>

// export const WebsiteMonitorSchema = MonitorSchema.discriminator('WebsiteMonitor', WebsiteMonitorSchemaBase)
// export const WebsiteMonitor = mongoose.model('WebsiteMonitor', WebsiteMonitorSchema);

// export const WebsiteMonitor = mongoose.model('WebsiteMonitor', WebsiteMonitorSchema)
// export type WebsiteMonitor = InstanceType<typeof WebsiteMonitor>
