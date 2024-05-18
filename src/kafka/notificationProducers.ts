import { createProducer } from './kafkaClient'

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

const topic = 'notifications'

export const produceSendEmail = createProducer<EmailFields>(topic, 'send-email')
export const produceSendSms = createProducer<SmsFields>(topic, 'send-sms')
