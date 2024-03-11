/**
 * @fileoverview Tests for incident api views.
 */
import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { Incident } from 'src/models'
import { getResJson, incidentExample } from 'src/utils'
import { generateIncidents } from 'src/utils/examples/generateIncidents'
import * as views from '../incidentViews'

describe('Incident view tests', () => {
  let req: Request
  let res: Response
  let next: jest.Mock<any, any, any>

  beforeEach(async () => {
    res = httpMocks.createResponse()
    next = jest.fn()
  })

  it('should create incident', async () => {
    req = httpMocks.createRequest({
      method: 'POST',
      body: incidentExample
    })

    await views.createIncidentView(req, res, next)
    expect(res.statusCode).toEqual(201)

    const incidents = await Incident.find({})
    expect(incidents.length).toEqual(1)
    expect(incidents[0].monitorId).toEqual(incidentExample.monitorId)
  })
  it('should get incident', async () => {
    const incident = await Incident.create(incidentExample)
    req = httpMocks.createRequest({
      params: { id: incident._id }
    })

    await views.getIncidentView(req, res, next)
    expect(res.statusCode).toEqual(200)

    const body = getResJson(res)
    expect(body.id).toEqual(incident._id.toString())
  })
  it('should get multiple incidents', async () => {
    const incidents = await generateIncidents(5)
    req = httpMocks.createRequest({
      method: 'GET',
      body: incidentExample
    })

    await views.getIncidentsView(req, res, next)
    expect(res.statusCode).toEqual(200)

    const body = getResJson(res)
    expect(body.length).toEqual(incidents.length)
  })
  it('should update incident', async () => {
    const incident = await Incident.create({ ...incidentExample, impact: 'none' })
    const newImpact: IncidentImpact = 'major'

    req = httpMocks.createRequest({
      method: 'PATCH',
      body: {
        impact: newImpact
      }
    })

    await views.updateIncidentView(req, res, next)
    expect(res.statusCode).toEqual(200)

    const updatedIncident = await Incident.findById(incident._id)
    expect(updatedIncident?.impact).toEqual(newImpact)
  })
  it('should delete incident', async () => {
    await Incident.create(incidentExample)
    req = httpMocks.createRequest({
      method: 'DELETE',
      body: incidentExample
    })

    await views.deleteIncidentView(req, res, next)
    expect(res.statusCode).toEqual(200)

    const incidents = await Incident.find({})
    expect(incidents.length).toEqual(0)
  })
})
