import { AxiosHeaders, AxiosRequestConfig, Method, RawAxiosRequestHeaders } from "axios";

declare type NetworkResponse = {
  status: number;
  error?: string;
};

declare type NetworkAuthResponse = NetworkResponse & {
  userId?: string;
};

declare type NetworkProjectInfo = NetworkResponse & {
  projectTitle: string;
  companyName?: string;
};

declare type NetworkRequest = {
  endpoint: string;
  method: Method | string;
  params?: any;
  data?: any;
  headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
  options?: AxiosRequestConfig;
}
