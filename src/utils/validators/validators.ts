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

export const isValidDate = (data: any): boolean => {
  return !isNaN(new Date(data).getTime())
}

export const isDateInRange = (date: any, min: Date, max: Date): boolean => {
  if (!isValidDate(date)) return false
  date = new Date(date)

  return date > min && date < max
}
