import type { Types } from 'mongoose'
import type { Incident } from 'src/models'
import { handleStartIncident } from 'src/services'
import { NotImplementedError, validateFullIncident } from 'src/utils'

export const startIncident = async (data: IIncident): Promise<Incident> => {
  validateFullIncident(data)

  const incident = await handleStartIncident(data)
  throw new NotImplementedError('Start incident')
}

export const endIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  throw new NotImplementedError('End incident')
}
