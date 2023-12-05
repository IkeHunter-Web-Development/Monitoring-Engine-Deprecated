import mongoose from "mongoose";

export const setupDatabase = () =>
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((err: any) => {
      console.error.bind("Error connecting to MongoDB: ", err);
    });
