import { Types } from 'mongoose'
import { InvalidIncidentFieldError } from 'src/utils/exceptions'
import { validateFullIncident } from '../validateIncident'

const VALID_INCIDENT: IIncident = {
  monitorId: new Types.ObjectId().toString(),
  impact: 'maintenance',
  status: 'pending',
  cause: 'Request timed out.',
  displayName: 'Request timeout incident.',
  notes: 'Some example notes, lorem ipsum dolor sit amet.'
}

describe('Incident validator tests', () => {
  let incident: any

  beforeEach(() => {
    incident = { ...VALID_INCIDENT }
  })

  it('should accept valid incident fields', () => {
    const isValid = validateFullIncident(VALID_INCIDENT)

    expect(isValid).toBeTruthy()
  })
  it('should reject too few fields', () => {
    let invalidIncident = {}
    expect(() => validateFullIncident(invalidIncident)).toThrow(InvalidIncidentFieldError)

    invalidIncident = { monitorId: VALID_INCIDENT.monitorId }
    expect(() => validateFullIncident(invalidIncident)).toThrow(InvalidIncidentFieldError)

    invalidIncident = { ...invalidIncident, impact: VALID_INCIDENT.monitorId }
    expect(() => validateFullIncident(invalidIncident)).toThrow(InvalidIncidentFieldError)

    invalidIncident = { ...invalidIncident, status: VALID_INCIDENT.status }
    expect(() => validateFullIncident(invalidIncident)).toThrow(InvalidIncidentFieldError)

    invalidIncident = { ...invalidIncident, cause: VALID_INCIDENT.cause }
    expect(() => validateFullIncident(invalidIncident)).toThrow(InvalidIncidentFieldError)
  })
  it('should reject invalid monitorId', () => {
    incident.monitorId = 'invalid'
    expect(() => validateFullIncident(incident)).toThrow(InvalidIncidentFieldError)
  })
  it('should reject invalid impact', () => {
    incident.impact = 'invalid-asdfasdf'
    expect(() => validateFullIncident(incident)).toThrow(InvalidIncidentFieldError)
  })
  it('should reject invalid status', () => {
    incident.status = 'invalid-asdfasdf'
    expect(() => validateFullIncident(incident)).toThrow(InvalidIncidentFieldError)
  })
  it('should reject invalid cause, too long', () => {
    incident.cause =
      'ia6uDgF8k4cJeFdLTm0tHZNeK6mn8wy0v0SoHOhqpxMOoMBXDazof95fAAtSY1PISIHT9DEP1C7v8Ke0ZDDgc3e1w2IFDO3Sl2m35qOxA1FKL8uQy5icA6r0rqmKNvqaa' // 129 characters
    expect(() => validateFullIncident(incident)).toThrow(InvalidIncidentFieldError)
  })
  it('should reject invalid display name, too long', () => {
    incident.displayName = 'm8il6T9eKcRyb82WYTbJKbx6tJqYHVT9rBnRJnNsVJo5M6929j9nUXkXXHGJf' // 61 chars
    expect(() => validateFullIncident(incident)).toThrow(InvalidIncidentFieldError)
  })
})
