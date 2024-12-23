export const isValidUrl = (url: string) => {
  const re = /https:\/\/.*\.[a-z]{2,4}\/?/i

  return re.test(url)
}

export const isStringSize = (target: string, size: number) => {
  return target.length <= size
}

export const isNumeric = (target: any) => {
  return !isNaN(target)
}

export const DATE_MAX_FUTURE_MS = 1 * 24 * 60 * 60 * 1000

export const isValidDate = (data: any): boolean => {
  // FIXME: Year checking could give edge cases
  const futureOffset = Date.now() + DATE_MAX_FUTURE_MS
  const date = new Date(data)

  return !isNaN(date.getTime()) && date.getTime() < futureOffset
  // const date = new Date(data)
  // return (
  //   !isNaN(date.getTime()) &&
  //   date.getFullYear() > 2020 &&
  //   date.getFullYear() <= new Date().getFullYear() + 1
  // )
}

export const isDateInRange = (date: any, min: Date, max: Date): boolean => {
  if (!isValidDate(date)) return false
  date = new Date(date)

  return date > min && date < max
}
