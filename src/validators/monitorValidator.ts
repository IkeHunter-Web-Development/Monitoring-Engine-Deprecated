import { type IMonitor } from 'src/models'

export const validateMonitor = (data: any): IMonitor => {
  const { projectId, url, title } = data

  // TODO: Create partial and full verification
  // if (projectId == null) throw new Error('projectId is required')
  // if (url == null) throw new Error('url is required')
  // if (title == null) throw new Error('title is required')

  return {
    ...data,
    projectId,
    url,
    title
  }
}
