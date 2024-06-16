/**
 * @fileoverview User model.
 */
import mongoose, { Types } from 'mongoose'

const notificationMethodOptions: NotificationMethod[] = ['email', 'phone']
const defaultNotificationMethod: NotificationMethod = 'email'

export const SubscriberSchema = new mongoose.Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
    default: new Types.ObjectId()
  },
  displayName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  method: {
    // TODO: use global enum
    type: String,
    // enum: ['email', 'phone'],
    enum: notificationMethodOptions,
    default: defaultNotificationMethod
  },
  userId: {
    type: String,
    required: false
  }
})

// export const Subscriber = mongoose.model('Subscriber', SubscriberSchema)
// export type Subscriber = InstanceType<typeof Subscriber>
