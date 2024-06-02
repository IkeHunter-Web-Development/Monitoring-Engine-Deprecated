export const getNDaysAgo = (daysAgo: number): Date =>
  new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * daysAgo)
export const getNHoursAgo = (hoursAgo: number): Date =>
  new Date(new Date().getTime() - 1000 * 60 * 60 * hoursAgo)
