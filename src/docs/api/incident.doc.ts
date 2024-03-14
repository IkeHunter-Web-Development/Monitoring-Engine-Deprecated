import { Types } from 'mongoose'

export const IncidentDoc: IIncident = {
  monitorId: '',
  impact: 'maintenance',
  status: 'pending',
  cause: ''
}

export const IncidentMetaDoc: IIncidentMeta = {
  id: new Types.ObjectId().toString(),
  createdAt: 0,
  updatedAt: 0,
  resolvedAt: 0,
  monitorId: '',
  impact: 'maintenance',
  status: 'pending',
  cause: ''
}
