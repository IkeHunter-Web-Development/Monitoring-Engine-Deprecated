import { InvalidMonitorFieldError } from '../exceptions'
import { isNumeric, isStringSize, isValidUrl } from './validators'

export const validateFullMonitor = (monitor: any): IWebsiteMonitor => {
  if (!monitor.projectId || !monitor.title || !monitor.url)
    throw new InvalidMonitorFieldError('Missing required field')

  return validateMonitorInput(monitor) as IWebsiteMonitor
}
export const validateMonitorInput = (monitor: any): Partial<IWebsiteMonitor> => {
  if (monitor.url && !isValidUrl(monitor.url))
    throw new InvalidMonitorFieldError('URL field must be a valid url.')
  if (monitor.title && !isStringSize(monitor.title, 60))
    throw new InvalidMonitorFieldError('Title must be shorter than 60 characters.')
  if (monitor.interval && !isNumeric(monitor.interval))
    throw new InvalidMonitorFieldError('Interval must be a number.')
  if (monitor.icon && !isValidUrl(monitor.icon))
    throw new InvalidMonitorFieldError('Icon field must be a valid url')

  const payload: Partial<IWebsiteMonitor> = { ...monitor }
  return payload
}
