import mongoose, { Schema } from 'mongoose'

// declare type IncidentStatus = 'open' | 'closed' | 'pending'
export enum IncidentStatus {
  open = 'open',
  closed = 'closed',
  pending = 'pending'
}

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
    impact: {
      type: String,
      enum: ['none', 'maintenance', 'minor', 'major', 'critical'],
      required: true
    },
    status: {
      type: String,
      enum: [
        /** Automated */
        'active',
        'pending',
        'resolved',
        /** Manual */
        'investigating',
        'identified',
        /** Maintenance */
        'inProgress',
        'completed'
      ],
      required: true
    },
    cause: {
      type: String,
      required: true
    },

    /** OPTIONAL */
    resolvedAt: {
      type: Date,
      required: false
    },
    displayName: {
      type: String,
      required: false
    },
    notes: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)

export const Incident = mongoose.model('Incident', IncidentSchema)
export type Incident = InstanceType<typeof Incident>
