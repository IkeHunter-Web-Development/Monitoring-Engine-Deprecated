import type { Types } from 'mongoose'
import { Incident } from 'src/models'
import { IncidentNotFoundError, validateFullIncident, validateIncidentInput } from 'src/utils'

export const incidentCreate = async (data: IIncident): Promise<Incident> => {
  validateFullIncident(data)

  const incident = await Incident.create(data)
  return incident
}
export const incidentGetOne = async (id: string | Types.ObjectId): Promise<Incident> => {
  const incident = await Incident.findById(id)

  if (!incident) throw new IncidentNotFoundError(`Incident not found with id ${id}.`)

  return incident
}
export const incidentGetList = async (): Promise<Incident[]> => {
  const incidents = await Incident.find({})
  return incidents
}
export const incidentGetActiveList = async (): Promise<Incident[]> => {
  const incidents = await Incident.find({ $nor: [{ status: 'resolved' }, { status: 'completed' }] })

  return incidents
}
export const incidentUpdate = async (
  id: string | Types.ObjectId,
  data: Partial<IIncident>
): Promise<Incident> => {
  if (id === '') throw new IncidentNotFoundError('Id required to find incident.')
  validateIncidentInput(data)

  const incident = await Incident.findOneAndUpdate({ _id: id }, data, { new: true })
  if (!incident) throw new IncidentNotFoundError(`Incident not found with id ${id}.`)

  return incident
}
export const incidentDelete = async (id: string | Types.ObjectId): Promise<Incident> => {
  if (id === '') throw new IncidentNotFoundError('Id required to find incident.')

  const incident = await incidentGetOne(id)
  await incident.deleteOne()

  return incident
}
