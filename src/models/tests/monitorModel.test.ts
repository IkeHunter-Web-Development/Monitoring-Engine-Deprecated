/**
 * @fileoverview Tests for the monitor model.
 */

import { WebsiteMonitor } from '../monitorModel'

describe('Monitor model CRUD data', () => {
  const monitorData: Partial<WebsiteMonitor> = {
    projectId: '123',
    url: 'https://example.com',
    title: 'Example'
  }

  it('should create a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorData)
    expect(monitor).toBeDefined()
  })

  it('should update a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorData)
    const newTitle = 'Updated'

    await WebsiteMonitor.updateOne({ _id: monitor._id }, { title: newTitle })

    const updatedMonitor = await WebsiteMonitor.findOne({ _id: monitor._id })
    expect(updatedMonitor).toBeDefined()
    expect(updatedMonitor!.title).toEqual(newTitle)
  })

  it('should get a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorData)
    const foundMonitor = await WebsiteMonitor.findOne({ _id: monitor._id })

    expect(foundMonitor).toBeDefined()
  })

  it('should delete a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorData)

    await WebsiteMonitor.deleteOne({ _id: monitor._id })
    const foundMonitor = await WebsiteMonitor.findOne({ _id: monitor._id })

    expect(foundMonitor).toBeNull()
  })
})
