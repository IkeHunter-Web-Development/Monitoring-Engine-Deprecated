/**
 * @fileoverview Tests for the monitor model.
 */

import type { IMonitor } from '../monitorModel'
import { Monitor } from '../monitorModel'

describe('Monitor model CRUD data', () => {
  const monitorData: IMonitor = {
    projectId: '123',
    url: 'https://example.com',
    title: 'Example'
  }

  it('should create a monitor', async () => {
    const monitor = await Monitor.create(monitorData)
    expect(monitor).toBeDefined()
  })

  it('should update a monitor', async () => {
    const monitor = await Monitor.create(monitorData)
    const newTitle = 'Updated'

    await Monitor.updateOne({ _id: monitor._id }, { title: newTitle })

    const updatedMonitor = await Monitor.findOne({ _id: monitor._id })
    expect(updatedMonitor).toBeDefined()
    expect(updatedMonitor!.title).toEqual(newTitle)
  })

  it('should get a monitor', async () => {
    const monitor = await Monitor.create(monitorData)
    const foundMonitor = await Monitor.findOne({ _id: monitor._id })

    expect(foundMonitor).toBeDefined()
  })

  it('should delete a monitor', async () => {
    const monitor = await Monitor.create(monitorData)
    
    await Monitor.deleteOne({ _id: monitor._id })
    const foundMonitor = await Monitor.findOne({ _id: monitor._id })

    expect(foundMonitor).toBeNull()
  })
})
