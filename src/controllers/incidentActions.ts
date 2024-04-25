import type { Types } from 'mongoose'
import type { Incident } from 'src/models'
import { handleStartIncident } from 'src/services'
import { NotImplementedError, validateIncident } from 'src/utils'

export const incidentStart = async (data: IIncident): Promise<Incident> => {
  validateIncident(data)

  const incident = await handleStartIncident(data)
  throw new NotImplementedError('Start incident')
}

export const incidentEnd = async (id: string | Types.ObjectId): Promise<Incident> => {
  throw new NotImplementedError('End incident')
}
