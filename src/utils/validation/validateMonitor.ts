import { InvalidMonitorFieldError } from '../exceptions'
import { isWebsiteAvailability } from './validateTypes'
import { isNumeric, isStringSize, isValidUrl } from './validators'

export const validateMonitorMeta = (monitor: any): IWebsiteMonitorMeta => {
  if (monitor.availability && !isWebsiteAvailability(monitor.availability))
    throw new InvalidMonitorFieldError(`Invalid website availability ${monitor.availability}.`)

  if (monitor.responseTime && !isNumeric(monitor.responseTime))
    throw new InvalidMonitorFieldError(`Response time needs to be a number.`)

  if (monitor.subscribers) {
    if (!Array.isArray(monitor.subscribers))
      throw new InvalidMonitorFieldError(`Monitor subscribers need to be an array.`)
  }

  return monitor as IWebsiteMonitorMeta
}

export const validateFullMonitor = (monitor: any): IWebsiteMonitor => {
  const requiredKeys = ['projectId', 'name', 'url']
  for (const key of requiredKeys) {
    if (!Object.keys(monitor).includes(key) || !monitor[key])
      throw new InvalidMonitorFieldError(`Missing required field ${key}`)
  }

  // if (!monitor.projectId || !monitor.name || !monitor.url)
  //   throw new InvalidMonitorFieldError('Missing required field')

  return validateMonitorInput(monitor) as IWebsiteMonitor
}
export const validateMonitorInput = (monitor: any): Partial<IWebsiteMonitor> => {
  if (monitor.url && !isValidUrl(monitor.url))
    throw new InvalidMonitorFieldError('URL field must be a valid url.')
  if (monitor.name && !isStringSize(monitor.name, 60))
    throw new InvalidMonitorFieldError('name must be shorter than 60 characters.')
  if (monitor.interval && !isNumeric(monitor.interval))
    throw new InvalidMonitorFieldError('Interval must be a number.')
  if (monitor.icon && !isValidUrl(monitor.icon))
    throw new InvalidMonitorFieldError('Icon field must be a valid url')

  const payload: Partial<IWebsiteMonitor> = { ...monitor }
  return payload
}
