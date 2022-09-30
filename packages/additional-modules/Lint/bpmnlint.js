/**
 * 源代码地址：https://codesandbox.io/s/5nj1t?file=/src/index.js
 * @author felix.mueller
 */

import rule_0 from "bpmnlint/rules/conditional-flows";
import rule_1 from "bpmnlint/rules/end-event-required";
import rule_2 from "bpmnlint/rules/event-sub-process-typed-start-event";
import rule_3 from "bpmnlint/rules/fake-join";
import rule_4 from "bpmnlint/rules/label-required";
import rule_5 from "bpmnlint/rules/no-bpmndi";
import rule_6 from "bpmnlint/rules/no-complex-gateway";
import rule_7 from "bpmnlint/rules/no-disconnected";
import rule_8 from "bpmnlint/rules/no-duplicate-sequence-flows";
import rule_9 from "bpmnlint/rules/no-gateway-join-fork";
import rule_10 from "bpmnlint/rules/no-implicit-split";
import rule_11 from "bpmnlint/rules/no-inclusive-gateway";
import rule_12 from "bpmnlint/rules/single-blank-start-event";
import rule_13 from "bpmnlint/rules/single-event-definition";
import rule_14 from "bpmnlint/rules/start-event-required";
import rule_15 from "bpmnlint/rules/sub-process-blank-start-event";
import rule_16 from "bpmnlint/rules/superfluous-gateway";

import taskRequired from "@packages/additional-modules/Lint/customLintRules/taskRequired";

const cache = {};
cache["bpmnlint/conditional-flows"] = rule_0;
cache["bpmnlint/end-event-required"] = rule_1;
cache["bpmnlint/event-sub-process-typed-start-event"] = rule_2;
cache["bpmnlint/fake-join"] = rule_3;
cache["bpmnlint/label-required"] = rule_4;
cache["bpmnlint/no-bpmndi"] = rule_5;
cache["bpmnlint/no-complex-gateway"] = rule_6;
cache["bpmnlint/no-disconnected"] = rule_7;
cache["bpmnlint/no-duplicate-sequence-flows"] = rule_8;
cache["bpmnlint/no-gateway-join-fork"] = rule_9;
cache["bpmnlint/no-implicit-split"] = rule_10;
cache["bpmnlint/no-inclusive-gateway"] = rule_11;
cache["bpmnlint/single-blank-start-event"] = rule_12;
cache["bpmnlint/single-event-definition"] = rule_13;
cache["bpmnlint/start-event-required"] = rule_14;
cache["bpmnlint/sub-process-blank-start-event"] = rule_15;
cache["bpmnlint/superfluous-gateway"] = rule_16;
cache["bpmnlint/task-required"] = taskRequired;

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 */
function Resolver() {}

Resolver.prototype.resolveRule = function (pkg, ruleName) {
  const rule = cache[pkg + "/" + ruleName];

  if (!rule) {
    throw new Error("cannot resolve rule <" + pkg + "/" + ruleName + ">");
  }

  return rule;
};

Resolver.prototype.resolveConfig = function (pkg, configName) {
  throw new Error("cannot resolve config <" + configName + "> in <" + pkg + ">");
};

export const resolver = new Resolver();

export const rules = {
  "conditional-flows": "error",
  "end-event-required": "error",
  "event-sub-process-typed-start-event": "error",
  "fake-join": "warn",
  "label-required": "off",
  "no-bpmndi": "error",
  "no-complex-gateway": "error",
  "no-disconnected": "error",
  "no-duplicate-sequence-flows": "error",
  "no-gateway-join-fork": "error",
  "no-implicit-split": "error",
  "no-inclusive-gateway": "error",
  "single-blank-start-event": "error",
  "single-event-definition": "error",
  "start-event-required": "error",
  "sub-process-blank-start-event": "error",
  "superfluous-gateway": "warning"
};

export const config = {
  rules: rules
};

export default {
  resolver: resolver,
  config: config
};
