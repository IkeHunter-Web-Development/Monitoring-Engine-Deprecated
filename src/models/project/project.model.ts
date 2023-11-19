/**
 * @fileoverview Agency Project model.
 */
import mongoose from "mongoose";
import Agency, { AgencySchema } from "../agency/agency.model";

export const ProjectSchema = new mongoose.Schema({
  agency: {
    type: AgencySchema,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;