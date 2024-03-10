/**
 * Business Logic and Resource Services
 *
 * Resource services are responsible for the primary
 * business logic of the system. Any data calculation,
 * analysis, or aggregation is done here. They cannot call
 * other services, and should get all external data passed
 * in via data or dependency injection.
 */

export * as MonitorService from './monitorService'
