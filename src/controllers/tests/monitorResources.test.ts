import { WebsiteMonitor } from 'src/models'
import {
  webMonitorCreate,
  webMonitorDelete,
  webMonitorGetOne,
  webMonitorUpdate
} from '../monitorResources'

const monitorPayload: IWebsiteMonitor = {
  url: 'https://example.com',
  checkType: 'http',
  retries: 0,
  timeout: 0,
  projectId: 'asdlkfjasdlifu23l423908',
  name: 'Some Monitor',
  interval: 0,
  icon: '',
  active: false,
  reminderIntervals: 0,
  subscribers: []
}

describe('Monitor controller creation tests', () => {
  it('should create monitor', async () => {
    const initialMonitors = await WebsiteMonitor.find({})
    expect(initialMonitors.length).toEqual(0)

    const monitor = await webMonitorCreate(monitorPayload)
    expect(monitor.name).toEqual(monitorPayload.name)
  })
})

describe('Monitor controller tests', () => {
  beforeEach(async () => {
    await WebsiteMonitor.create(monitorPayload)
    const dbMonitors = await WebsiteMonitor.find({})
    expect(dbMonitors.length).toEqual(1)
  })

  it('should get a single monitor', async () => {
    const dbMonitor = await WebsiteMonitor.find({})
    const id = dbMonitor[0]?._id

    const monitor = await webMonitorGetOne(id)

    expect(monitor._id).toEqual(id)
    expect(monitor.name).toEqual(monitorPayload.name)
  })
  it('should update monitor', async () => {
    const dbMonitor = await WebsiteMonitor.find({})
    const id = dbMonitor[0]?._id

    const updatePaylod = {
      name: 'Updated name'
    }

    const updatedMonitor = await webMonitorUpdate(id, updatePaylod)

    expect(updatedMonitor.name).toEqual(updatePaylod.name)
    expect(updatedMonitor.url).toEqual(monitorPayload.url)
  })
  it('should delete monitor', async () => {
    const dbMonitor = await WebsiteMonitor.find({})
    const id = dbMonitor[0]?._id

    const deletedMonitor = await webMonitorDelete(id)
    expect(deletedMonitor._id).toEqual(id)

    const dbMonitors = await WebsiteMonitor.find({})
    expect(dbMonitors.length).toEqual(0)
  })
})
