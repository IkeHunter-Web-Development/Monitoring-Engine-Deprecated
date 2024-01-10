// export const AUTH_URL = "/api/user/verify/";
// export const PROJECT_URL = "/api/project/projects/";

// export const PROJECT_SINGLE_URL = (id: string) => {
//   return PROJECT_URL + id;
// }

export const PROJECT_SERVICE = {
  getMany: '/api/project/projects/',
  getOne: (id: string) => {
    return '/api/project/projects/' + id
  }
}

export const AUTH_SERVICE = {
  verify: '/api/user/verify/'
}

export const SCHEDULE_SERVICE = {
  createMonitor: '/api/schedule/monitor/',
  deleteMonitor: (id: string) => {
    return '/api/schedule/monitor/' + id
  }
}
