/**
 * @fileoverview Tests for event api views.
 */

import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { Event } from 'src/models'
import { getResJson } from 'src/utils'
import * as view from '../eventViews'
import { Types } from 'mongoose'

const p1Id = new Types.ObjectId().toString()
const p2Id = new Types.ObjectId().toString()
const m1Id = new Types.ObjectId().toString()
const m2Id = new Types.ObjectId().toString()

const defaultEvents: IEvent[] = [
  {
    projectId: p1Id,
    message: 'Example message 1',
    monitorId: m1Id,
    timestamp: Date.now()
  },
  {
    projectId: p1Id,
    message: 'Example message 2',
    monitorId: m2Id,
    timestamp: Date.now()
  },
  {
    projectId: p2Id,
    message: 'Example message 3',
    monitorId: m1Id,
    timestamp: Date.now()
  },
  {
    projectId: p2Id,
    message: 'Example message 4',
    monitorId: m2Id,
    timestamp: Date.now()
  }
]

describe('Events View', () => {
  let req: Request
  let res: Response
  let next: jest.Mock<any, any, any>
  const events: Event[] = []

  beforeEach(async () => {
    res = httpMocks.createResponse()
    next = jest.fn()

    for (const event of defaultEvents) {
      events.push(await Event.create(event))
    }
  })

  it('should get events by monitorId', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      query: { monitorId: m1Id }
    })

    await view.queryEventsView(req, res, next)
    const data = getResJson(res)
    expect(data.length).toEqual(2)

    data.forEach((event: IEvent) => {
      expect(event.monitorId).toEqual(m1Id)
    })
  })
  it('should get events by projectId', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      query: { projectId: p1Id }
    })

    await view.queryEventsView(req, res, next)
    const data = getResJson(res)
    expect(data.length).toEqual(2)

    data.forEach((event: IEvent) => {
      expect(event.projectId).toEqual(p1Id)
    })
  })
  it('should get events by monitorId and projectId', async () => {
    req = httpMocks.createRequest({
      method: 'GET',
      query: { projectId: p1Id, monitorId: m1Id }
    })

    await view.queryEventsView(req, res, next)
    const data = getResJson(res)
    expect(data.length).toEqual(1)

    data.forEach((event: IEvent) => {
      expect(event.projectId).toEqual(p1Id)
      expect(event.monitorId).toEqual(m1Id)
    })
  })
})
