import mongoose from 'mongoose'
import { UserSchema } from './userModel'

export interface IMonitor {
  projectId: string
  url: string
  title: string
  recipients?: Array<typeof UserSchema>
  targetStatusCode?: number
  currentStatusCode?: number
  active?: boolean
  status?: MonitorStatus
  online?: boolean
  type?: string
  endpoints?: string[]
  interval?: number
  timeout?: number
  retries?: number
  coverImage?: string
}

// TODO: Recovery mode? send request every x seconds
export const MonitorSchema = new mongoose.Schema(
  {
    /** REQUIRED */
    projectId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },

    /** OPTIONAL */
    recipients: [UserSchema],
    targetStatusCode: {
      type: Number,
      default: 200
    },
    currentStatusCode: {
      type: Number,
      default: 200
    },
    active: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      // enum: ["online", "alert", "offline", "pending"],
      enum: [] as MonitorStatus[],
      // enum: ["stable", "alert", "warning", "pending"],
      default: 'pending'
      // required: true
    },

    online: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['http'],
      default: 'http'
    },
    endpoints: {
      type: Array,
      default: ['/']
    },
    interval: {
      type: Number,
      default: 60
    },
    // TODO: Implement these
    timeout: {
      type: Number,
      default: 30
    },
    retries: {
      type: Number,
      default: 3
    },
    coverImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

export const Monitor = mongoose.model('Monitor', MonitorSchema)
export type Monitor = InstanceType<typeof Monitor>
