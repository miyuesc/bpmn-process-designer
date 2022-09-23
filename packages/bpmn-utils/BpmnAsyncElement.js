import { getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

export function isAsyncBefore(bo) {
  const prefix = getProcessEngine();
  return !!(bo.get(`${prefix}:asyncBefore`) || bo.get(`${prefix}:async`));
}

export function isAsyncAfter(bo) {
  const prefix = getProcessEngine();
  return !!bo.get(`${prefix}:asyncAfter`);
}

export function isAsync(bo) {
  return isAsyncAfter(bo) || isAsyncBefore(bo);
}
