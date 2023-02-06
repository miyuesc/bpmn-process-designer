import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";
import { createModdleElement, getExtensionElementsList } from "@packages/bpmn-utils/BpmnExtensionElements";
import { getServiceTaskLikeBusinessObject } from "@packages/bpmn-utils/BpmnImplementationType";
import { getTimerEventDefinition } from "@packages/bpmn-utils/BpmnEventDefinition";
import { isAsync } from "@packages/bpmn-utils/BpmnAsyncElement";

//
export function retryTimeCycleVisible(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  return (is(element, `${prefix}:AsyncCapable`) && isAsync(businessObject)) || !!isTimerEvent(element);
}
export function taskPriorityVisible(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  return (
    (is(element, `${prefix}:JobPriorized`) && isAsync(businessObject)) ||
    is(element, "bpmn:Process") ||
    (is(element, "bpmn:Participant") && businessObject.get("processRef")) ||
    !!isTimerEvent(element)
  );
}
export function isJobExecutable(element) {
  return retryTimeCycleVisible(element) || taskPriorityVisible(element);
}

// 任务优先级
export function getExternalTaskValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getRelativeBusinessObject(element);
  return businessObject.get(`${prefix}:taskPriority`);
}
export function setExternalTaskValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getRelativeBusinessObject(element);
  modeling.updateModdleProperties(element, businessObject, {
    [`${prefix}:taskPriority`]: value
  });
}

// 重试周期
export function getRetryTimeCycleValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);
  const failedJobRetryTimeCycle = getExtensionElementsList(businessObject, `${prefix}:FailedJobRetryTimeCycle`)[0];
  return failedJobRetryTimeCycle && failedJobRetryTimeCycle.body;
}
export function setRetryTimeCycleValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getBusinessObject(element);

  let extensionElements = businessObject.get("extensionElements");
  if (!extensionElements) {
    extensionElements = createModdleElement("bpmn:ExtensionElements", { values: [] }, businessObject);
    modeling.updateModdleProperties(element, businessObject, { extensionElements });
  }

  let failedJobRetryTimeCycle = getExtensionElementsList(businessObject, `${prefix}:FailedJobRetryTimeCycle`)[0];
  if (!failedJobRetryTimeCycle) {
    failedJobRetryTimeCycle = createModdleElement(`${prefix}:FailedJobRetryTimeCycle`, {}, extensionElements);
    modeling.updateModdleProperties(element, extensionElements, {
      values: [...extensionElements.get("values"), failedJobRetryTimeCycle]
    });
  }

  modeling.updateModdleProperties(element, failedJobRetryTimeCycle, { body: value });
}

/////////// helpers
function isExternalTaskLike(element) {
  const prefix = getProcessEngine();
  const bo = getServiceTaskLikeBusinessObject(element),
    type = bo && bo.get(`${prefix}:type`);
  return bo && is(bo, `${prefix}:ServiceTaskLike`) && type && type === "external";
}

function getRelativeBusinessObject(element) {
  let businessObject;
  if (is(element, "bpmn:Participant")) {
    businessObject = getBusinessObject(element).get("processRef");
  } else if (isExternalTaskLike(element)) {
    businessObject = getServiceTaskLikeBusinessObject(element);
  } else {
    businessObject = getBusinessObject(element);
  }
  return businessObject;
}

function isTimerEvent(element) {
  return is(element, "bpmn:Event") && getTimerEventDefinition(element);
}
