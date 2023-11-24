/**
 * @fileoverview User model.
 */
import mongoose from "mongoose";
// import { AgencySchema } from "../agency/agency.model";
// import { ProjectSchema } from "../project/project.model";

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  projectIds: {
    type: Array,
    required: false
  }
  // agencyIds: {
  //   type: Array,
  //   required: false,
  // },
  // agencies: [AgencySchema],
  // projects: [ProjectSchema],
  
});

const User = mongoose.model("User", userSchema);
export default User;
