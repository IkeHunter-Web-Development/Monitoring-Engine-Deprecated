import { generateMockData } from './create-mock-data'

export const processCliArgs = (argv: string[]) => {
  argv.forEach((arg) => {
    if (arg === 'mock') {
      console.log('Mocking data...')
      generateMockData()
    }
  })
}
