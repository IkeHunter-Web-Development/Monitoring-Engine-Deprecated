import { WebsiteMonitor } from 'src/models'
import { createMonitor, deleteMonitor, getMonitor, updateMonitor } from '../monitorResources'

const monitorPayload: IWebsiteMonitor = {
  url: '',
  checkType: 'http',
  retries: 0,
  timeout: 0,
  projectId: '',
  title: '',
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

    const monitor = await createMonitor(monitorPayload)
    expect(monitor.title).toEqual(monitorPayload.title)
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

    const monitor = await getMonitor(id)

    expect(monitor._id).toEqual(id)
    expect(monitor.title).toEqual(monitorPayload.title)
  })
  it('should update monitor', async () => {
    const dbMonitor = await WebsiteMonitor.find({})
    const id = dbMonitor[0]?._id

    const updatePaylod = {
      title: 'Updated title'
    }

    const updatedMonitor = await updateMonitor(id, updatePaylod)

    expect(updatedMonitor.title).toEqual(updatePaylod.title)
    expect(updatedMonitor.url).toEqual(monitorPayload.url)
  })
  it('should delete monitor', async () => {
    const dbMonitor = await WebsiteMonitor.find({})
    const id = dbMonitor[0]?._id

    const deletedMonitor = await deleteMonitor(id)
    expect(deletedMonitor._id).toEqual(id)

    const dbMonitors = await WebsiteMonitor.find({})
    expect(dbMonitors.length).toEqual(0)
  })
})
