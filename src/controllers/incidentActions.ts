import type { Types } from 'mongoose'
import type { Incident } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const startIncident = async (data: IIncident): Promise<Incident> => {
  throw new NotImplementedError('Start incident')
}

export const endIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  throw new NotImplementedError('Start incident')
}
