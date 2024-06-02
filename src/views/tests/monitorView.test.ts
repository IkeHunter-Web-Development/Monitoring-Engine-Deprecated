/**
 * @fileoverview Tests for monitor api views.
 */
import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { WebsiteMonitor } from 'src/models'
import { getResJson, monitorExample } from 'src/utils'
import * as view from '../monitorViews'

describe('Monitor view', () => {
  let req: Request
  let res: Response
  let next: jest.Mock<any, any, any>

  beforeEach(async () => {
    res = httpMocks.createResponse()
    next = jest.fn()
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
    const pre = await WebsiteMonitor.find({})
    expect(pre.length).toEqual(0) // Ensure there are no monitors before the test.

    req = httpMocks.createRequest({
      method: 'POST',
      body: monitorExample
    })

    await view.createMonitorView(req, res, next)
    expect(res.statusCode).toEqual(201)

    // const monitors = await MonitorService.getMonitors()
    const monitors = await WebsiteMonitor.find({})
    expect(monitors.length).toEqual(1)
    expect(monitors[0].projectId).toEqual(monitorExample.projectId)
  })

  /**
   * PUT /monitors/:id should update a monitor
   * and return a 200 status code.
   */
  it('should update a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)

    req = httpMocks.createRequest({
      method: 'PUT',
      body: { name: 'Yahoo' },
      params: { id: monitor._id.toString() }
    })

    await view.updateMonitorView(req, res, next)
    expect(res.statusCode).toEqual(200)

    const query = await WebsiteMonitor.findOne({ _id: monitor._id })
    expect(query).not.toBeNull()
    expect(query!.name).toEqual('Yahoo')
  })

  /**
   * GET /monitors/:id should return a monitor
   * and return a 200 status code.
   */
  it('should get a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)

    req = httpMocks.createRequest({
      params: { id: monitor._id.toString() }
    })
    await view.getMonitorView(req, res, next)
    expect(res.statusCode).toEqual(200)

    // const body = (res as any)._getJSONData();
    const body = getResJson(res)
    expect(body.id).toEqual(monitor._id.toString())
  })

  /**
   * DELETE /monitors/:id should delete a monitor
   * and return a 200 status code.
   */
  it('should delete a monitor', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)

    const req = httpMocks.createRequest({
      method: 'DELETE',
      params: { id: monitor._id.toString() }
    })
    await view.deleteMonitorView(req, res, next)

    expect(res.statusCode).toEqual(200)

    const query = await WebsiteMonitor.findOne({ _id: monitor._id })
    expect(query).toBeNull()
  })

  /**
   * GET /monitors should return all monitors
   * and return a 200 status code.
   */
  it('should get all monitors', async () => {
    const monitor = await WebsiteMonitor.create({
      ...monitorExample,
      projectId: '123'
    })
    const monitor2 = await WebsiteMonitor.create({
      ...monitorExample,
      projectId: '456'
    })
    const monitor3 = await WebsiteMonitor.create({
      ...monitorExample,
      projectId: '789'
    })

    const req = httpMocks.createRequest({
      method: 'GET'
    })
    await view.getMonitorsView(req, res, next)
    const body = getResJson(res)

    expect(res.statusCode).toEqual(200)
    expect(body.length).toEqual(3)

    const sorted: WebsiteMonitor[] = body.sort((a: any, b: any) => {
      return a.projectId - b.projectId
    })

    expect(sorted[0].projectId).toEqual(monitor.projectId)
    expect(sorted[1].projectId).toEqual(monitor2.projectId)
    expect(sorted[2].projectId).toEqual(monitor3.projectId)
  })
})
