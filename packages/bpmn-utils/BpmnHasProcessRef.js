import { is } from "bpmn-js/lib/util/ModelUtil";

function hasProcessRef(element) {
  return (is(element, "bpmn:Participant") && element.businessObject.get("processRef")) || is(element, "bpmn:Process");
}
