import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { find } from "min-dash";

export function isErrorSupported(element) {
  return (
    isAny(element, ["bpmn:StartEvent", "bpmn:BoundaryEvent", "bpmn:EndEvent"]) && !!getErrorEventDefinition(element)
  );
}

export function getErrorEventDefinition(element) {
  return getEventDefinition(element, "bpmn:ErrorEventDefinition");
}

export function isTimerSupported(element) {
  return (
    isAny(element, ["bpmn:StartEvent", "bpmn:IntermediateCatchEvent", "bpmn:BoundaryEvent"]) &&
    !!getTimerEventDefinition(element)
  );
}

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */
export function getTimerDefinitionType(timer) {
  if (!timer) {
    return;
  }

  const timeDate = timer.get("timeDate");
  if (typeof timeDate !== "undefined") {
    return "timeDate";
  }

  const timeCycle = timer.get("timeCycle");
  if (typeof timeCycle !== "undefined") {
    return "timeCycle";
  }

  const timeDuration = timer.get("timeDuration");
  if (typeof timeDuration !== "undefined") {
    return "timeDuration";
  }
}

export function getTimerEventDefinition(element) {
  return getEventDefinition(element, "bpmn:TimerEventDefinition");
}

export function getError(element) {
  const errorEventDefinition = getErrorEventDefinition(element);

  return errorEventDefinition && errorEventDefinition.get("errorRef");
}

export function getEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);

  const eventDefinitions = businessObject.get("eventDefinitions") || [];

  return find(eventDefinitions, function (definition) {
    return is(definition, eventType);
  });
}

export function isMessageSupported(element) {
  return (
    is(element, "bpmn:ReceiveTask") ||
    (isAny(element, [
      "bpmn:StartEvent",
      "bpmn:EndEvent",
      "bpmn:IntermediateThrowEvent",
      "bpmn:BoundaryEvent",
      "bpmn:IntermediateCatchEvent"
    ]) &&
      !!getMessageEventDefinition(element))
  );
}

export function getMessageEventDefinition(element) {
  if (is(element, "bpmn:ReceiveTask")) {
    return getBusinessObject(element);
  }

  return getEventDefinition(element, "bpmn:MessageEventDefinition");
}

export function getMessage(element) {
  const messageEventDefinition = getMessageEventDefinition(element);

  return messageEventDefinition && messageEventDefinition.get("messageRef");
}

export function getLinkEventDefinition(element) {
  return getEventDefinition(element, "bpmn:LinkEventDefinition");
}

export function getSignalEventDefinition(element) {
  return getEventDefinition(element, "bpmn:SignalEventDefinition");
}

export function isLinkSupported(element) {
  return (
    isAny(element, ["bpmn:IntermediateThrowEvent", "bpmn:IntermediateCatchEvent"]) && !!getLinkEventDefinition(element)
  );
}

export function isSignalSupported(element) {
  return is(element, "bpmn:Event") && !!getSignalEventDefinition(element);
}

export function getSignal(element) {
  const signalEventDefinition = getSignalEventDefinition(element);

  return signalEventDefinition && signalEventDefinition.get("signalRef");
}

export function getEscalationEventDefinition(element) {
  return getEventDefinition(element, "bpmn:EscalationEventDefinition");
}

export function isEscalationSupported(element) {
  return is(element, "bpmn:Event") && !!getEscalationEventDefinition(element);
}

export function getEscalation(element) {
  const escalationEventDefinition = getEscalationEventDefinition(element);

  return escalationEventDefinition && escalationEventDefinition.get("escalationRef");
}

export function isCompensationSupported(element) {
  return isAny(element, ["bpmn:EndEvent", "bpmn:IntermediateThrowEvent"]) && !!getCompensateEventDefinition(element);
}

export function getCompensateEventDefinition(element) {
  return getEventDefinition(element, "bpmn:CompensateEventDefinition");
}

export function getCompensateActivity(element) {
  const compensateEventDefinition = getCompensateEventDefinition(element);

  return compensateEventDefinition && compensateEventDefinition.get("activityRef");
}
