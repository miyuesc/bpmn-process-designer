import { is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

////////// only in element extends bpmn:Task
export function getACBefore(element) {
  const prefix = getProcessEngine();
  return isAsyncBefore(element.businessObject, prefix);
}
export function setACBefore(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  // overwrite the legacy `async` property, we will use the more explicit `asyncBefore`
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:asyncBefore`]: value,
    [`${prefix}:async`]: undefined
  });
}

export function getACAfter(element) {
  const prefix = getProcessEngine();
  return isAsyncAfter(element.businessObject, prefix);
}
export function setACAfter(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:asyncAfter`]: value
  });
}

export function getACExclusive(element) {
  const prefix = getProcessEngine();
  return isExclusive(element.businessObject, prefix);
}
export function setACExclusive(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.get("modeling");
  modeling.updateModdleProperties(element, element.businessObject, {
    [`${prefix}:exclusive`]: value
  });
}

//////////////////// helper
// 是否支持异步属性
export function isAsynchronous(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:AsyncCapable`);
}

// Returns true if the attribute 'asyncBefore' is set to true.
function isAsyncBefore(bo, prefix) {
  return !!(bo.get(`${prefix}:asyncBefore`) || bo.get(`${prefix}:async`));
}

// Returns true if the attribute 'asyncAfter' is set to true.
function isAsyncAfter(bo, prefix) {
  return !!bo.get(`${prefix}:asyncAfter`);
}

// Returns true if the attribute 'exclusive' is set to true.
function isExclusive(bo, prefix) {
  return !!bo.get(`${prefix}:exclusive`);
}
