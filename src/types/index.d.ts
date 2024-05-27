declare type MonitorStatus = 'stable' | 'alert' | 'critical' | 'pending'
declare type WebsiteAvailability = 'online' | 'degraded' | 'offline' | 'maintenance' | 'pending'
declare type NotificationMethod = 'email' | 'phone'
declare type IncidentImpact = 'none' | 'maintenance' | 'minor' | 'major' | 'critical'
declare type IncidentStatus =
  | 'active'
  | 'resolved'
  | 'pending'
  | 'investigating'
  | 'identified'
  | 'inProgress'
  | 'completed'
