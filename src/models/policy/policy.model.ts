/**
 * @fileoverview Policy models.
 * Central/Project engine is responsible for creating
 * User and Company objects, monitor engine will just sync
 * with that data.
 */
import mongoose from "mongoose";

// import { MonitorsPolicySchema, SingleMonitorPolicySchema } from "../monitor/monitor.policy";

const UserId = mongoose.Types.ObjectId;
const CompanyId = mongoose.Types.ObjectId;

export const PolicyNamespace = "policy";

export enum PolicyEffect {
  ALLOW = "Allow",
  DENY = "Deny",
}

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
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    editable: false,
  },
});

export const PolicyStatementTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  effect: {
    type: String,
    default: "Allow",
    enum: ["Allow", "Deny"],
  },
  // effect: {
  //   type: PolicyEffect,
  //   default: PolicyEffect.ALLOW,
  // },
  action: [String],
  resource: [String],
});

export const PolicyTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  namespace: {
    type: String,
    default: "",
  },
  statement: [PolicyStatementTemplateSchema],
});

/**
 * @schema CompanyPolicy
 * @description A company policy is a policy that defines
 * what a user can do with resources within a company. These
 * rules are set as the default for new users and can be overridden
 * by resource specific policies.
 */
// const CompanyPolicySchema = new mongoose.Schema({
//   companyId: {
//     type: CompanyId,
//     ref: "Company",
//   },
//   /** Can create new company connections */
//   allowCompanyCreate: {
//     type: Boolean,
//     default: false,
//   },
//   /** Can delete company connections */
//   allowCompanyDelete: {
//     type: Boolean,
//     default: false,
//   },

//   /** General resource management */
//   allowResourceCreate: {
//     type: Boolean,
//     default: false,
//   },
//   allowResourceRead: {
//     type: Boolean,
//     default: true,
//   },
//   allowResourceUpdate: {
//     type: Boolean,
//     default: false,
//   },
//   allowResourceDelete: {
//     type: Boolean,
//     default: false,
//   },

//   /** Granular resource control */
//   // defaultMonitorsPermissions: [MonitorsPolicySchema],
//   // defaultSingleMonitorPermissions: [SingleMonitorPolicySchema],
// });

const Policy = mongoose.model("Policy", PolicySchema);
export default Policy;

// export const CompanyPolicy = Policy.discriminator("CompanyPolicy", CompanyPolicySchema);

// export const PolicyStatementTemplate = mongoose.model("PolicyStatementTemplate", PolicyStatementTemplateSchema);
// export const PolicyTemplate = mongoose.model("PolicyTemplate", PolicyTemplateSchema);
