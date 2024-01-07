/**
 * @fileoverview Tests for monitor api routes.
 */
import httpMocks from 'node-mocks-http'
import type { Request, Response } from 'express'
import { getResJson } from 'src/utils'
import { Monitor } from 'src/models'
import { MonitorController } from '../monitorController'

const controller = MonitorController

const defaultMonitor = {
  projectId: '123abc',
  url: 'https://www.google.com',
  users: [],
  title: 'Google'
}

describe('Monitor controller', () => {
  let req: Request
  let res: Response

  beforeEach(async () => {
    res = httpMocks.createResponse()
  })
  /**==========
   * CRUD TESTS
   ============*/

  /**
   * POST /monitors/:id should create a monitor
   * and return a 201 status code.
   */
  it('should create a monitor', async () => {
    // const pre = await MonitorService.getMonitors()
    const pre = await Monitor.find({})
    expect(pre.length).toEqual(0) // Ensure there are no monitors before the test.

    req = httpMocks.createRequest({
      method: 'POST',
      body: defaultMonitor
    })

    await controller.createMonitor(req, res)
    expect(res.statusCode).toEqual(201)

    // const monitors = await MonitorService.getMonitors()
    const monitors = await Monitor.find({})
    expect(monitors.length).toEqual(1)
    expect(monitors[0].projectId).toEqual(defaultMonitor.projectId)
  })

  /**
   * PUT /monitors/:id should update a monitor
   * and return a 200 status code.
   */
  it('should update a monitor', async () => {
    const monitor = await Monitor.create(defaultMonitor)

    req = httpMocks.createRequest({
      method: 'PUT',
      body: { title: 'Yahoo' },
      params: { id: monitor._id.toString() }
    })

    await controller.updateMonitor(req, res as Response)
    expect(res.statusCode).toEqual(200)

    const query = await Monitor.findOne({ _id: monitor._id })
    expect(query).not.toBeNull()
    expect(query!.title).toEqual('Yahoo')
  })

  /**
   * GET /monitors/:id should return a monitor
   * and return a 200 status code.
   */
  it('should get a monitor', async () => {
    const monitor = await Monitor.create(defaultMonitor)

    req = httpMocks.createRequest({
      params: { id: monitor._id.toString() }
    })
    await controller.getMonitor(req, res)
    expect(res.statusCode).toEqual(200)

    // const body = (res as any)._getJSONData();
    const body = getResJson(res)
    expect(body._id).toEqual(monitor._id.toString())
  })

  /**
   * DELETE /monitors/:id should delete a monitor
   * and return a 200 status code.
   */
  it('should delete a monitor', async () => {
    const monitor = await Monitor.create(defaultMonitor)

    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: monitor._id.toString() }
    })
    await controller.deleteMonitor(req, res)

    expect(res.statusCode).toEqual(200)

    const query = await Monitor.findOne({ _id: monitor._id })
    expect(query).toBeNull()
  })

  /**
   * GET /monitors should return all monitors
   * and return a 200 status code.
   */
  it('should get all monitors', async () => {
    const monitor = await Monitor.create({
      ...defaultMonitor,
      projectId: '123'
    })
    const monitor2 = await Monitor.create({
      ...defaultMonitor,
      projectId: '456'
    })
    const monitor3 = await Monitor.create({
      ...defaultMonitor,
      projectId: '789'
    })

    const req = httpMocks.createRequest({
      method: 'GET'
    })
    await controller.getMonitors(req, res)
    const body = getResJson(res)

    expect(res.statusCode).toEqual(200)
    expect(body.length).toEqual(3)

    const sorted: Monitor[] = body.sort((a: any, b: any) => {
      return a.projectId - b.projectId
    })

    expect(sorted[0].projectId).toEqual(monitor.projectId)
    expect(sorted[1].projectId).toEqual(monitor2.projectId)
    expect(sorted[2].projectId).toEqual(monitor3.projectId)
  })
})
