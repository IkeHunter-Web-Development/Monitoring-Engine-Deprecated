import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

const instance = axios.create({
  timeout: 3000
})

export const httpRequest = async (options: AxiosRequestConfig): Promise<any> => {
  const res = await instance.request(options)
  return res
}

export type HttpResponse = AxiosResponse
