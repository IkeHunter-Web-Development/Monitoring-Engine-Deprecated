export const validateEvent = async (data: any): Promise<IEvent> => {
  const { projectId, message, monitorId, timestamp } = data

  if (projectId == null) throw new Error('projectId is required')

  if (message == null) throw new Error('message is required')

  return {
    projectId,
    message,
    monitorId: monitorId ?? '',
    timestamp: timestamp ?? new Date()
  }
}
