import type { Incident } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const handleStartIncident = async (data: IIncident): Promise<Incident> => {
  throw new NotImplementedError('Start incident')
}

export const handleEndIncident = async (incident: Incident, data: IIncident): Promise<Incident> => {
  throw new NotImplementedError('Start incident')
}
