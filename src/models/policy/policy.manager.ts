/**
 * @fileoverview Policy manager.
 */
import Policy from "./policy.model";
import { PolicyTemplateType, policyTemplate } from "./utils/policy.types";

let policy;

export default class PolicyManager {
  private static instance: PolicyManager;
  private constructor() {}

  public static generatePolicy(userId: string, template: policyTemplate) {}
  public static generatePolicyFromJson(userId: string, template: JSON) {}
}
