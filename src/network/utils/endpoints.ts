// export const AUTH_URL = "/api/user/verify/";
// export const PROJECT_URL = "/api/project/projects/";

// export const PROJECT_SINGLE_URL = (id: string) => {
//   return PROJECT_URL + id;
// }

export const projectEndpoints = {
  getMany: '/api/project/projects/',
  getOne: (id: string) => {
    return '/api/project/projects/' + id
  }
}

export const authEndpoints = {
  verify: '/api/user/verify/'
}

export const scheduleEndpoints = {
  createMonitor: '/api/schedule/monitor/',
  deleteMonitor: (id: string) => {
    return '/api/schedule/monitor/' + id
  }
}
