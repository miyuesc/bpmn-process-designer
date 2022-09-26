import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { getModeler, getProcessEngine } from "@packages/bpmn-utils/BpmnDesignerUtils";

////////// only in bpmn:StartEvent
export function getInitiatorValue(element) {
  const prefix = getProcessEngine();
  const businessObject = getBusinessObject(element);

  return businessObject.get(`${prefix}:initiator`);
}
export function setInitiatorValue(element, value) {
  const prefix = getProcessEngine();
  const modeling = getModeler.getModeling();
  const businessObject = getBusinessObject(element);
  modeling.updateModdleProperties(element, businessObject, {
    [`${prefix}:initiator`]: value
  });
}

export function isStartInitializable(element) {
  const prefix = getProcessEngine();
  return is(element, `${prefix}:Initiator`) && !is(element.parent, "bpmn:SubProcess");
}
