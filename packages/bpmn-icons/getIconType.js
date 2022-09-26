import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { isEventSubProcess, isExpanded, isInterrupting } from "bpmn-js/lib/util/DiUtil";
import { isPlane } from "bpmn-js/lib/util/DrilldownUtil";

export default function getBpmnIconType(element) {
  const { type: elementType } = element;

  let type = getRawType(elementType);

  // (1) event definition types
  const eventDefinition = getEventDefinition(element);

  if (eventDefinition) {
    type = `${getEventDefinitionPrefix(eventDefinition)}${type}`;

    // (1.1) interrupting / non interrupting
    if (
      (is(element, "bpmn:StartEvent") && !isInterrupting(element)) ||
      (is(element, "bpmn:BoundaryEvent") && !isCancelActivity(element))
    ) {
      type = `${type}NonInterrupting`;
    }

    return type;
  }

  // (2) sub process types
  if (is(element, "bpmn:SubProcess") && !is(element, "bpmn:Transaction")) {
    if (isEventSubProcess(element)) {
      type = `Event${type}`;
    } else {
      const expanded = isExpanded(element) && !isPlane(element);
      type = `${expanded ? "Expanded" : "Collapsed"}${type}`;
    }
  }

  // (3) conditional + default flows
  if (isDefaultFlow(element)) {
    type = "DefaultFlow";
  }

  if (isConditionalFlow(element)) {
    type = "ConditionalFlow";
  }

  return type;
}

/////////////////////////////////// helpers

function getRawType(type) {
  return type.split(":")[1];
}

function getEventDefinition(element) {
  const businessObject = getBusinessObject(element),
    eventDefinitions = businessObject.eventDefinitions;

  return eventDefinitions && eventDefinitions[0];
}
function getEventDefinitionPrefix(eventDefinition) {
  const rawType = getRawType(eventDefinition.$type);
  return rawType.replace("EventDefinition", "");
}
function isCancelActivity(element) {
  const businessObject = getBusinessObject(element);
  return businessObject && businessObject.cancelActivity !== false;
}
function isDefaultFlow(element) {
  const businessObject = getBusinessObject(element);
  const sourceBusinessObject = getBusinessObject(element.source);

  if (!is(element, "bpmn:SequenceFlow") || !sourceBusinessObject) return false;

  return (
    sourceBusinessObject.default &&
    sourceBusinessObject.default === businessObject &&
    (is(sourceBusinessObject, "bpmn:Gateway") || is(sourceBusinessObject, "bpmn:Activity"))
  );
}

function isConditionalFlow(element) {
  const businessObject = getBusinessObject(element);
  const sourceBusinessObject = getBusinessObject(element.source);

  if (!is(element, "bpmn:SequenceFlow") || !sourceBusinessObject) return false;

  return businessObject.conditionExpression && is(sourceBusinessObject, "bpmn:Activity");
}
