import { EventProducer, EventQueue } from 'src/lib'

export interface EmailFields {
  toEmails: string[]
  subject: string
  body: string
}

export interface SmsFields {
  toNumbers: string[]
  body: string
}

const eventQueue = EventQueue.getInstance()
const notificationProducer = new EventProducer(eventQueue, 'notifications')

const sendEmail = notificationProducer.createProducer<EmailFields>('send-email')
const sendSms = notificationProducer.createProducer<SmsFields>('send-sms')

export const sendEmailEvent = sendEmail
export const sendSmsEvent = sendSms
