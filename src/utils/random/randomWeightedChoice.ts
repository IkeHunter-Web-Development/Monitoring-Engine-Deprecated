import { randomInt } from 'crypto'

export const getRandomWeightedChoice = (choices: { [option: string]: number }) => {
  const randomArray: string[] = []
  for (const [option, weight] of Object.entries(choices)) {
    randomArray.push(...Array(weight).fill(option))
  }

  return randomArray[randomInt(0, randomArray.length - 1)]
}
