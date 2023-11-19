/**
 * @fileoverview Monitor permissions.
 * This functionality is not yet implemented, and will
 * integrate into the permissions service.
 */
export const Namespace: String = "monitor";

export enum MonitorResourcePermissions {
  GET = "monitor:GetMonitor",
  MODIFY = "monitor:ModifyMonitor",
  DELETE = "monitor:DeleteMonitor",
}

export enum MonitoragencyPermissions {
  CREATE = "monitor:CreateMonitor",
}
