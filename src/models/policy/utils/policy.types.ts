import mongoose from "mongoose";
import Policy, { PolicyEffect } from "../policy.model";

export enum DefaultActions {
  ALL = "*",
}

export interface policyStatementTemplate {
  name: string;
  effect: PolicyEffect;
  actions: string[];
}

export interface policyTemplate {
  title: string;
  statement: policyStatementTemplate[];
  resource: string[];
}

export type PolicyStatementTemplateType = mongoose.Document & policyStatementTemplate;

export type PolicyTemplateType = mongoose.Document & policyTemplate;
