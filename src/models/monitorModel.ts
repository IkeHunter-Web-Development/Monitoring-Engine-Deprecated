import mongoose, { Schema } from 'mongoose'
import { SubscriberSchema } from './subscriberModel'
/**
 * Reference:
 * https://developer.statuspage.io/#operation/getPagesPageIdIncidents
 */

// Calculated by monitor service
export enum MonitorStatus {
  stable = 'stable',
  alert = 'alert',
  emergency = 'emergency',
  pending = 'pending'
}

// Info given by external services
export enum WebsiteAvailability {
  online = 'online',
  degraded = 'degraded',
  offline = 'offline',
  maintenance = 'maintenance',
  pending = 'pending'
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
    enum: Object.values(MonitorStatus),
    default: MonitorStatus.pending
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
  },
  subscribers: [SubscriberSchema]
}

export const WebsiteMonitorSchema = new Schema(
  {
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
      // enum: ['online', 'degraded', 'offline', 'maintenance', 'pending'],
      enum: Object.values(WebsiteAvailability),
      default: WebsiteAvailability.pending
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
    },
    lastCheck: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
)

export const WebsiteMonitor = mongoose.model('Monitor', WebsiteMonitorSchema)
export type WebsiteMonitor = InstanceType<typeof WebsiteMonitor>
