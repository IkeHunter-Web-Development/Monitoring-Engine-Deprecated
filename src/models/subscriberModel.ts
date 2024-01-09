import { Schema } from 'mongoose'
/**
 * @fileoverview User model.
 */
import mongoose from 'mongoose'

export const SubscriberSchema = new mongoose.Schema({
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
  monitors: [
    {
      type: Schema.Types.ObjectId
    }
  ],
  mode: {
    type: String,
    enum: ['email', 'phone'],
    default: 'email'
  },
  userId: {
    type: String,
    required: false
  }
})

export const Subscriber = mongoose.model('Subscriber', SubscriberSchema)
