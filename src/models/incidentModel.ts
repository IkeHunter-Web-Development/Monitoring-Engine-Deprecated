import mongoose, { Schema } from 'mongoose'

export interface IncidentInterface {
  monitorId: string
  type: MonitorStatus
  status: IncidentStatus
  message: string
  timestamp?: Date
}

const IncidentSchema = new mongoose.Schema(
  {
    /** REQUIRED */
    monitorId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    message: {
      type: String,
      required: true
    },

    /** OPTIONAL */
    timestamp: {
      type: Date,
      default: Date.now,
      required: false
    }
  },
  {
    timestamps: true
  }
)

export const Incident = mongoose.model('Incident', IncidentSchema)
export type Incident = InstanceType<typeof Incident>
