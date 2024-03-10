// declare type MonitorStatus = 'online' | 'alert' | 'offline' | 'pending'
// declare type IncidentStatus = 'open' | 'closed' | 'pending'
// declare enum MonitorStatus {
//   stable = 'stable',
//   alert = 'alert',
//   emergency = 'emergency',
//   pending = 'pending'
// }
declare type MonitorStatus = 'stable' | 'alert' | 'emergency' | 'pending'

// Info given by external services
// declare enum WebsiteAvailability {
//   online = 'online',
//   degraded = 'degraded',
//   offline = 'offline',
//   maintenance = 'maintenance',
//   pending = 'pending'
// }
declare type WebsiteAvailability = 'online' | 'degraded' | 'offline' | 'maintenance' | 'pending'

// declare enum NotificationMethod {
//   email = 'email',
//   phone = 'phone'
// }

declare type NotificationMethod = 'email' | 'phone'
