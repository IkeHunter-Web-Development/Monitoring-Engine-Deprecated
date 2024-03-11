import { httpRequest } from '../config'
import type { WebsiteMonitor } from 'src/models'
import { generateMonitor } from 'src/utils/testing'
import { getNetworkAuth, getProjectInfo, sendRequest } from '../network'
import type { NetworkAuthResponse } from '../types/networkTypes'
import {
  projectInfoNotFoundResponse,
  projectInfoSuccessResponse,
  verifyUserInvalidResponse,
  verifyUserSuccessResponse
} from '../utils/responses'

// mockJest()
jest.mock('../config.ts')

const mockRequest = httpRequest as any

describe('Network manager tests', () => {
  test('making api request', async () => {
    mockRequest.mockResolvedValue({ message: 'success' })
    sendRequest({ endpoint: '/api/test', method: 'GET' }).then((res) => {
      expect(res).toStrictEqual({ message: 'success' })
    })
  })

  test('authenticating with auth service, valid token', async () => {
    mockRequest.mockResolvedValue(verifyUserSuccessResponse)

    const token = 'auth-service-token'
    const res: NetworkAuthResponse = await getNetworkAuth(token)

    expect(res.userId).toEqual(verifyUserSuccessResponse.data.id)
  })

  test('authenticating with auth service, invalid token', async () => {
    mockRequest.mockResolvedValue(verifyUserInvalidResponse)

    const token = 'invalid-token'
    const res: NetworkAuthResponse = await getNetworkAuth(token)

    expect(res.status).toEqual(verifyUserInvalidResponse.status)
    expect(res.userId).toBeUndefined()
  })

  test('getting project info, valid project', async () => {
    mockRequest.mockResolvedValue(projectInfoSuccessResponse)
    const monitor: WebsiteMonitor = await generateMonitor()

    const token = 'valid-token'
    const res = await getProjectInfo(token, monitor.projectId)

    expect(res.projectTitle).toEqual(projectInfoSuccessResponse.data.title)
    expect(res.companyName).toEqual(projectInfoSuccessResponse.data.company)
  })

  test('getting project info, invalid project', async () => {
    mockRequest.mockResolvedValue(projectInfoNotFoundResponse)

    const monitor: WebsiteMonitor = await generateMonitor()

    const token = 'valid-token'
    const res = await getProjectInfo(token, monitor.projectId)

    expect(res.projectTitle).toBeUndefined()
    expect(res.companyName).toBeUndefined()
    expect(res.status).toEqual(projectInfoNotFoundResponse.status)
  })

  // test("scheduling monitor", async () => {
  //   // TODO: test scheduling monitor for ping job
  //   expect(false).toBeTruthy();
  // });

  // test("removing scheduled monitor", async () => {
  //   // TODO: test removing scheduled monitor from service
  //   expect(false).toBeTruthy();
  // });
})
