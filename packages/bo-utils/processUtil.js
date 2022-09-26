import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

export function getProcessExecutable(element) {
  return !!element.businessObject.isExecutable;
}

export function setProcessExecutable(element, value) {
  const modeling = getModeler.getModeling();
  modeling.updateProperties(element, {
    isExecutable: value
  });
}

export function getProcessVersionTag(element) {
  const prefix = getProcessEngine();

  return element.businessObject.get(`${prefix}:versionTag`);
}

export function setProcessVersionTag(element, value) {
  const modeling = getModeler.getModeling();
  const prefix = getProcessEngine();

  modeling.updateProperties(element, {
    [`${prefix}:versionTag`]: value
  });
}
