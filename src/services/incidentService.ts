import { type WebsiteMonitor } from 'src/models'

const sendRecipientsPushNotification = async (
  monitor: WebsiteMonitor,
  subject: string,
  body: string
): Promise<void> => {
  console.log('send notification:', monitor, subject, body)
  // const emailRecipients: string[] = monitor.recipients
  //   .filter((rec) => rec.preferredMethod === 'email')
  //   .map((rec) => rec.email ?? '')
  //   .filter((email) => email !== '')
  // const messageRecipients: string[] = monitor.recipients
  //   .filter((rec) => rec.preferredMethod === 'phone')
  //   .map((rec) => rec.phone ?? '')
  //   .filter((phone) => phone !== '')

  // console.log('email recipients:', emailRecipients)
  // console.log('message recipients:', messageRecipients)

  // if (emailRecipients.length > 0) {
  //   await NotificationProducer.sendEmailMessage(emailRecipients, subject, body)
  // }

  // if (messageRecipients.length > 0) {
  //   await NotificationProducer.sendSmsMessage(messageRecipients, body)
  // }
}

const notifyMonitorDown = async (
  monitor: WebsiteMonitor,
  statusCode: number,
  message: string
): Promise<void> => {
  const subject = `${monitor.title} is down`
  const body = `${monitor.title} is down. Status code: ${statusCode}. Message: ${message}`

  await sendRecipientsPushNotification(monitor, subject, body)
}

const notifyMonitorUp = async (monitor: WebsiteMonitor, statusCode: number): Promise<void> => {
  const subject = `${monitor.title} is back up`
  const body = `Monitor ${monitor.title} is back online. Status code: ${statusCode}`

  await sendRecipientsPushNotification(monitor, subject, body)
}

export const reportMonitorDown = async (monitor: WebsiteMonitor): Promise<void> => {
  await notifyMonitorDown(monitor, 500, '')
}
export const reportMonitorOnline = async (monitor: WebsiteMonitor): Promise<void> => {
  await notifyMonitorUp(monitor, 200)
}
