import type { Types } from 'mongoose'
import { Incident } from 'src/models'
import { IncidentNotFoundError, validateIncident, validatePartialIncident } from 'src/utils'

export const createIncident = async (data: IIncident): Promise<Incident> => {
  validateIncident(data)

  const incident = await Incident.create(data)
  return incident
}
export const getIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  const incident = await Incident.findById(id)

  if (!incident) throw new IncidentNotFoundError(`Incident not found with id ${id}.`)

  return incident
}
export const getIncidents = async (): Promise<Incident[]> => {
  const incidents = await Incident.find({})
  return incidents
}
export const getActiveIncidents = async (): Promise<Incident[]> => {
  const incidents = await Incident.find({ $nor: [{ status: 'resolved' }, { status: 'completed' }] })

  return incidents
}
export const updateIncident = async (
  id: string | Types.ObjectId,
  data: Partial<IIncident>
): Promise<Incident> => {
  if (id === '') throw new IncidentNotFoundError('Id required to find incident.')
  validatePartialIncident(data)

  const incident = await Incident.findOneAndUpdate({ _id: id }, data, { new: true })
  if (!incident) throw new IncidentNotFoundError(`Incident not found with id ${id}.`)

  return incident
}
export const deleteIncident = async (id: string | Types.ObjectId): Promise<Incident> => {
  if (id === '') throw new IncidentNotFoundError('Id required to find incident.')

  const incident = await getIncident(id)
  await incident.deleteOne()

  return incident
}
