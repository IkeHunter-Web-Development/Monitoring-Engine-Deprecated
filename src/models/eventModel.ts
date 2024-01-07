import mongoose, { Schema } from 'mongoose'

export interface EventInterface {
  projectId: string
  message: string
  monitorId?: string
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
    // statusCode: {
    //   type: Number,
    //   required: true,
    // },
    // online: {
    //   type: Boolean,
    //   default: true,
    // },
    // responseTime: {
    //   type: Number,
    //   required: false,
    // },
    // status: {
    //   type: String,
    //   enum: ["online", "alert", "offline", "pending"],
    //   required: true
    // }
  },
  {
    timestamps: true
  }
)

export const Event = mongoose.model('Event', EventSchema)
export type Event = InstanceType<typeof Event> & {
  timestamp: Date
}
