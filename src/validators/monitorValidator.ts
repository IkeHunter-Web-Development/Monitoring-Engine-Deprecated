import { SubscriberSchema, WebsiteMonitor } from 'src/models'

export const validateMonitor = (data: any): Partial<WebsiteMonitor> => {
  const validObject = WebsiteMonitor.schema.obj
  const validFields = Object.keys(validObject)

  const dataKeys = Object.keys(data).filter((key) => validFields.includes(key))

  const validMonitorPartial: Partial<WebsiteMonitor> = dataKeys.reduce(
    (monitor: Partial<WebsiteMonitor>, key: string) => {
      let payload = data[key]

      if (key === 'subscribers') {
        type SubType = Partial<WebsiteMonitor['subscribers']>
        const subscribers = data[key]
        const parsedSubscribers: SubType[] = []

        for (const subscriber of subscribers) {
          const validSubFields = Object.keys(SubscriberSchema.obj)

          const availableKeys = Object.keys(subscriber).filter((key) =>
            validSubFields.includes(key)
          )

          const parsedSubscriber = availableKeys.reduce((sub: SubType, key) => {
            return {
              ...sub,
              [key]: subscriber[key]
            }
          }, {} as SubType)
          if (parsedSubscriber) parsedSubscribers.push(parsedSubscriber)
        }

        payload = parsedSubscribers
      }

      return {
        ...monitor,
        [key]: payload
      }
    },
    {} as Partial<WebsiteMonitor>
  )

  return validMonitorPartial
}
