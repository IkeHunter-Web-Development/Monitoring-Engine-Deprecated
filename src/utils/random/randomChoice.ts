import { randomInt } from 'crypto'

export const getRandomChoice = <T>(choices: Array<T>): T => choices[randomInt(0, choices.length)]

export const getRandomMonitorStatus = (): MonitorStatus => {
  const statusChoices: MonitorStatus[] = ['alert', 'emergency', 'pending', 'stable']

  return getRandomChoice(statusChoices)
}

export const getRandomWebAvailability = (): WebsiteAvailability => {
  const availabilityChoices: WebsiteAvailability[] = [
    'degraded',
    'maintenance',
    'offline',
    'online',
    'pending'
  ]

  return getRandomChoice(availabilityChoices)
}
export const getRandomIncidentImpact = (): IncidentImpact => {
  const impactChoices: IncidentImpact[] = ['none', 'maintenance', 'minor', 'major', 'critical']

  return getRandomChoice(impactChoices)
}

export const getRandomIncidentStatus = (): IncidentStatus => {
  const statusChoices: IncidentStatus[] = [
    'active',
    'resolved',
    'pending',
    'investigating',
    'identified',
    'inProgress',
    'completed'
  ]

  return getRandomChoice(statusChoices)
}
