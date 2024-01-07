/**
 * @fileoverview Tests for monitor api routes.
 */
import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { getResJson } from '../../utils/testing/testingUtils'
import { Monitor } from '../../models/monitorModel'
// import { MonitorService } from 'src/services'
import { MonitorController } from '../monitorController'
// import { MonitorController } from '../monitorController'

const controller = MonitorController

const defaultMonitor = {
  projectId: '123abc',
  url: 'https://www.google.com',
  users: [],
  title: 'Google'
}
// const u1 = {
//   userId: '123',
//   email: 'u1@example.com'
// }
// const u2 = {
//   userId: '456',
//   email: 'u2@example.com'
// }
// const u3 = {
//   userId: '789',
//   email: 'u3@example.com'
// }
// const u4 = {
//   userId: '012',
//   email: 'u4@example.com'
// }

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

  /**=================
   * MANAGEMENT ROUTES
   ===================*/
  /**
   * GET /monitors/:id/online should return true
   * if the site is online
   */
  // it('should return true if the site is online', async () => {
  //   const monitor = await MonitorService.createMonitor({
  //     ...defaultMonitor,
  //     online: true
  //   })

  //   const req = httpMocks.createRequest({
  //     method: 'GET',
  //     params: monitor._id
  //   })
  //   await controller.getMonitorOnlineStatus(req, res)
  //   const body = (res as any)._getData()

  //   expect(res.statusCode).toEqual(200)
  //   expect(body).toEqual('true')
  // })

  /**
   * GET /monitors/search/?project=id should return monitors
   * that belong to a project.
   */
  // it('should return monitors for project', async () => {
  //   const m1 = await MonitorService.createMonitor({
  //     ...defaultMonitor,
  //     recipients: [u1, u2]
  //   })
  //   await MonitorService.createMonitor({
  //     ...defaultMonitor,
  //     projectId: '456',
  //     recipients: [u3, u4]
  //   })

  //   req = httpMocks.createRequest({
  //     method: 'GET',
  //     query: { projectId: m1.projectId }
  //   })
  //   await controller.searchMonitors(req, res)
  //   const body = getResJson(res)

  //   expect(res.statusCode).toEqual(200)
  //   expect(body.length).toEqual(1)
  //   expect(body[0].projectId).toEqual(m1.projectId)
  // })
  /**
   * GET /monitors/search/?user=id should return monitors
   * that a user is subscribed to.
   */
  //   it('should return monitors that a user is subscribed to', async () => {
  //     await MonitorService.createMonitor({
  //       ...defaultMonitor,
  //       recipients: [u1, u2]
  //     })
  //     const m2: Monitor = await MonitorService.createMonitor({
  //       ...defaultMonitor,
  //       projectId: '456',
  //       recipients: [u3, u4]
  //     })

  //     req = httpMocks.createRequest({
  //       method: 'GET',
  //       query: { userId: m2.recipients[0] }
  //     })
  //     await controller.searchMonitors(req, res)
  //     const body = getResJson(res)

  //     expect(res.statusCode).toEqual(200)
  //     expect(body.length).toEqual(1)
  //     expect(body[0].projectId).toEqual(m2.projectId)
  //   })
})
