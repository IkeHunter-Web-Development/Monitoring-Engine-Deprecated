/**
 * @fileoverview Test the policy model.
 */
import {
  MonitorType,
  MonitorPolicyActions as MonitorActions,
  MonitorNamespace as MONITOR,
} from "../../monitor/utils/monitor.types";
import { generateSampleMonitor } from "../../monitor/utils/monitor.util";
import { UserType } from "../../user/utils/user.types";
import { generateSampleUser } from "../../user/utils/user.util";
import { PolicyEffect } from "../policy.model";
import PolicyManager from "../policy.manager";
import { policyTemplate, DefaultActions } from "../utils/policy.types";

describe("Policy Model", () => {
  let user: UserType;
  let monitor: MonitorType;

  beforeEach(async () => {
    user = await generateSampleUser();
    monitor = await generateSampleMonitor();
  });

  test("creating policy from json", () => {
    let template: any = {
      title: "Test Policy",
      statement: [
        {
          name: "Test Statement",
          effect: "Allow",
          actions: ["*"],
        },
      ],
      resource: [monitor._id],
    };
    template = JSON.stringify(template);

    let policy = PolicyManager.generatePolicyFromJson(user.userId, template);

    expect(policy).toBeDefined();
  });

  test("generating policy for user", () => {
    let template: policyTemplate = {
      title: "Test Policy",
      statement: [
        {
          name: "Test Statement",
          effect: PolicyEffect.ALLOW,
          actions: [DefaultActions.ALL],
        },
      ],
      resource: [monitor._id],
    };

    let policy = PolicyManager.generatePolicy(user.userId, template);

    expect(policy).toBeDefined();

    let allowed = user.hasPermission(MONITOR, MonitorActions.READ, monitor._id);

    expect(allowed).toBeTruthy();
  });
});
