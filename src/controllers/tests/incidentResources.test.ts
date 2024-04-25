import { Incident, WebsiteMonitor } from 'src/models'
import { createTestIncidents, incidentExample, monitorExample } from 'src/utils'
import {
  incidentCreate,
  incidentDelete,
  incidentGetList,
  incidentGetOne,
  incidentUpdate
} from '../incidentResources'

describe('Incident resource creation controller tests', () => {
  it('should create incident', async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)
    const payload: IIncident = {
      monitorId: monitor._id.toString(),
      impact: 'maintenance',
      status: 'pending',
      cause: 'Example cause'
    }

    const incident = await incidentCreate(payload)

    expect(incident.monitorId).toEqual(monitor._id)
    expect(incident.impact).toEqual(payload.impact)
    expect(incident.status).toEqual(payload.status)

    const query = await Incident.find({ monitorId: monitor._id })
    expect(query.length).toEqual(1)
  })
})

describe('Incident resource controller tests', () => {
  // let monitor: WebsiteMonitor
  // let incident: Incident

  beforeEach(async () => {
    const monitor = await WebsiteMonitor.create(monitorExample)
    await Incident.create({ ...incidentExample, monitorId: monitor._id })

    const dbQuery = await Incident.find({})
    expect(dbQuery.length).toEqual(1)
  })

  it('should get incident', async () => {
    const dbIncidents = await Incident.find({})
    const dbIncident = dbIncidents[0]
    const incidentResult = await incidentGetOne(dbIncident._id)

    expect(incidentResult._id).toEqual(dbIncident._id)

    const newIncidents = await Incident.find({})
    expect(newIncidents.length).toEqual(dbIncidents.length)
  })
  it('should get multiple incidents', async () => {
    await createTestIncidents(3)
    const dbIncidents = await Incident.find({})
    const incidents = await incidentGetList()

    expect(incidents.length).toEqual(dbIncidents.length)
  })
  it('should update incident', async () => {
    const dbIncident = (await Incident.find({}))[0]
    const payload: Partial<IIncident> = {
      notes: dbIncident.notes + ' updated'
    }

    const updatedIncident = await incidentUpdate(dbIncident._id, payload)

    expect(updatedIncident.notes).toEqual(payload.notes)
  })
  it('should delete incident', async () => {
    const dbIncident = (await Incident.find({}))[0]
    await incidentDelete(dbIncident._id)

    const dbQuery = await Incident.find({})
    expect(dbQuery.length).toEqual(0)
  })
})
