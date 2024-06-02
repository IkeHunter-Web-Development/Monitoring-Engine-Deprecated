import { GATEWAY_URL } from 'src/config'
import { httpRequest, type HttpResponse } from './config'
import type { NetworkAuthResponse, NetworkRequest } from './types/networkTypes'
import { authEndpoints, projectEndpoints } from './utils/endpoints'

const gatewayUrl = GATEWAY_URL

export const sendRequest = async (options: NetworkRequest) => {
  const res = await httpRequest({
    ...options.options,
    url: gatewayUrl + options.endpoint,
    method: options.method,
    params: options.params,
    data: options.data,
    headers: options.headers
  }).catch((err) => {
    console.log('err: ', err)
    return err
  })
  return res
}
export const getNetworkAuth = async (token: string): Promise<NetworkAuthResponse> => {
  const config: NetworkRequest = {
    endpoint: authEndpoints.verify,
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token
    }
  }
  const res: HttpResponse | any = await sendRequest(config)

  return {
    status: res.status,
    userId: res.data?.id,
    projects: res.data?.projects?.map((project: { id: any; name: string }) => String(project.id))
  }
}
export const getProjectInfo = async (token: string, projectId: string) => {
  const config: NetworkRequest = {
    endpoint: projectEndpoints.getOne(projectId),
    method: 'GET',
    headers: {
      Authorization: 'Token ' + token
    }
  }
  const res: HttpResponse | any = await sendRequest(config)

  return {
    status: res.status,
    projectname: res.data?.name,
    companyName: res.data?.company
  }
}
