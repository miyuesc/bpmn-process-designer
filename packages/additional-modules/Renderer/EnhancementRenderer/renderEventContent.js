// 绘制事件节点中的元素
import { getSemantic, isThrowEvent, isTypedEvent } from "../utils";

export default function renderEventContent(handlers, element, parentGfx) {
  const event = getSemantic(element);
  const isThrowing = isThrowEvent(event);
  if (event.eventDefinitions && event.eventDefinitions.length > 1) {
    if (event.parallelMultiple) {
      return handlers["bpmn:ParallelMultipleEventDefinition"](parentGfx, element, isThrowing);
    } else {
      return handlers["bpmn:MultipleEventDefinition"](parentGfx, element, isThrowing);
    }
  }
  if (isTypedEvent(event, "bpmn:MessageEventDefinition")) {
    return handlers["bpmn:MessageEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:TimerEventDefinition")) {
    return handlers["bpmn:TimerEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:ConditionalEventDefinition")) {
    return handlers["bpmn:ConditionalEventDefinition"](parentGfx, element);
  }
  if (isTypedEvent(event, "bpmn:SignalEventDefinition")) {
    return handlers["bpmn:SignalEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:EscalationEventDefinition")) {
    return handlers["bpmn:EscalationEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:LinkEventDefinition")) {
    return handlers["bpmn:LinkEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:ErrorEventDefinition")) {
    return handlers["bpmn:ErrorEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:CancelEventDefinition")) {
    return handlers["bpmn:CancelEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:CompensateEventDefinition")) {
    return handlers["bpmn:CompensateEventDefinition"](parentGfx, element, isThrowing);
  }
  if (isTypedEvent(event, "bpmn:TerminateEventDefinition")) {
    return handlers["bpmn:TerminateEventDefinition"](parentGfx, element, isThrowing);
  }
  return null;
}
