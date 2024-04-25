import { Types } from 'mongoose'
import { InvalidMonitorFieldError } from 'src/utils/exceptions'
import { validateFullMonitor } from '../validateMonitor'

const VALID_MONITOR: IWebsiteMonitor = {
  url: 'https://example.com',
  projectId: '50',
  name: 'Example Monitor',
  interval: 3,
  icon: 'https://example-cdn.com/assets/icon.png',
  active: true,
  reminderIntervals: 10,
  subscribers: [
    {
      displayName: 'John Doe',
      email: 'john@example.com',
      phone: '888-555-1234',
      method: 'email',
      userId: '80'
    }
  ],
  checkType: 'http',
  retries: 3,
  timeout: 200
}

describe('Monitor valid fields tests', () => {
  it('should accept correct min monitor fields', () => {
    const monitor: IWebsiteMonitor = {
      url: VALID_MONITOR.url,
      projectId: VALID_MONITOR.projectId,
      name: VALID_MONITOR.name
    }

    const isValid = validateFullMonitor(monitor)
    expect(isValid).toBeTruthy()
  })
  it('should accept correct max monitor fields', () => {
    const monitor: IWebsiteMonitor = { ...VALID_MONITOR }

    const isValid = validateFullMonitor(monitor)
    expect(isValid).toBeTruthy()
  })
})

describe('Monitor invalid fields tests', () => {
  let monitor: IWebsiteMonitor

  beforeEach(() => {
    monitor = { ...VALID_MONITOR }
  })

  it('should reject invalid url', () => {
    monitor.url = 'Not a url'

    expect(() => validateFullMonitor(monitor)).toThrow(InvalidMonitorFieldError)
  })

  it('should reject invalid name', () => {
    monitor.name = 'm8il6T9eKcRyb82WYTbJKbx6tJqYHVT9rBnRJnNsVJo5M6929j9nUXkXXHGJf' // 61 chars

    expect(() => validateFullMonitor(monitor)).toThrow(InvalidMonitorFieldError)
  })

  it('should reject invalid interval', () => {
    monitor.interval = '5s' as any

    expect(() => validateFullMonitor(monitor)).toThrow(InvalidMonitorFieldError)
  })

  it('should reject invalid icon url', () => {
    monitor.icon = 'Not a url'

    expect(() => validateFullMonitor(monitor)).toThrow(InvalidMonitorFieldError)
  })
})
