import mongoose, { Schema } from 'mongoose'

export interface IncidentInterface {
  monitorId: string
  type: MonitorStatus
  status: IncidentStatus
  message: string
  timestamp?: Date
}

const IncidentSchema = new Schema(
  {
    /** REQUIRED */
    monitorId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    type: {
      type: String,
      enum: [] as MonitorStatus[],
      required: true
    },
    status: {
      typs: String,
      // enum: ["open", "closed", "pending"],
      enum: [] as IncidentStatus[],
      required: true
    },
    message: {
      type: String,
      required: true
    },

    /** OPTIONAL */
    timestamp: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
)

export const Incident = mongoose.model('Incident', IncidentSchema)
export type Incident = InstanceType<typeof Incident>
