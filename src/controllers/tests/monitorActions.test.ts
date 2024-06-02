import { Event, WebsiteMonitor, WebsiteResponse } from 'src/models'
import { eventExample, monitorExample, responseExample } from 'src/utils'
import { registerWebMonitorEvent, registerWebMonitorResponse } from '../monitorActions'

describe('Monitor action controller tests', () => {
  it('should register website response', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)
    const response: IResponse = {
      ...responseExample,
      monitorId: monitor._id.toString()
    }

    await registerWebMonitorResponse(response)

    const dbquery = await WebsiteResponse.find({ monitorId: monitor._id })
    expect(dbquery.length).toEqual(1)
    expect(dbquery[0].responseTime).toEqual(responseExample.responseTime)
  })

  it('should register monitor event', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)

    await registerWebMonitorEvent(monitor, eventExample.message)

    const events = await Event.find({ monitorId: monitor._id })
    expect(events.length).toEqual(1)
    expect(events[0].projectId).toEqual(monitor.projectId)
    expect(events[0].message).toEqual(eventExample.message)
  })
})
