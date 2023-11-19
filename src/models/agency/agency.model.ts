/**
 * @fileoverview Agency model.
 */
import mongoose from "mongoose";

export const AgencySchema = new mongoose.Schema({
  agencyId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Agency = mongoose.model("Agency", AgencySchema);

export default Agency;
