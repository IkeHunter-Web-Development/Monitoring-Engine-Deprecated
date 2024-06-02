import { Types } from 'mongoose'
import { InvalidMonitorEventFieldError } from 'src/utils/exceptions'
import { validateFullEvent } from '../validateEvent'
import { DATE_MAX_FUTURE_MS } from '../validators'

const VALID_EVENT: IEvent = {
  projectId: '15',
  message: 'Lorem ipsum dolor sit amet.',
  monitorId: new Types.ObjectId().toString(),
  timestamp: Date.now()
}

describe('Event validator tests', () => {
  it('should accept min fields', () => {
    const event = { projectId: VALID_EVENT.projectId, message: VALID_EVENT.message }
    const isValid = validateFullEvent(event)

    expect(isValid).toBeTruthy()
  })
  it('should accept correct fields', () => {
    const event = { ...VALID_EVENT }
    const isValid = validateFullEvent(event)

    expect(isValid).toBeTruthy()
  })
})

describe('Event invalid fields tests', () => {
  let event: any

  beforeEach(() => {
    event = { ...VALID_EVENT }
  })

  it('should reject invalid message, too long', () => {
    event.message = 'lorem'.repeat(255 / 5) + 'a' // 256 characters

    expect(() => validateFullEvent(event)).toThrow(InvalidMonitorEventFieldError)
  })
  it('should reject invalid monitorId', () => {
    event.monitorId = 'invalid'

    expect(() => validateFullEvent(event)).toThrow(InvalidMonitorEventFieldError)
  })
  it('should reject invalid timestamp, not a date', () => {
    event.timestamp = 'not a date'

    expect(() => validateFullEvent(event)).toThrow(InvalidMonitorEventFieldError)
  })
  it('should reject invalid timestamp, too far in past', () => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1) // -1 year

    event.timestamp = d.getTime()

    expect(() => validateFullEvent(event)).toThrow(InvalidMonitorEventFieldError)
  })
  it('should reject invalid timestamp, in future', () => {
    const d = new Date(Date.now() + DATE_MAX_FUTURE_MS + 1000 * 60 * 60) // 1 hour over

    event.timestamp = d.getTime()

    expect(() => validateFullEvent(event)).toThrow(InvalidMonitorEventFieldError)
  })
})
