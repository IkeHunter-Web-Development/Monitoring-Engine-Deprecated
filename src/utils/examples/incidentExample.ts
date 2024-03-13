import { Types } from 'mongoose'

export const incidentExample: IIncident = {
  monitorId: new Types.ObjectId().toString(),
  impact: 'none',
  status: 'active',
  cause: 'Example cause',
  displayName: 'Example Incident',
  notes: 'Lorem ipsum...'
}
