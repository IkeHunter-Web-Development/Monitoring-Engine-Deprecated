import { isValidObjectId } from 'mongoose'
import { isIncidentImpact, isIncidentStatus } from 'src/utils/validation/validateTypes'
import { InvalidIncidentFieldError } from '../exceptions'

const MAX_INCIDENT_CAUSE_LENGTH = 128 // chars
const MAX_INCIDENT_DISPLAY_NAME_LENGTH = 60 // chars

export const validateFullIncident = (data: any): IIncident => {
  if (!data.monitorId || !data.impact || !data.status || !data.cause)
    throw new InvalidIncidentFieldError('Incident must include monitor, impact, status, and cause.')

  return validateIncidentInput(data) as IIncident
}

export const validateIncidentInput = (data: any): Partial<IIncident> => {
  if (data.monitorId && !isValidObjectId(data.monitorId))
    throw new InvalidIncidentFieldError('Monitor id must be a valid Object Id')
  if (data.impact && !isIncidentImpact(data.impact))
    throw new InvalidIncidentFieldError('Must provide a valid incident impact option.')
  if (data.status && !isIncidentStatus(data.status))
    throw new InvalidIncidentFieldError('Must provide a valid incident status.')
  if (data.cause && typeof data.cause === 'string' && data.cause.length > MAX_INCIDENT_CAUSE_LENGTH)
    throw new InvalidIncidentFieldError(
      `Incident cause must be less than ${MAX_INCIDENT_CAUSE_LENGTH} characters.`
    )
  if (
    data.displayName &&
    typeof data.displayName === 'string' &&
    data.displayName.length > MAX_INCIDENT_DISPLAY_NAME_LENGTH
  )
    throw new InvalidIncidentFieldError(
      `Incident display name must be less than ${MAX_INCIDENT_DISPLAY_NAME_LENGTH} characters.`
    )

  const payload: Partial<IIncident> = { ...data }
  return payload
}
