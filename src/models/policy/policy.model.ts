import mongoose from "mongoose";

const UserId = mongoose.Types.ObjectId;
const MonitorId = mongoose.Types.ObjectId;
const CompanyId = mongoose.Types.ObjectId;

/**
 * @schema Policy
 * @description A policy is a set of rules that define
 * what a user can do with a resource. The base policy
 * connects to a user and records the time it was created.
 */
export const PolicySchema = new mongoose.Schema({
  userId: {
    type: UserId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    editable: false,
  },
});

/**
 * @schema MonitorPolicy
 * @description A monitor policy is a policy that defines
 * what a user can do with a monitor. This policy overrides
 * the company policy.
 */
const MonitorPolicySchema = new mongoose.Schema({
  monitorId: {
    type: MonitorId,
    ref: "Monitor",
  },
  allowRead: {
    type: Boolean,
    default: true,
  },
  allowUpdate: {
    type: Boolean,
    default: false,
  },
  allowDelete: {
    type: Boolean,
    default: false,
  },
});

/**
 * @schema CompanyPolicy
 * @description A company policy is a policy that defines
 * what a user can do with resources within a company. These
 * rules are set as the default for new users and can be overridden
 * by resource specific policies.
 */
const CompanyPolicySchema = new mongoose.Schema({
  companyId: {
    type: CompanyId,
    ref: "Company",
  },
  allowCreate: {
    type: Boolean,
    default: false,
  },
  allowRead: {
    type: Boolean,
    default: true,
  },
  allowUpdate: {
    type: Boolean,
    default: false,
  },
  allowDelete: {
    type: Boolean,
    default: false,
  },
});

const Policy = mongoose.model("Policy", PolicySchema);
export default Policy;

export const MonitorPolicy = Policy.discriminator("MonitorPolicy", MonitorPolicySchema);
export const CompanyPolicy = Policy.discriminator("CompanyPolicy", CompanyPolicySchema);
