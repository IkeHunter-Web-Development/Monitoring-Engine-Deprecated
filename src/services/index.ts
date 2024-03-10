/**
 * Business Logic and Update Handlers
 *
 * Services are responsible for the primary
 * business logic of the system. Any data calculation,
 * analysis, or aggregation is done here. They cannot call
 * other services, and should get all external data passed
 * in via data or dependency injection.
 *
 * If an action on a model requires 2+ fields to be edited, or
 * for an additional object to be created, that action should
 * be deferred to a service. Otherwise, it can be done in the
 * appropriate controller.
 */

export * as MonitorService from './_depricated/monitorService'
