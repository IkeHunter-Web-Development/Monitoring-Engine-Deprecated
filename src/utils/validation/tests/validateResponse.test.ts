import { Types } from 'mongoose'
import { InvalidResponseFieldError } from 'src/utils/exceptions'
import { validateResponse } from '../validateResponse'

const VALID_RESPONSE: IResponse = {
  monitorId: new Types.ObjectId().toString(),
  responseTime: 500,
  timestamp: Date.now()
}

describe('Response validator tests', () => {
  let response: any

  beforeEach(() => {
    response = { ...VALID_RESPONSE }
  })

  it('should accept valid response fields', () => {
    const isValid = validateResponse(response)

    expect(isValid).toBeTruthy()
  })
  it('should reject too few fields', () => {
    let invalidResponse = {}
    expect(() => validateResponse(invalidResponse)).toThrow(InvalidResponseFieldError)

    invalidResponse = { monitorId: VALID_RESPONSE.monitorId }
    expect(() => validateResponse(invalidResponse)).toThrow(InvalidResponseFieldError)

    invalidResponse = { responseTime: VALID_RESPONSE.responseTime }
    expect(() => validateResponse(invalidResponse)).toThrow(InvalidResponseFieldError)
  })
  it('should reject invalid monitorid', () => {
    response.monitorId = 'invalid'

    expect(() => validateResponse(response)).toThrow(InvalidResponseFieldError)
  })
  it('should reject invalid responseTime string', () => {
    response.responseTime = 'notint50'

    expect(() => validateResponse(response)).toThrow(InvalidResponseFieldError)
  })
  it('should reject invalid responseTime too low', () => {
    response.responseTime = 0

    expect(() => validateResponse(response)).toThrow(InvalidResponseFieldError)
  })
  it('should reject invalid responseTime negative', () => {
    response.responseTime = -50

    expect(() => validateResponse(response)).toThrow(InvalidResponseFieldError)
  })
  it('should reject invalid responseTime too high', () => {
    response.responseTime = 60 * 100 * 2

    expect(() => validateResponse(response)).toThrow(InvalidResponseFieldError)
  })
})
