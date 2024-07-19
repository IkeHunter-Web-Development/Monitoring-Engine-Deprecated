import { createProducer } from 'src/lib'

export const produceSendEmail = createProducer<EmailFields>('notification-send-email')
export const produceSendSms = createProducer<SmsFields>('notification-send-sms')
