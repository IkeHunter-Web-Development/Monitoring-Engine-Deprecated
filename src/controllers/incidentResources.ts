import type { Types } from 'mongoose'
import type { Incident } from 'src/models'
import { NotImplementedError } from 'src/utils'

export const createIncident = async (data: IIncident): Promise<Incident> => {
  throw new NotImplementedError('Create incident')
}
export const getIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  throw new NotImplementedError('Get incident')
}
export const getIncidents = async (): Promise<Incident[]> => {
  throw new NotImplementedError('Get incident')
}
export const getActiveIncidents = async (): Promise<Incident[]> => {
  throw new NotImplementedError('Get active incidents')
}
export const updateIncident = async (
  id: string | Types.ObjectId,
  data: Partial<IIncident>
): Promise<Incident> => {
  throw new NotImplementedError('Update incident')
}
export const deleteIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  throw new NotImplementedError('Delete incident')
}
