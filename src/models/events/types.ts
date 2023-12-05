import { ObjectId } from "mongodb";
import mongoose, { Types } from "mongoose";

interface EventObject {
  monitorId: Types.ObjectId,
  statusCode: number;
  online: boolean;
  timestamp: Date;
  message?: string;
  responseTime?: number;
}

export type EventType = mongoose.Document & EventObject;
export type EventArray = EventType[];
export type EventPromise = Promise<EventType>;
export type EventPromiseOrNull = Promise<EventType | null>;
export type EventArrayPromise = Promise<EventType[]>;

