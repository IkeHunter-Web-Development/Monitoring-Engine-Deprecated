import { Event } from 'src/models'
import { generateEvents, generateMonitors } from 'src/utils'
import { searchEvents } from '../eventActions'

describe('Event action controller tests', () => {
  it('should search events by monitor id', async () => {
    const monitors = await generateMonitors(3)
    const defaults = {
      monitorIds: monitors.map((monitor) => monitor._id.toString()),
      projectIds: monitors.map((monitor) => monitor.projectId)
    }
    await generateEvents(8, defaults)

    const selectedMonitor = monitors[0]

    const expectedEvents = await Event.find({ monitorId: selectedMonitor._id })
    const actualEvents = await searchEvents({ monitorId: selectedMonitor._id })

    expect(actualEvents.length).toEqual(expectedEvents.length)
  })
  it('should search events by project id', async () => {
    const monitors = await generateMonitors(3)
    const defaults = {
      // monitorIds: monitors.map((monitor) => monitor._id.toString()),
      projectIds: monitors.map((monitor) => monitor.projectId)
    }
    await generateEvents(8, defaults)

    const selectedProject = defaults.projectIds[0]

    const expectedEvents = await Event.find({ projectId: selectedProject })
    const actualEvents = await searchEvents({ projectId: selectedProject })

    expect(actualEvents.length).toEqual(expectedEvents.length)
  })
  it('should search events by monitor id and project id', async () => {
    const monitors = await generateMonitors(3)
    const defaults = {
      monitorIds: monitors.map((monitor) => monitor._id.toString()),
      projectIds: monitors.map((monitor) => monitor.projectId)
    }
    await generateEvents(8, defaults)

    const selectedMonitor = monitors[0]
    const selectedProjectId = monitors[1].projectId

    const expectedMonitorEvents = await Event.find({ monitorId: selectedMonitor._id })
    const expectedProjectEvents = await Event.find({ projectId: selectedProjectId })

    const expectedEventsCount = expectedMonitorEvents.length + expectedProjectEvents.length
    const actualEvents = await searchEvents({
      monitorId: selectedMonitor._id,
      projectId: selectedProjectId
    })

    expect(actualEvents.length).toEqual(expectedEventsCount)
  })
})
