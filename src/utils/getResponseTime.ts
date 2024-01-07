import axios from 'axios'

export const getResponseTime = async (url: string): Promise<number> => {
  const startTime = Date.now()
  let duration: number = 0
  await axios.get(url).then(() => {
    const endTime = Date.now()
    duration = endTime - startTime
  }).catch((error) => {
    console.log('error recording response time:', error)

    throw error
  })

  return duration
}
