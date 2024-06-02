import { createProducer } from '../lib/kafka'

interface EmailFields {
  toEmails: string[]
  subject: string
  body: string
}

interface SmsFields {
  toNumbers: string[]
  body: string
}

// const eventQueue = EventQueue.getInstance()
// const notificationProducer = new EventProducer(eventQueue, 'notifications')

// const topic = 'notifications'

export const produceSendEmail = createProducer<EmailFields>('notification-send-email')
export const produceSendSms = createProducer<SmsFields>('notification-send-sms')
