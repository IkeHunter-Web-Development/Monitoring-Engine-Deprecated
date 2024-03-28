import mongoose, { Schema } from 'mongoose'

import { SubscriberSchema } from './subscriberModel'
// import { MonitorStatus, WebsiteAvailability } from 'src/types/enums'
/**
 * Reference:
 * https://developer.statuspage.io/#operation/getPagesPageIdIncidents
 */

// Calculated by monitor service

const statusOptions: MonitorStatus[] = ['alert', 'emergency', 'pending', 'stable']
const statusDefault: MonitorStatus = 'pending'

const availabilityOptions: WebsiteAvailability[] = [
  'degraded',
  'maintenance',
  'offline',
  'online',
  'online',
  'pending'
]
const availabilityDefault: WebsiteAvailability = 'pending'

export const MonitorSchema = {
  /** DEFAULT */
  // TODO: uuid

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
    enum: statusOptions,
    default: statusDefault
    // enum: Object.values(MonitorStatus),
    // default: MonitorStatus.pending
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
  lastCheck: {
    type: Date,
    required: false
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
      enum: availabilityOptions,
      default: availabilityDefault
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
    // lastCheck: {
    //   type: Date,
    //   required: false
    // }
  },
  {
    timestamps: true
  }
)

export const WebsiteMonitor = mongoose.model('WebsiteMonitor', WebsiteMonitorSchema)
export type WebsiteMonitor = InstanceType<typeof WebsiteMonitor>
