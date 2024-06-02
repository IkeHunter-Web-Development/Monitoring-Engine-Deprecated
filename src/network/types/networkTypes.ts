import type { AxiosHeaders, AxiosRequestConfig, Method, RawAxiosRequestHeaders } from 'axios'

export declare type NetworkResponse = {
  status: number
  error?: string
}

export declare type NetworkAuthResponse = NetworkResponse & {
  userId?: string
  projects?: string[]
}

export declare type NetworkProjectInfo = NetworkResponse & {
  projectname: string
  companyName?: string
}

export declare type NetworkRequest = {
  endpoint: string
  method: Method | string
  params?: any
  data?: any
  // headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
  headers?: RawAxiosRequestHeaders | AxiosHeaders
  options?: AxiosRequestConfig
}
