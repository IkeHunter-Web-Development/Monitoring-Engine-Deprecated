import { isValidObjectId } from 'mongoose'
import { InvalidMonitorEventFieldError } from '../exceptions'
import { DATE_MAX_FUTURE_MS, isDateInRange, isValidDate } from './validators'

const MAX_EVENT_MESSAGE_LENGTH = 255
const TIMESTAMP_MIN_YEARS_AGO = 1
const TIMESTAMP_MAX_HOURS_FUTURE = DATE_MAX_FUTURE_MS / (1000 * 60 * 60)

export const validateFullEvent = (data: any): IEvent => {
  if (!data.projectId || !data.message)
    throw new InvalidMonitorEventFieldError('Must include project id and message to event.')

  return validateEventInput(data) as IEvent
}
export const validateEventInput = (data: any): Partial<IEvent> => {
  if (
    data.message &&
    typeof data.message === 'string' &&
    data.message.length > MAX_EVENT_MESSAGE_LENGTH
  )
    throw new InvalidMonitorEventFieldError(
      `Event message must be less than ${MAX_EVENT_MESSAGE_LENGTH} characters.`
    )

  if (data.monitorId && !isValidObjectId(data.monitorId))
    throw new InvalidMonitorEventFieldError('Monitor id must be a valid Object id.')

  if (data.timestamp && !isValidDate(data.timestamp))
    throw new InvalidMonitorEventFieldError(`Timestamp must be a valid date, got ${data.timestamp}`)

  const min = new Date()
  min.setFullYear(min.getFullYear() - TIMESTAMP_MIN_YEARS_AGO)

  const max = new Date()
  max.setHours(max.getHours() + TIMESTAMP_MAX_HOURS_FUTURE)

  if (data.timestamp && !isDateInRange(data.timestamp, min, max))
    throw new InvalidMonitorEventFieldError(
      `Event timestamp must be between ${min.toLocaleString()} and ${max.toLocaleString}`
    )

  const payload: Partial<IEvent> = { ...data }
  return payload
}
