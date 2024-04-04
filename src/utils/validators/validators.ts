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
