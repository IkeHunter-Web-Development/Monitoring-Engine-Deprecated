import { InvalidMonitorFieldError } from '../exceptions'

const isValidUrl = (url: string) => {
  const re = /https:\/\/.*\.[a-z]{2,4}\/?/i

  return re.test(url)
}

const isStringSize = (target: string, size: number) => {
  return target.length <= size
}

const isNumber = (target: any) => {
  return !isNaN(target)
}

export const validateFullMonitor = (monitor: IWebsiteMonitor) => {
  if (!monitor.projectId || !monitor.title || !monitor.url)
    throw new InvalidMonitorFieldError('Missing required field')

  return validateMonitorInput(monitor)
}
export const validateMonitorInput = (monitor: Partial<IWebsiteMonitor>) => {
  if (monitor.url && !isValidUrl(monitor.url))
    throw new InvalidMonitorFieldError('URL field must be a valid url.')
  if (monitor.title && !isStringSize(monitor.title, 60))
    throw new InvalidMonitorFieldError('Title must be shorter than 60 characters.')
  if (monitor.interval && !isNumber(monitor.interval))
    throw new InvalidMonitorFieldError('Interval must be a number.')
  if (monitor.icon && !isValidUrl(monitor.icon))
    throw new InvalidMonitorFieldError('Icon field must be a valid url')

  return true
}
