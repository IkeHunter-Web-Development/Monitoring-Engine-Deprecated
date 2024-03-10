/**
 * Service and Resource Controllers
 *
 * Controllers interface between the different domains of the application
 * in order to provide a strucutred internal api for views, events, and
 * other services to access.
 */

export {
  createMonitor,
  deleteMonitor,
  getMonitor,
  getMonitors,
  updateMonitor,
  getMonitorEvents
} from './monitorController'
