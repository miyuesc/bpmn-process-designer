import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine, LISTENER_ALLOWED_TYPES } from "@packages/bpmn-utils/BpmnDesignerUtils";
import {
  getExtensionElementsList,
  addExtensionElements,
  removeExtensionElements
} from "@packages/bpmn-utils/BpmnExtensionElements";
import { createScript } from "@packages/bo-utils/scriptUtil";

export const EXECUTION_LISTENER_TYPE = {
  class: "Java class",
  expression: "Expression",
  delegateExpression: "Delegate expression",
  script: "Script"
};

// execution listener list
export function getExecutionListeners(element) {
  const prefix = getProcessEngine();
  const businessObject = getListenersContainer(element);
  return getExtensionElementsList(businessObject, `${prefix}:ExecutionListener`);
}

// create an empty execution listener and update element's businessObject
export function addEmptyExtensionListener(element) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const listener = moddle.create(`${prefix}:ExecutionListener`, {
    event: getDefaultEvent(element),
    class: ""
  });
  const businessObject = getListenersContainer(element);
  addExtensionElements(element, businessObject, listener);
}

// create an execution listener with props
export function addExecutionListener(element, props) {
  const prefix = getProcessEngine();
  const moddle = getModeler.getModdle();
  const businessObject = getListenersContainer(element);
  const listener = moddle.create(`${prefix}:ExecutionListener`, {});
  updateListenerProperty(element, listener, props);
  addExtensionElements(element, businessObject, listener);
}

// update execution listener's property
export function updateExecutionListener(element, props, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
  addExecutionListener(element, props);
}

// remove an execution listener
export function removeExecutionListener(element, listener) {
  removeExtensionElements(element, getListenersContainer(element), listener);
}

////////////// helpers
export function isExecutable(element) {
  if (isAny(element, LISTENER_ALLOWED_TYPES)) return true;
  if (is(element, "bpmn:Participant")) {
    return !!element.businessObject.processRef;
  }
  return false;
}

export function getExecutionListenerType(listener) {
  const prefix = getProcessEngine();
  if (isAny(listener, [`${prefix}:ExecutionListener`])) {
    if (listener.get(`${prefix}:class`)) return "class";
    if (listener.get(`${prefix}:expression`)) return "expression";
    if (listener.get(`${prefix}:delegateExpression`)) return "delegateExpression";
    if (listener.get("script")) return "script";
  }
  return "";
}

export function getListenersContainer(element) {
  const businessObject = getBusinessObject(element);
  return businessObject?.get("processRef") || businessObject;
}

export function getDefaultEvent(element) {
  return is(element, "bpmn:SequenceFlow") ? "take" : "start";
}

export function getExecutionListenerTypes(element) {
  if (is(element, "bpmn:SequenceFlow")) {
    return [{ label: "Take", value: "take" }];
  }
  return [
    { label: "Start", value: "start" },
    { label: "End", value: "end" }
  ];
}

function updateListenerProperty(element, listener, props) {
  const modeling = getModeler.getModeling();
  const prefix = getProcessEngine();
  const { event, class: listenerClass, expression, delegateExpression, script, type, fields } = props;

  const updateProperty = (key, value) =>
    modeling.updateModdleProperties(element, listener, { [`${prefix}:${key}`]: value });

  event && updateProperty("event", event);
  listenerClass && updateProperty("class", listenerClass);
  expression && updateProperty("expression", expression);
  delegateExpression && updateProperty("delegateExpression", delegateExpression);
  console.log(props);

  if (script) {
    const bpmnScript = createScript(script);
    modeling.updateModdleProperties(element, listener, { script: bpmnScript });
  }
}
