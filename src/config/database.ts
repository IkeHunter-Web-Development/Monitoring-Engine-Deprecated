import mongoose from "mongoose";
import { MONGO_URI } from "config/constants";

export const setupDatabase = () =>
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err: any) => {
      console.error.bind("Error connecting to MongoDB: ", err);
    });
