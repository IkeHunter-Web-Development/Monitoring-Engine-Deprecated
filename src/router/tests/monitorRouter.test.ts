import request from 'supertest'
import { server } from 'src/config/server'

describe('monitorRouter', () => {
  it('should return 200 OK', async () => {
    const res = await request(server).get('/')
    expect(res.statusCode).toEqual(200)
  })
})
