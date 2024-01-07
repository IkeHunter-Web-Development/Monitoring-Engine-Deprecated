import type { Types } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

export interface IEvent {
  projectId: string
  message: string
  monitorId?: Types.ObjectId
  timestamp?: Date
}

const EventSchema = new mongoose.Schema(
  {
    /** REQUIRED */
    projectId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },

    /** OPTIONAL */
    monitorId: {
      type: Schema.Types.ObjectId,
      required: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

export const Event = mongoose.model('Event', EventSchema)
export type Event = InstanceType<typeof Event> & {
  timestamp: Date
}
