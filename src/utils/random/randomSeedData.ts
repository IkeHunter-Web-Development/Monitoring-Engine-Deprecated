import { randomInt } from 'crypto'
import { SEED_DATA } from '../mock'

export const getRandomSeedData = () => {
  const randomIndex = randomInt(0, SEED_DATA.length)
  const randomData = SEED_DATA[randomIndex]

  return randomData
}
