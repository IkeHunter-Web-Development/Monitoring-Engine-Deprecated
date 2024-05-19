import { randomInt, randomUUID } from 'crypto'
import { writeFile } from 'fs'
import { Types } from 'mongoose'
import {
  SEED_DATA,
  getRandomChoice,
  getRandomIncidentImpact,
  getRandomIncidentStatus,
  getRandomMonitorStatus,
  getRandomWebAvailability
} from 'src/utils'
import { getNDaysAgo, getNHoursAgo } from 'src/utils/mock/dates'
import { getRandomWeightedChoice } from 'src/utils/random/randomWeightedChoice'

const PROJECTS_COUNT = 5
const MONITORS_COUNT = 40
const MAX_SUBS = 15
const MAX_EVENTS = 5
const MAX_INCIDENTS = 8
const MAX_RESPONSES = 24
const MAX_PROJECT_EVENTS = 10

export const generateMockData = async () => {
  const projectIds: number[] = Array.from(Array(PROJECTS_COUNT)).map((_, i) => i)
  const monitors: IWebsiteMonitorMeta[] = []
  const allEvents: IEventMeta[] = []
  const data = SEED_DATA

  for (let i = 0; i < MONITORS_COUNT; i++) {
    const randomIndex = randomInt(0, data.length)
    const seedData = data[randomIndex]
    data.splice(randomIndex, 1)
    const randomProject = projectIds[randomInt(0, projectIds.length - 1)]
    const daysAgoCreated = randomInt(6, 60)

    // const monitor = await createTestMonitor({
    //   projectId: randomProject.toString(),
    //   name: seedData.app_name
    // })
    const monitor: IWebsiteMonitorMeta = {
      availability: getRandomWebAvailability(),
      responseTime: randomInt(0, 1500),
      subscribers: [],
      id: new Types.ObjectId().toString(),
      uuid: randomUUID(),
      status: getRandomMonitorStatus(),
      lastCheck: getNHoursAgo(randomInt(0, 24)).getTime(),
      createdAt: getNDaysAgo(daysAgoCreated).getTime(),
      updatedAt: getNDaysAgo(randomInt(0, 5)).getTime(),
      events: [],
      responses: [],
      incidents: [],
      projectId: randomProject.toString(),
      name: seedData.app_name,
      url: seedData.url,
      active: true
    }
    monitors.push(monitor)

    for (let i = 0; i < MAX_SUBS; i++) {
      if (getRandomWeightedChoice({ break: 1, continue: 3 }) === 'break') break

      const subRandomData = data[randomInt(0, data.length)]
      const subPayload: ISubscriberMeta = {
        id: new Types.ObjectId().toString(),
        displayName: `${subRandomData.first_name} ${subRandomData.last_name}`,
        email: subRandomData.email,
        method: 'email',
        monitorId: monitor.id
      }
      monitor.subscribers.push(subPayload)
    }

    for (let i = 0; i < MAX_INCIDENTS; i++) {
      if (getRandomWeightedChoice({ break: 1, continue: 3 }) === 'break') break

      const incidentCreatedAt = getNDaysAgo(randomInt(0, daysAgoCreated))
      const incident: IIncidentMeta = {
        id: new Types.ObjectId().toString(),
        createdAt: incidentCreatedAt.getTime(),
        monitorId: monitor.id,
        impact: getRandomIncidentImpact(),
        status: getRandomIncidentStatus(),
        cause: 'Example cause.',
        displayName: `${monitor.name} Incident ${incidentCreatedAt.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric'
        })}`
      }

      monitor.incidents.push(incident)
    }

    for (let i = 0; i < MAX_EVENTS; i++) {
      if (getRandomWeightedChoice({ break: 1, continue: 4 }) === 'break') break

      const message = seedData.message.slice(0, randomInt(4, seedData.message.length))
      const event: IEventMeta = {
        id: new Types.ObjectId().toString(),
        createdAt: getNDaysAgo(randomInt(0, daysAgoCreated)).getTime(),
        projectId: randomProject.toString(),
        monitorId: monitor.id,
        message: message
      }

      monitor.events.push(event)
      allEvents.push(event)
    }

    for (let i = 0; i < MAX_RESPONSES; i++) {
      if (getRandomWeightedChoice({ break: 1, continue: 15 }) === 'break') break

      const response: IResponseMeta = {
        id: new Types.ObjectId().toString(),
        createdAt: Date.now() - i * 1000 * 60 * 60,
        timestamp: Date.now() - i * 1000 * 60 * 60,
        monitorId: monitor.id,
        responseTime: randomInt(100, 1500)
      }

      monitor.responses.push(response)
    }
  }

  const outMonitors = JSON.stringify(monitors)
  console.log('Output:', outMonitors)
  writeFile(
    '/app/generated-data/generated-mock-monitors.json',
    outMonitors,
    { flag: 'w+' },
    (error) => {
      if (error) console.log('Error writing monitors:', error)
      console.log('File writing for monitors complete')
    }
  )

  for (let i = 0; i < MAX_PROJECT_EVENTS; i++) {
    const createdAt = getNDaysAgo(randomInt(0, 15))
    const event: IEventMeta = {
      id: new Types.ObjectId().toString(),
      createdAt: createdAt.getTime(),
      projectId: getRandomChoice(projectIds).toString(),
      message: `Project event ${createdAt.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })}`
    }

    allEvents.push(event)
  }

  const outEvents = JSON.stringify(allEvents)
  writeFile(
    '/app/generated-data/generated-mock-events.json',
    outEvents,
    { flag: 'w+' },
    (error) => {
      if (error) console.log('Error writing events:', error)
      console.log('File writing for events complete')
    }
  )
}
